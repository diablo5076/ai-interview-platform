"use client";

import { useCallback, useState } from "react";

interface UseInterviewOptions {
  totalQuestions: number;
  onComplete?: () => void;
}

export function useInterview({
  totalQuestions,
  onComplete,
}: UseInterviewOptions) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const submitAnswer = useCallback(
    (answer: string) => {
      setAnswers((prev) => {
        const updated = [...prev];
        updated[currentQuestion] = answer;
        return updated;
      });
    },
    [currentQuestion]
  );

  const nextQuestion = useCallback(() => {
    if (isCompleted) return;

    if (totalQuestions <= 0) return;
    
    if (currentQuestion >= totalQuestions - 1) {
      setIsCompleted(true);
      onComplete?.();
      return;
    }

    setCurrentQuestion((prev) => prev + 1);
  }, [currentQuestion, totalQuestions, onComplete, isCompleted]);

  const previousQuestion = useCallback(() => {
    if (currentQuestion === 0) return;

    setCurrentQuestion((prev) => prev - 1);
  }, [currentQuestion]);

  const resetInterview = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsCompleted(false);
  }, []);

  return {
    currentQuestion,
    answers,
    isCompleted,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    resetInterview,
  };
}