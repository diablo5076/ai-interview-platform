"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseWebcamOptions {
  enabled?: boolean;
  constraints?: MediaStreamConstraints;
}

const DEFAULT_CONSTRAINTS: MediaStreamConstraints = {
  video: true,
  audio: false,
};

export function useWebcam({
  enabled = true,
  constraints = DEFAULT_CONSTRAINTS,
}: UseWebcamOptions = {}) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const requestIdRef = useRef(0);

  const stopCamera = useCallback(() => {
    requestIdRef.current += 1;

    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;
    setStream(null);
    setIsCameraOn(false);
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is not supported in this browser.");
      setIsCameraOn(false);
      return;
    }

    if (streamRef.current) {
      return;
    }

    const requestId = ++requestIdRef.current;

    try {
      setError(null);

      const mediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);

      if (requestId !== requestIdRef.current) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
        return;
      }

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setIsCameraOn(true);
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setError(
        error instanceof Error
          ? error.message
          : "Failed to access webcam."
      );
      setIsCameraOn(false);
    }
  }, [constraints]);

  useEffect(() => {
    if (!enabled) {
      stopCamera();
      return;
    }

    void startCamera();

    return () => {
      stopCamera();
    };
  }, [enabled, startCamera, stopCamera]);

  return {
    stream,
    isCameraOn,
    error,
    startCamera,
    stopCamera,
  };
}