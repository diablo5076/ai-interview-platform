"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { FaceTrackingState } from "./useFaceTracker";

export interface ViolationEvent {
  id: string;
  time: string;
  message: string;
}

export interface ProctoringState {
  violations: number;
  warning: string | null;
  timeline: ViolationEvent[];
}

const NO_FACE_DELAY = 2000;
const LOOKING_AWAY_DELAY = 3000;
const VIOLATION_COOLDOWN = 5000;
const VIOLATION_DURATION = 5000;
const MAX_TIMELINE_ITEMS = 4;

export function useProctoring(
  tracking: FaceTrackingState
) {
  const [state, setState] = useState<ProctoringState>({
    violations: 0,
    warning: null,
    timeline: [],
  });

  const noFaceTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const lookingAwayTimer =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const violationExpiryTimers = useRef<
    ReturnType<typeof setTimeout>[]
  >([]);

  const lastViolation = useRef(0);

  const registerViolation = useCallback((message: string) => {
    const now = Date.now();

    /*
     * Prevent the same violation from being registered
     * repeatedly within the cooldown period.
     */
    if (
      now - lastViolation.current <
      VIOLATION_COOLDOWN
    ) {
      return;
    }

    lastViolation.current = now;

    const id = crypto.randomUUID();

    const currentTime = new Date().toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    );

    const violation: ViolationEvent = {
      id,
      time: currentTime,
      message,
    };

    /*
     * Increase the active violation count
     * and keep only the latest 4 timeline events.
     */
    setState((prev) => ({
      violations: prev.violations + 1,
      warning: message,
      timeline: [
        violation,
        ...prev.timeline,
      ].slice(0, MAX_TIMELINE_ITEMS),
    }));

    /*
     * This individual violation expires after 5 seconds.
     */
    const expiryTimer = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        violations: Math.max(
          0,
          prev.violations - 1
        ),
      }));
    }, VIOLATION_DURATION);

    violationExpiryTimers.current.push(
      expiryTimer
    );
  }, []);

  useEffect(() => {
    /*
     * FACE NOT DETECTED
     */
    if (!tracking.hasFace) {
      if (!noFaceTimer.current) {
        noFaceTimer.current = setTimeout(() => {
          noFaceTimer.current = null;

          registerViolation(
            "Face not detected"
          );
        }, NO_FACE_DELAY);
      }
    } else {
      if (noFaceTimer.current) {
        clearTimeout(noFaceTimer.current);
        noFaceTimer.current = null;
      }
    }

    /*
     * MULTIPLE FACES
     */
    if (tracking.faceCount > 1) {
      registerViolation(
        "Multiple faces detected"
      );
    }

    /*
     * LOOKING AWAY
     */
    if (tracking.lookingAway) {
      if (!lookingAwayTimer.current) {
        lookingAwayTimer.current = setTimeout(() => {
          lookingAwayTimer.current = null;

          registerViolation(
            "Candidate looking away"
          );
        }, LOOKING_AWAY_DELAY);
      }
    } else {
      if (lookingAwayTimer.current) {
        clearTimeout(
          lookingAwayTimer.current
        );

        lookingAwayTimer.current = null;
      }
    }

    /*
     * Clear warning when candidate returns
     * to a normal state.
     */
    if (
      tracking.hasFace &&
      tracking.faceCount === 1 &&
      !tracking.lookingAway
    ) {
      setState((prev) => {
        if (prev.warning === null) {
          return prev;
        }

        return {
          ...prev,
          warning: null,
        };
      });
    }
  }, [
    tracking.hasFace,
    tracking.faceCount,
    tracking.lookingAway,
    registerViolation,
  ]);

  /*
   * Cleanup all timers when the component unmounts.
   */
  useEffect(() => {
    return () => {
      if (noFaceTimer.current) {
        clearTimeout(noFaceTimer.current);
        noFaceTimer.current = null;
      }

      if (lookingAwayTimer.current) {
        clearTimeout(
          lookingAwayTimer.current
        );

        lookingAwayTimer.current = null;
      }

      violationExpiryTimers.current.forEach(
        (timer) => {
          clearTimeout(timer);
        }
      );

      violationExpiryTimers.current = [];
    };
  }, []);

  return {
    ...state,
    addViolation: registerViolation,
  };
}