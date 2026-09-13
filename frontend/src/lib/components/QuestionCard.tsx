"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { submitAnswer } from "@/lib/services/question";
import { evaluateQuestion } from "@/lib/services/interview";
import type { Question } from "@/types/interview";

import {
  AIThinking,
  AnswerInput,
  CodeEditor,
  LanguageSelector,
  TestCasePanel,
} from "@/components/interview";

import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";

interface QuestionCardProps {
  question: Question;
  index: number;
  onAnswerSaved: () => Promise<void>;
}

const languageOptions = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "C", value: "c" },
];

export default function QuestionCard({
  question,
  index,
  onAnswerSaved,
}: QuestionCardProps) {
  const isCoding = question.type === "CODING";

  const [answer, setAnswer] = useState(
    question.answer ??
      (isCoding ? question.starterCode ?? "" : "")
  );

  const [language, setLanguage] = useState(
    question.language ?? "javascript"
  );

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const coding = question.type === "CODING";

    setAnswer(
      question.answer ??
        (coding ? question.starterCode ?? "" : "")
    );

    setLanguage(question.language ?? "javascript");
  }, [question]);

  const handleSave = async () => {
    if (!answer.trim()) {
      toast.error(
        isCoding
          ? "Write your solution before submitting."
          : "Answer cannot be empty."
      );
      return;
    }

    try {
      setSaving(true);

      await submitAnswer(question.id, answer);
      await evaluateQuestion(question.id);
      await onAnswerSaved();

      toast.success("Answer saved successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ??
          "Failed to submit or evaluate answer"
      );
    } finally {
      setSaving(false);
    }
  };

  const readOnly =
    saving ||
    question.score !== null ||
    question.isAnswered;

  const testCases =
    question.testCases?.map((testCase, index) => ({
      id: index + 1,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      status: "pending" as const,
    })) ?? [];

  return (
    <GlassCard className="mb-6 space-y-5 p-6">
      <div>
        <h3 className="text-lg font-semibold text-white">
          Question {index + 1}
        </h3>

        <p className="mt-3 text-white">
          {question.question}
        </p>
      </div>

      {isCoding ? (
        <div className="space-y-4">
          <LanguageSelector
            value={language}
            options={languageOptions}
            onChange={setLanguage}
            disabled={readOnly}
          />

          <CodeEditor
            value={answer}
            language={language}
            onChange={setAnswer}
            readOnly={readOnly}
            height="500px"
          />

          {testCases.length > 0 && (
            <TestCasePanel testCases={testCases} />
          )}
        </div>
      ) : (
        <AnswerInput
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={readOnly}
          placeholder="Type your answer here..."
          maxLength={3000}
        />
      )}

      {saving && (
        <AIThinking message="AI is evaluating your answer..." />
      )}

      <Button
        onClick={handleSave}
        disabled={readOnly}
        loading={saving}
        className="mt-4"
      >
        {isCoding ? "Submit Solution" : "Save Answer"}
      </Button>
    </GlassCard>
  );
}