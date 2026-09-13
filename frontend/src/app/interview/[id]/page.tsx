"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import {
  getInterview,
  generateQuestions,
  startInterview,
  finishInterview,
} from "@/lib/services/interview";

import type { Interview } from "@/types/interview";

import PageWrapper from "@/components/layout/PageWrapper";
import Container from "@/components/layout/Container";
import LoadingState from "@/components/ui/states/LoadingState";
import EmptyState from "@/components/ui/states/EmptyState";
import ProtectedRoute from "@/components/common/ProtectedRoute";

import QuestionCard from "@/lib/components/QuestionCard";
import InterviewSummary from "@/lib/components/InterviewSummary";

import {
  CameraPermission,
  FullscreenMonitor,
  FullscreenToggle,
  InterviewControls,
  QuestionMetadata,
  QuestionNavigation,
  QuestionStatusBadge,
  TabMonitor,
  WebcamPreview,
} from "@/components/interview";

import { useFaceTracker } from "@/components/interview/hooks/useFaceTracker";
import { useProctoring } from "@/components/interview/hooks/useProctoring";

export default function InterviewPage() {
  const params = useParams();
  const id = params.id as string;

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [starting, setStarting] = useState(false);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraStream, setCameraStream] =
    useState<MediaStream | null>(null);

  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const finishingRef = useRef(false);

  const faceTracking = useFaceTracker(webcamRef);
  const proctoring = useProctoring(faceTracking);

  const calculateRemainingTime = useCallback(
    (startedAt: string, durationMinutes: number) => {
      const startTime = new Date(startedAt).getTime();

      if (Number.isNaN(startTime)) {
        return 0;
      }

      const durationSeconds = durationMinutes * 60;

      const elapsedSeconds = Math.floor(
        (Date.now() - startTime) / 1000
      );

      return Math.max(durationSeconds - elapsedSeconds, 0);
    },
    []
  );

  const stopCamera = useCallback(() => {
    setCameraEnabled(false);

    setCameraStream((stream) => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      return null;
    });
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      return;
    }

    try {
      await document.exitFullscreen();
    } catch {
      return;
    }
  }, []);

  const fetchInterview = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);

      const response = await getInterview(id);
      const data = response.interview;

      setInterview(data);

      if (data.completed) {
        setCompleted(true);
        setStarted(false);
        setTimeLeft(0);
        return;
      }

      if (data.startedAt) {
        const remaining = calculateRemainingTime(
          data.startedAt,
          data.duration
        );

        if (remaining <= 0) {
          setStarted(true);
          setCompleted(false);
          setTimeLeft(0);
        } else {
          setStarted(true);
          setCompleted(false);
          setTimeLeft(remaining);
        }

        return;
      }

      setStarted(false);
      setCompleted(false);
      setTimeLeft(0);
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data as { message?: string })?.message
          : undefined;

      toast.error(message ?? "Failed to load interview.");
    } finally {
      setLoading(false);
    }
  }, [calculateRemainingTime, id]);

  useEffect(() => {
    void fetchInterview();
  }, [fetchInterview]);

  const handleGenerateQuestions = useCallback(async () => {
    if (generating || started || completed || !id) {
      return;
    }

    try {
      setGenerating(true);

      await generateQuestions(id);

      toast.success("Questions generated successfully.");

      await fetchInterview();
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data as { message?: string })?.message
          : undefined;

      toast.error(message ?? "Failed to generate questions.");
    } finally {
      setGenerating(false);
    }
  }, [
    completed,
    fetchInterview,
    generating,
    id,
    started,
  ]);

  const handleStartInterview = useCallback(async () => {
    if (
      starting ||
      started ||
      completed ||
      !interview
    ) {
      return;
    }

    if (interview.questions.length === 0) {
      toast.error("Generate questions before starting.");
      return;
    }

    try {
      setStarting(true);

      const response = await startInterview(id);

      const startedAt =
        response?.startedAt ??
        response?.interview?.startedAt;

      if (!startedAt) {
        throw new Error(
          "Interview start time was not returned."
        );
      }

      const remaining = calculateRemainingTime(
        startedAt,
        interview.duration
      );

      if (remaining <= 0) {
        toast.error("Interview time has already expired.");
        await fetchInterview();
        return;
      }

      setInterview((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          startedAt,
          completed: false,
          completedAt: null,
        };
      });

      setStarted(true);
      setCompleted(false);
      setCurrentQuestion(0);
      setTimeLeft(remaining);

      if (!document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
        } catch {
          return;
        }
      }

      toast.success("Interview started.");
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data as { message?: string })?.message
          : error instanceof Error
            ? error.message
            : undefined;

      toast.error(message ?? "Failed to start interview.");
    } finally {
      setStarting(false);
    }
  }, [
    calculateRemainingTime,
    completed,
    fetchInterview,
    id,
    interview,
    started,
    starting,
  ]);

  const handleFinishInterview = useCallback(async () => {
    if (finishingRef.current) {
      return false;
    }

    finishingRef.current = true;

    try {
      const response = await finishInterview(id);

      if (response?.interview) {
        setInterview(response.interview);
      }

      setCompleted(true);
      setStarted(false);
      setTimeLeft(0);

      stopCamera();
      await exitFullscreen();

      return true;
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data as { message?: string })?.message
          : undefined;

      toast.error(
        message ?? "Failed to complete interview."
      );

      finishingRef.current = false;

      return false;
    }
  }, [exitFullscreen, id, stopCamera]);

  useEffect(() => {
    if (
      !started ||
      completed ||
      !interview?.startedAt
    ) {
      return;
    }

    const updateTimer = () => {
      const remaining = calculateRemainingTime(
        interview.startedAt!,
        interview.duration
      );

      setTimeLeft(remaining);
    };

    updateTimer();

    const interval = window.setInterval(
      updateTimer,
      1000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [
    calculateRemainingTime,
    completed,
    interview?.duration,
    interview?.startedAt,
    started,
  ]);

  useEffect(() => {
    if (
      !started ||
      completed ||
      timeLeft !== 0
    ) {
      return;
    }

    void handleFinishInterview();
  }, [
    completed,
    handleFinishInterview,
    started,
    timeLeft,
  ]);

  useEffect(() => {
    if (!completed) {
      return;
    }

    stopCamera();
    void exitFullscreen();
  }, [completed, exitFullscreen, stopCamera]);

  const handleCameraReady = (stream: MediaStream) => {
    setCameraStream(stream);
    setCameraEnabled(true);
  };

  const handleCameraDenied = () => {
    setCameraEnabled(false);
    setCameraStream(null);
    toast.error("Camera permission is required.");
  };

  const refreshInterview = useCallback(async () => {
    try {
      const response = await getInterview(id);
      const data = response.interview;

      setInterview(data);

      if (data.completed) {
        setCompleted(true);
        setStarted(false);
        setTimeLeft(0);
        stopCamera();
        return;
      }

      if (data.startedAt) {
        const remaining = calculateRemainingTime(
          data.startedAt,
          data.duration
        );

        setStarted(remaining > 0);
        setTimeLeft(remaining);
      }
    } catch {
      return;
    }
  }, [calculateRemainingTime, id, stopCamera]);

  const handleQuestionSelect = (index: number) => {
    if (
      !started ||
      completed ||
      !interview ||
      index < 0 ||
      index >= interview.questions.length ||
      index === currentQuestion
    ) {
      return;
    }
  
    const current = interview.questions[currentQuestion];
  
    if (!current?.answer?.trim()) {
      toast.error(
        "Please save your answer before changing questions."
      );
      return;
    }
  
    setCurrentQuestion(index);
  };

  const handlePrevious = () => {
    if (
      currentQuestion === 0 ||
      !started ||
      completed
    ) {
      return;
    }

    setCurrentQuestion((previous) => previous - 1);
  };

  const handleNext = async () => {
    if (
      !interview ||
      !started ||
      completed ||
      timeLeft <= 0
    ) {
      return;
    }

    const current =
      interview.questions[currentQuestion];

    if (!current) {
      return;
    }

    if (!current.answer?.trim()) {
      toast.error(
        "Please save your answer before continuing."
      );
      return;
    }

    if (
      currentQuestion <
      interview.questions.length - 1
    ) {
      setCurrentQuestion((previous) => previous + 1);
      return;
    }

    const success = await handleFinishInterview();

    if (success) {
      toast.success(
        "Interview completed successfully."
      );
    }
  };

  useEffect(() => {
    return () => {
      cameraStream?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, [cameraStream]);

  if (loading) {
    return (
      <ProtectedRoute>
        <PageWrapper>
          <Container className="py-8">
            <LoadingState />
          </Container>
        </PageWrapper>
      </ProtectedRoute>
    );
  }

  if (!interview) {
    return (
      <ProtectedRoute>
        <PageWrapper>
          <Container className="py-8">
            <EmptyState
              title="Interview not found"
              description="This interview could not be loaded."
            />
          </Container>
        </PageWrapper>
      </ProtectedRoute>
    );
  }

  const questions = interview.questions ?? [];
  const current =
    questions[currentQuestion] ?? null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime =
    started && !completed
      ? `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      : "--:--";

  const isTimeWarning =
    started && timeLeft <= 60 && timeLeft > 0;

  const progress =
    questions.length > 0
      ? Math.round(
          ((currentQuestion + 1) /
            questions.length) *
            100
        )
      : 0;

  const status = current?.isAnswered
    ? "Answered"
    : "In Progress";

  if (completed) {
    return (
      <ProtectedRoute>
        <PageWrapper>
          <main className="min-h-screen w-full">
            <Container className="max-w-6xl py-10">
              <InterviewSummary interview={interview} />
            </Container>
          </main>
        </PageWrapper>
      </ProtectedRoute>
    );
  }

  /*
   * STEP 1:
   * No questions have been generated yet.
   */
  if (questions.length === 0) {
    return (
      <ProtectedRoute>
        <PageWrapper>
          <main className="min-h-screen w-full">
            <Container className="max-w-6xl py-10">
              <div className="flex items-start justify-between gap-8">
                <div className="min-w-0 flex-1">
                  <h1 className="text-3xl font-bold text-white">
                    {interview.title}
                  </h1>

                  <p className="mt-2 text-sm text-zinc-400">
                    Questions will be generated before
                    your interview starts.
                  </p>
                </div>

                <div className="flex w-[150px] shrink-0 flex-col items-center rounded-2xl border border-white/10 bg-zinc-900/80 px-5 py-4">
                  <span className="text-xs text-zinc-400">
                    Time Remaining
                  </span>

                  <span className="mt-1 font-mono text-lg font-bold text-white">
                    --:--
                  </span>
                </div>
              </div>

              <div className="mt-10">
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/80 p-8 text-center">
                  {generating ? (
                    <>
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                        <Sparkles className="h-6 w-6 text-blue-400" />
                      </div>

                      <h2 className="text-xl font-semibold text-white">
                        Generating Questions
                      </h2>

                      <p className="mt-2 text-sm text-zinc-400">
                        AI is preparing your interview
                        questions...
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                        <Sparkles className="h-6 w-6 text-blue-400" />
                      </div>

                      <h2 className="text-xl font-semibold text-white">
                        No Questions Generated
                      </h2>

                      <p className="mt-2 text-sm text-zinc-400">
                        Generate AI-powered interview
                        questions to begin.
                      </p>

                      <button
                        type="button"
                        onClick={handleGenerateQuestions}
                        disabled={generating}
                        className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Sparkles className="h-4 w-4" />
                        Generate AI Questions
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Container>
          </main>
        </PageWrapper>
      </ProtectedRoute>
    );
  }

  /*
   * STEP 2:
   * Questions have been generated, but the interview
   * has NOT started yet.
   *
   * IMPORTANT:
   * We intentionally DO NOT render questions here.
   */
  if (!started) {
    return (
      <ProtectedRoute>
        <PageWrapper>
          <main className="min-h-screen w-full">
            <Container className="max-w-6xl py-10">
              <div className="flex items-start justify-between gap-8">
                <div className="min-w-0 flex-1">
                  <h1 className="text-3xl font-bold text-white">
                    {interview.title}
                  </h1>

                  <p className="mt-2 text-sm text-zinc-400">
                    Your interview is ready to begin.
                  </p>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-zinc-400">
                        Preparation
                      </span>

                      <span className="text-sm text-zinc-400">
                        Ready
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                      <div className="h-full w-full rounded-full bg-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="flex w-[150px] shrink-0 flex-col items-center rounded-2xl border border-white/10 bg-zinc-900/80 px-5 py-4">
                  <span className="text-xs text-zinc-400">
                    Time Remaining
                  </span>

                  <span className="mt-1 font-mono text-lg font-bold text-white">
                    --:--
                  </span>
                </div>
              </div>

              <div className="mt-10">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                      <Sparkles className="h-6 w-6 text-blue-400" />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        Interview Ready
                      </h2>

                      <p className="mt-1 text-sm text-zinc-400">
                        Your AI-generated questions are ready.
                        They will be shown one at a time after
                        you start the interview.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        Duration
                      </p>

                      <p className="mt-2 font-semibold text-white">
                        {interview.duration} min
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        Questions
                      </p>

                      <p className="mt-2 font-semibold text-white">
                        {questions.length}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        Timer
                      </p>

                      <p className="mt-2 font-semibold text-emerald-400">
                        Starts on launch
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
                    <p className="text-sm font-medium text-blue-300">
                      Before you start
                    </p>

                    <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                      <li>
                        • Make sure your camera and microphone
                        are ready.
                      </li>
                      <li>
                        • The interview timer starts when you
                        click Start Interview.
                      </li>
                      <li>
                        • Questions will appear only after the
                        interview begins.
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartInterview}
                    disabled={starting}
                    className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {starting
                      ? "Starting Interview..."
                      : "Start Interview"}
                  </button>
                </div>
              </div>
            </Container>
          </main>
        </PageWrapper>
      </ProtectedRoute>
    );
  }

  /*
   * STEP 3:
   * Interview has started.
   * Questions are now allowed to be displayed.
   */
  return (
    <ProtectedRoute>
      <PageWrapper>
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[280px] overflow-y-auto border-r border-white/10 bg-black px-3 py-4 xl:block">
          <section>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-2">
              <div className="h-[180px] overflow-hidden rounded-lg bg-black">
                {cameraEnabled ? (
                  <WebcamPreview
                    stream={cameraStream}
                    isCameraOn={cameraEnabled}
                    videoRef={webcamRef}
                  />
                ) : (
                  <CameraPermission
                    onStreamReady={handleCameraReady}
                    onPermissionDenied={handleCameraDenied}
                  />
                )}
              </div>
            </div>
          </section>

          <section className="mt-5 border-t border-white/10 pt-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">
                Violation Timeline
              </h2>

              <span className="rounded-full bg-red-500/10 px-2 py-1 text-[9px] font-semibold text-red-400">
                {proctoring.violations}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {proctoring.timeline
                .slice(0, 4)
                .map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5"
                  >
                    <p className="text-[9px] text-zinc-500">
                      {event.time}
                    </p>

                    <p className="mt-1 text-[10px] font-medium leading-4 text-white">
                      {event.message}
                    </p>
                  </div>
                ))}

              {proctoring.timeline.length === 0 && (
                <p className="text-[10px] text-zinc-500">
                  No violations detected.
                </p>
              )}
            </div>
          </section>

          <section className="mt-5 border-t border-white/10 pt-5">
            <h2 className="text-sm font-bold text-white">
              Proctoring
            </h2>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">
                  Violations
                </span>

                <span className="text-[11px] font-semibold text-red-400">
                  {proctoring.violations}
                </span>
              </div>

              <div>
                <p className="text-[10px] text-zinc-500">
                  Status
                </p>

                <p className="mt-1 text-[10px] font-medium text-red-400">
                  {proctoring.warning ?? "Clear"}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-5 border-t border-white/10 pt-5">
            <h2 className="text-sm font-bold text-white">
              Face Tracking
            </h2>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">
                  Status
                </span>

                <span
                  className={
                    faceTracking.hasFace
                      ? "text-[11px] font-medium text-emerald-400"
                      : "text-[11px] font-medium text-red-400"
                  }
                >
                  {faceTracking.hasFace
                    ? "Detected"
                    : "Not Detected"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">
                  Faces
                </span>

                <span className="text-[11px] text-white">
                  {faceTracking.faceCount}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">
                  Head
                </span>

                <span className="text-[11px] text-white">
                  {faceTracking.headDirection}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">
                  Looking Away
                </span>

                <span
                  className={
                    faceTracking.lookingAway
                      ? "text-[11px] font-medium text-yellow-400"
                      : "text-[11px] font-medium text-emerald-400"
                  }
                >
                  {faceTracking.lookingAway
                    ? "Yes"
                    : "No"}
                </span>
              </div>
            </div>
          </section>
        </aside>

        <main className="min-h-screen w-full overflow-x-hidden xl:ml-[280px] xl:w-[calc(100vw-280px)]">
          <Container className="max-w-7xl px-6 py-8">
            <div className="flex items-start justify-between gap-8">
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-bold text-white">
                  {interview.title}
                </h1>

                <p className="mt-2 text-sm text-zinc-400">
                  Question {currentQuestion + 1} of{" "}
                  {questions.length}
                </p>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-zinc-400">
                      Progress
                    </span>

                    <span className="text-sm font-medium text-zinc-300">
                      {progress}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-4">
                <div className="flex w-[150px] flex-col items-center rounded-2xl border border-white/10 bg-zinc-900/80 px-5 py-4">
                  <span className="text-xs text-zinc-400">
                    Time Remaining
                  </span>

                  <span
                    className={`mt-1 font-mono text-lg font-bold ${
                      isTimeWarning
                        ? "text-red-400"
                        : "text-white"
                    }`}
                  >
                    {formattedTime}
                  </span>
                </div>

                <FullscreenToggle />
              </div>
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Questions
                </h2>

                <QuestionStatusBadge status={status} />
              </div>

              <p className="mt-3 text-sm text-zinc-400">
                Question {currentQuestion + 1} of{" "}
                {questions.length}
              </p>

              <div className="mt-4">
                <QuestionNavigation
                  currentQuestion={currentQuestion}
                  totalQuestions={questions.length}
                  onSelectQuestion={handleQuestionSelect}
                />
              </div>

              <div className="mt-3">
                <QuestionMetadata
                  difficulty={
                    interview.level as
                      | "Easy"
                      | "Medium"
                      | "Hard"
                  }
                  category={interview.role}
                  estimatedTime={`${Math.max(
                    1,
                    Math.ceil(
                      interview.duration /
                        Math.max(questions.length, 1)
                    )
                  )} min`}
                />
              </div>
            </div>

            <TabMonitor
              onViolation={proctoring.addViolation}
            />

            <FullscreenMonitor
              onViolation={proctoring.addViolation}
            />

            {current && (
              <div className="mt-6">
                <QuestionCard
                  question={current}
                  index={currentQuestion}
                  onAnswerSaved={refreshInterview}
                />
              </div>
            )}

            <div className="mt-5">
              <InterviewControls
                onPrevious={handlePrevious}
                onNext={handleNext}
                disablePrevious={
                  currentQuestion === 0 ||
                  timeLeft === 0
                }
                disableNext={timeLeft === 0}
                isLastQuestion={
                  currentQuestion ===
                  questions.length - 1
                }
              />
            </div>
          </Container>
        </main>
      </PageWrapper>
    </ProtectedRoute>
  );
}