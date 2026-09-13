"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

interface CameraPermissionProps {
  onStreamReady: (stream: MediaStream) => void;
  onPermissionDenied?: () => void;
}

export default function CameraPermission({
  onStreamReady,
  onPermissionDenied,
}: CameraPermissionProps) {
  useEffect(() => {
    let stream : MediaStream;
    
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        onStreamReady(stream);
      } catch {
        toast.error("Camera permission is required.");
        onPermissionDenied?.();
      }
    };
    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [onStreamReady, onPermissionDenied]);
  return null;
}