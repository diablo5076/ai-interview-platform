"use client";

import {
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

import type { HeadDirection } from "@/components/interview/video/HeadPoseIndicator";

export interface FaceTrackingState {
  hasFace: boolean;
  faceCount: number;
  headDirection: HeadDirection;
  lookingAway: boolean;
  loading: boolean;
}

const WASM_PATH =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";

const MODEL_PATH =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task";

export function useFaceTracker(
  videoRef: RefObject<HTMLVideoElement | null>
) {
  const landmarkerRef =
    useRef<FaceLandmarker | null>(null);

  const animationFrameRef =
    useRef<number | null>(null);

  const mountedRef =
    useRef(false);

  const detectingRef =
    useRef(false);

  const lastTimestampRef =
    useRef(0);

  const initializationIdRef =
    useRef(0);

  const [state, setState] =
    useState<FaceTrackingState>({
      hasFace: false,
      faceCount: 0,
      headDirection: "Unknown",
      lookingAway: false,
      loading: true,
    });

  useEffect(() => {
    mountedRef.current = true;

    const initializationId =
      ++initializationIdRef.current;

    let cancelled = false;

    /*
     * =====================================================
     * SAFE LANDMARKER CLOSE
     * =====================================================
     */

    const safelyCloseLandmarker = (
      landmarker: FaceLandmarker | null
    ) => {
      if (!landmarker) {
        return;
      }

      try {
        landmarker.close();
      } catch {
        /*
         * MediaPipe may throw if the instance has
         * already been disposed internally.
         *
         * Do not allow this to crash the interview.
         */
      }
    };

    /*
     * =====================================================
     * FACE DETECTION
     * =====================================================
     */

    const detectFaces = () => {
      /*
       * Stop immediately if this effect is no longer
       * the active effect.
       */

      if (
        cancelled ||
        !mountedRef.current ||
        initializationId !==
          initializationIdRef.current
      ) {
        return;
      }

      const video =
        videoRef.current;

      const landmarker =
        landmarkerRef.current;

      /*
       * MediaPipe isn't ready yet.
       */

      if (
        !video ||
        !landmarker ||
        video.readyState <
          HTMLMediaElement.HAVE_CURRENT_DATA ||
        video.videoWidth === 0 ||
        video.videoHeight === 0 ||
        video.paused ||
        video.ended
      ) {
        animationFrameRef.current =
          requestAnimationFrame(
            detectFaces
          );

        return;
      }

      /*
       * Prevent overlapping inference calls.
       */

      if (detectingRef.current) {
        animationFrameRef.current =
          requestAnimationFrame(
            detectFaces
          );

        return;
      }

      detectingRef.current = true;

      /*
       * VIDEO mode requires monotonically increasing
       * timestamps.
       */

      const timestamp =
        Math.max(
          performance.now(),
          lastTimestampRef.current + 1
        );

      lastTimestampRef.current =
        timestamp;

      try {
        const results =
          landmarker.detectForVideo(
            video,
            timestamp
          );

        /*
         * The component may have been unmounted while
         * MediaPipe was processing the frame.
         */

        if (
          cancelled ||
          !mountedRef.current ||
          initializationId !==
            initializationIdRef.current
        ) {
          return;
        }

        const count =
          results.faceLandmarks.length;

        let headDirection: HeadDirection =
          "Unknown";

        let lookingAway = false;

        /*
         * =================================================
         * HEAD DIRECTION
         * =================================================
         */

        if (count > 0) {
          const landmarks =
            results.faceLandmarks[0];

          const nose =
            landmarks[1];

          const leftEye =
            landmarks[33];

          const rightEye =
            landmarks[263];

          if (
            nose &&
            leftEye &&
            rightEye
          ) {
            const eyeCenterX =
              (leftEye.x +
                rightEye.x) /
              2;

            const eyeCenterY =
              (leftEye.y +
                rightEye.y) /
              2;

            const dx =
              nose.x -
              eyeCenterX;

            const dy =
              nose.y -
              eyeCenterY;

            if (dx < -0.04) {
              headDirection =
                "Left";
            } else if (
              dx > 0.04
            ) {
              headDirection =
                "Right";
            } else if (
              dy < -0.04
            ) {
              headDirection =
                "Up";
            } else if (
              dy > 0.05
            ) {
              headDirection =
                "Down";
            } else {
              headDirection =
                "Forward";
            }

            lookingAway =
              headDirection !==
              "Forward";
          }
        }

        /*
         * =================================================
         * STATE UPDATE
         * =================================================
         */

        setState((previous) => {
          const next: FaceTrackingState =
            {
              hasFace:
                count > 0,

              faceCount:
                count,

              headDirection,

              lookingAway,

              loading: false,
            };

          if (
            previous.hasFace ===
              next.hasFace &&
            previous.faceCount ===
              next.faceCount &&
            previous.headDirection ===
              next.headDirection &&
            previous.lookingAway ===
              next.lookingAway &&
            previous.loading ===
              next.loading
          ) {
            return previous;
          }

          return next;
        });
      } catch (error) {
        /*
         * Individual frame failures should never
         * crash the interview.
         */

        if (
          !cancelled &&
          mountedRef.current
        ) {
          console.debug(
            "MediaPipe frame skipped:",
            error
          );
        }
      } finally {
        detectingRef.current =
          false;
      }

      /*
       * Continue the detection loop only if this
       * is still the active hook instance.
       */

      if (
        !cancelled &&
        mountedRef.current &&
        initializationId ===
          initializationIdRef.current
      ) {
        animationFrameRef.current =
          requestAnimationFrame(
            detectFaces
          );
      }
    };

    /*
     * =====================================================
     * INITIALIZE MEDIAPIPE
     * =====================================================
     */

    const initialize =
      async () => {
        try {
          setState((previous) => ({
            ...previous,
            loading: true,
          }));

          /*
           * Load the MediaPipe WASM runtime.
           */

          const vision =
            await FilesetResolver.forVisionTasks(
              WASM_PATH
            );

          /*
           * Check whether this initialization
           * is still valid.
           */

          if (
            cancelled ||
            !mountedRef.current ||
            initializationId !==
              initializationIdRef.current
          ) {
            return;
          }

          /*
           * Create the FaceLandmarker.
           */

          const landmarker =
            await FaceLandmarker.createFromOptions(
              vision,
              {
                baseOptions: {
                  modelAssetPath:
                    MODEL_PATH,
                },

                runningMode:
                  "VIDEO",

                numFaces: 2,
              }
            );

          /*
           * The component may have been unmounted
           * while createFromOptions was running.
           */

          if (
            cancelled ||
            !mountedRef.current ||
            initializationId !==
              initializationIdRef.current
          ) {
            safelyCloseLandmarker(
              landmarker
            );

            return;
          }

          /*
           * If another landmarker somehow exists,
           * close the old one before replacing it.
           */

          if (
            landmarkerRef.current &&
            landmarkerRef.current !==
              landmarker
          ) {
            safelyCloseLandmarker(
              landmarkerRef.current
            );
          }

          landmarkerRef.current =
            landmarker;

          lastTimestampRef.current =
            0;

          detectingRef.current =
            false;

          /*
           * Mark initialization complete.
           */

          setState((previous) => ({
            ...previous,
            loading: false,
          }));

          /*
           * Start face detection.
           */

          detectFaces();
        } catch (error) {
          /*
           * Ignore errors caused by an old
           * cancelled initialization.
           */

          if (
            cancelled ||
            !mountedRef.current ||
            initializationId !==
              initializationIdRef.current
          ) {
            return;
          }

          console.error(
            "Face tracker initialization failed:",
            error
          );

          setState((previous) => ({
            ...previous,
            loading: false,
          }));
        }
      };

    void initialize();

    /*
     * =====================================================
     * CLEANUP
     * =====================================================
     */

    return () => {
      cancelled = true;

      mountedRef.current = false;

      /*
       * Invalidate this initialization.
       */

      initializationIdRef.current += 1;

      detectingRef.current =
        false;

      /*
       * Stop animation loop.
       */

      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );

        animationFrameRef.current =
          null;
      }

      /*
       * Close only the landmarker currently
       * owned by this hook instance.
       */

      const landmarker =
        landmarkerRef.current;

      landmarkerRef.current =
        null;

      safelyCloseLandmarker(
        landmarker
      );

      lastTimestampRef.current =
        0;
    };
  }, [videoRef]);

  return state;
}