"use client";

import type { Interview } from "@/types/interview";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

interface InterviewSummaryProps {
  interview: Interview;
}

export default function InterviewSummary({
  interview,
}: InterviewSummaryProps) {
  const totalQuestions = interview.questions.length;

  const answeredQuestions = interview.questions.filter(
    (q) => q.answer
  ).length;

  const totalScore = interview.questions.reduce(
    (sum, question) => sum + (question.score ?? 0),
    0
  );

  const averageScore =
    totalQuestions > 0
      ? totalScore / totalQuestions
      : 0;

  const completionPercentage =
    totalQuestions === 0
      ? 0
      : Math.round(
          (answeredQuestions / totalQuestions) * 100
        );

  const [expandedQuestion, setExpandedQuestion] =
    useState<number | null>(0);

  const router = useRouter();

  const scores = interview.questions.map(
    (q) => q.score ?? 0
  );

  const highestScore =
    scores.length > 0
      ? Math.max(...scores)
      : 0;

  const lowestScore =
    scores.length > 0
      ? Math.min(...scores)
      : 0;

  const strongestQuestion =
    interview.questions.find(
      (question) =>
        (question.score ?? 0) === highestScore
    );

  const weakestQuestion =
    interview.questions.find(
      (question) =>
        (question.score ?? 0) === lowestScore
    );

  /*
   * =====================================================
   * PERFORMANCE
   * =====================================================
   */

  let performance = "";
  let performanceColor = "";

  if (averageScore >= 9) {
    performance = "Excellent";
    performanceColor = "text-emerald-400";
  } else if (averageScore >= 7) {
    performance = "Good";
    performanceColor = "blue";
  } else if (averageScore >= 5) {
    performance = "Average";
    performanceColor = "text-yellow-400";
  } else {
    performance = "Needs Improvement";
    performanceColor = "text-red-400";
  }

  /*
   * =====================================================
   * SCORE COLORS
   * =====================================================
   */

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-emerald-400";
    if (score >= 7) return "text-blue-400";
    if (score >= 5) return "text-yellow-400";

    return "text-red-400";
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 9) return "bg-emerald-500";
    if (score >= 7) return "bg-blue-500";
    if (score >= 5) return "bg-yellow-500";

    return "bg-red-500";
  };

  /*
   * =====================================================
   * RETAKE
   * =====================================================
   */

  const handleRetakeInterview = () => {
    const confirmed = window.confirm(
      "Start a new interview? Your current interview summary will remain saved."
    );

    if (confirmed) {
      router.push("/interview");
    }
  };

  /*
   * =====================================================
   * RECOMMENDATIONS
   * =====================================================
   */

  const recommendations: string[] = [];

  if (averageScore >= 9) {
    recommendations.push(
      "Excellent performance! Keep practicing advanced interview questions."
    );
  } else if (averageScore >= 7) {
    recommendations.push(
      "Good job! Focus on refining your explanations and handling edge cases."
    );
  } else if (averageScore >= 5) {
    recommendations.push(
      "Review the topics where you scored lower and practice explaining your solutions clearly."
    );
  } else {
    recommendations.push(
      "Strengthen your fundamentals before attempting another mock interview."
    );
  }

  recommendations.push(
    "Review the feedback and ideal answers for every question."
  );

  /*
   * =====================================================
   * OVERALL FEEDBACK
   * =====================================================
   */

  let overallFeedback = "";

  if (averageScore >= 9) {
    overallFeedback =
      "Excellent performance! You demonstrated strong technical knowledge, answered confidently, and communicated your ideas clearly. Continue practicing advanced interview questions to maintain this level.";
  } else if (averageScore >= 7) {
    overallFeedback =
      "Good performance overall. You have a solid understanding of the concepts, but you should focus on providing more detailed explanations and discussing edge cases to make your answers stronger.";
  } else if (averageScore >= 5) {
    overallFeedback =
      "You have a basic understanding of the topics, but there is room for improvement. Review weaker concepts, practice explaining your solutions step by step, and work on your confidence during interviews.";
  } else {
    overallFeedback =
      "Your interview indicates that you should strengthen your fundamentals before attempting another mock interview. Focus on core concepts and regular practice to build confidence and improve your performance.";
  }

  /*
   * =====================================================
   * UI
   * =====================================================
   */

  return (
    <div className="mt-10 w-full space-y-8 rounded-2xl border border-zinc-800 bg-black p-4 text-white shadow-2xl sm:p-6 lg:p-8">

      {/* ================================================= */}
      {/* HEADER                                            */}
      {/* ================================================= */}

      <div>
        <h2 className="text-2xl font-bold text-white">
          📄 Interview Summary
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Review your interview performance and detailed feedback.
        </p>
      </div>

      {/* ================================================= */}
      {/* OVERALL PERFORMANCE                               */}
      {/* ================================================= */}

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">
            📊 Overall Performance
          </h2>

          <p className="mt-5 text-5xl font-bold text-blue-400">
            {averageScore.toFixed(1)}/10
          </p>

          <p
            className={`mt-3 text-xl font-semibold ${performanceColor}`}
          >
            {performance}
          </p>

          <div className="mx-auto mt-6 h-3 w-full max-w-md overflow-hidden rounded-full bg-zinc-800">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(
                averageScore
              )}`}
              style={{
                width: `${averageScore * 10}%`,
              }}
            />
          </div>

          <p className="mt-3 text-sm text-zinc-500">
            {Math.round(averageScore * 10)}% Overall Performance
          </p>
        </div>
      </section>

      {/* ================================================= */}
      {/* STATS                                              */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-center shadow-lg transition hover:-translate-y-1 hover:border-zinc-700">
          <div className="text-3xl">📋</div>

          <p className="mt-4 text-4xl font-bold text-blue-400">
            {totalQuestions}
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Questions
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-center shadow-lg transition hover:-translate-y-1 hover:border-zinc-700">
          <div className="text-3xl">✅</div>

          <p className="mt-4 text-4xl font-bold text-emerald-400">
            {answeredQuestions}/{totalQuestions}
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Answered
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-center shadow-lg transition hover:-translate-y-1 hover:border-zinc-700">
          <div className="text-3xl">🎯</div>

          <p className="mt-4 text-4xl font-bold text-purple-400">
            {completionPercentage}%
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Completed
          </p>
        </div>

      </div>

      {/* ================================================= */}
      {/* SCORE DISTRIBUTION                                */}
      {/* ================================================= */}

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white">
          📈 Score Distribution
        </h2>

        <div className="mt-6 space-y-5">
          {interview.questions.map(
            (question, index) => {
              const score =
                question.score ?? 0;

              return (
                <div key={index}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-400">
                      Question {index + 1}
                    </span>

                    <span
                      className={`font-semibold ${getScoreColor(
                        score
                      )}`}
                    >
                      {score}/10
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className={`h-3 rounded-full transition-all duration-700 ${getProgressBarColor(
                        score
                      )}`}
                      style={{
                        width: `${score * 10}%`,
                      }}
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* ================================================= */}
      {/* INTERVIEW INSIGHTS                                */}
      {/* ================================================= */}

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white">
          💡 Interview Insights
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="text-sm text-zinc-500">
              Highest Score
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-400">
              {highestScore}/10
            </p>
          </div>

          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
            <p className="text-sm text-zinc-500">
              Lowest Score
            </p>

            <p className="mt-2 text-2xl font-bold text-red-400">
              {lowestScore}/10
            </p>
          </div>

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
            <p className="text-sm text-zinc-500">
              Average Score
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-400">
              {averageScore.toFixed(1)}/10
            </p>
          </div>

        </div>
      </section>

      {/* ================================================= */}
      {/* STRONGEST / WEAKEST                               */}
      {/* ================================================= */}

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white">
          🏆 Strongest & Weakest Question
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <h3 className="text-lg font-semibold text-emerald-400">
              🏆 Strongest Question
            </h3>

            <p className="mt-3 font-medium text-white">
              {strongestQuestion
                ? `Question ${
                    interview.questions.indexOf(
                      strongestQuestion
                    ) + 1
                  }`
                : "N/A"}
            </p>

            <p className="mt-2 leading-6 text-zinc-400">
              {strongestQuestion?.question}
            </p>

            <p className="mt-4 text-lg font-bold text-emerald-400">
              Score: {strongestQuestion?.score ?? 0}/10
            </p>
          </div>

          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
            <h3 className="text-lg font-semibold text-red-400">
              ⚠️ Needs Improvement
            </h3>

            <p className="mt-3 font-medium text-white">
              {weakestQuestion
                ? `Question ${
                    interview.questions.indexOf(
                      weakestQuestion
                    ) + 1
                  }`
                : "No question available"}
            </p>

            <p className="mt-2 leading-6 text-zinc-400">
              {weakestQuestion?.question}
            </p>

            <p className="mt-4 text-lg font-bold text-red-400">
              Score: {weakestQuestion?.score ?? 0}/10
            </p>
          </div>

        </div>
      </section>

      {/* ================================================= */}
      {/* QUESTION REVIEW                                   */}
      {/* ================================================= */}

      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-white">
          📝 Question Review
        </h2>

        {interview.questions.map(
          (question, index) => {
            const isExpanded =
              expandedQuestion === index;

            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-lg"
              >

                {/* Question Header */}

                <button
                  type="button"
                  onClick={() =>
                    setExpandedQuestion(
                      isExpanded
                        ? null
                        : index
                    )
                  }
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-zinc-900"
                >
                  <h3 className="text-lg font-semibold text-white">
                    Question {index + 1}
                  </h3>

                  <span className="text-zinc-500">
                    {isExpanded ? (
                      <ChevronUp size={22} />
                    ) : (
                      <ChevronDown size={22} />
                    )}
                  </span>
                </button>

                {/* Question Content */}

                {isExpanded && (
                  <div className="space-y-5 border-t border-zinc-800 p-5">

                    {/* Question */}

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5">
                      <p className="mb-2 font-semibold text-zinc-300">
                        Question
                      </p>

                      <p className="leading-7 text-zinc-400">
                        {question.question}
                      </p>
                    </div>

                    {/* Answer */}

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5">
                      <p className="mb-2 font-semibold text-zinc-300">
                        Your Answer
                      </p>

                      <p className="whitespace-pre-wrap leading-7 text-zinc-400">
                        {question.answer ||
                          "Not answered yet"}
                      </p>
                    </div>

                    {/* Score */}

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5">
                      <p className="mb-2 font-semibold text-zinc-300">
                        Score
                      </p>

                      <p
                        className={`text-xl font-bold ${getScoreColor(
                          question.score ?? 0
                        )}`}
                      >
                        {question.score ?? 0}/10
                      </p>
                    </div>

                    {/* Feedback */}

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5">
                      <p className="mb-2 font-semibold text-zinc-300">
                        Feedback
                      </p>

                      <p className="whitespace-pre-wrap leading-7 text-zinc-400">
                        {question.feedback ||
                          "No feedback available."}
                      </p>
                    </div>

                    {/* Ideal Answer */}

                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                      <p className="mb-2 font-semibold text-emerald-400">
                        Ideal Answer
                      </p>

                      <p className="whitespace-pre-wrap leading-7 text-zinc-400">
                        {question.idealAnswer ||
                          "Not available."}
                      </p>
                    </div>

                  </div>
                )}

              </div>
            );
          }
        )}
      </section>

      {/* ================================================= */}
      {/* AI FEEDBACK                                       */}
      {/* ================================================= */}

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white">
          🤖 AI Overall Feedback
        </h2>

        <p className="mt-4 leading-7 text-zinc-400">
          {overallFeedback}
        </p>
      </section>

      {/* ================================================= */}
      {/* RECOMMENDATIONS                                   */}
      {/* ================================================= */}

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white">
          ✅ Recommendations
        </h2>

        <ul className="mt-4 list-disc space-y-3 pl-6 text-zinc-400">
          {recommendations.map(
            (recommendation, index) => (
              <li key={index}>
                {recommendation}
              </li>
            )
          )}
        </ul>
      </section>

      {/* ================================================= */}
      {/* RETAKE                                             */}
      {/* ================================================= */}

      <div className="flex justify-center pb-4">
        <button
          type="button"
          onClick={handleRetakeInterview}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-blue-500/30
            bg-blue-500/10
            px-8
            py-3
            font-semibold
            text-blue-400
            transition
            hover:-translate-y-0.5
            hover:bg-blue-500/20
          "
        >
          <span>🔄</span>
          Retake Interview
        </button>
      </div>

    </div>
  );
}