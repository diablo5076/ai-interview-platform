"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseMediaRecorderOptions {
  stream: MediaStream | null;
  mimeType?: string;
}

export function useMediaRecorder({
  stream,
  mimeType = "audio/webm",
}: UseMediaRecorderOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(() => {
    if (!stream) {
      setError("No media stream available.");
      return;
    }

    if (typeof MediaRecorder === "undefined") {
      setError("Media recording is not supported by this browser.");
      return;
    }

    if (recorderRef.current?.state === "recording") {
      return;
    }

    if (!MediaRecorder.isTypeSupported(mimeType)) {
      setError(`Recording format "${mimeType}" is not supported.`);
      return;
    }

    try {
      setError(null);
      setAudioBlob(null);
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream, {
        mimeType,
      });

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || mimeType,
        });

        setAudioBlob(blob);
        chunksRef.current = [];
      };

      recorder.onerror = () => {
        setError("An error occurred while recording.");
        setIsRecording(false);
        recorderRef.current = null;
        chunksRef.current = [];
      };

      recorder.start();

      recorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to start recording."
      );
      setIsRecording(false);
      recorderRef.current = null;
      chunksRef.current = [];
    }
  }, [mimeType, stream]);

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current;

    if (!recorder || recorder.state === "inactive") {
      return;
    }

    recorder.stop();
    recorderRef.current = null;
    setIsRecording(false);
  }, []);

  useEffect(() => {
    return () => {
      const recorder = recorderRef.current;

      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }

      recorderRef.current = null;
      chunksRef.current = [];
    };
  }, []);

  return {
    isRecording,
    audioBlob,
    error,
    startRecording,
    stopRecording,
  };
}