"use client";

import { motion } from "motion/react";
import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { fadeIn } from "@/animations";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

type TestCaseStatus = "passed" | "failed" | "pending";

interface TestCase{
  id: number;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  status: TestCaseStatus;
}

interface TestCasePanelProps {
  testCases: TestCase[];
  className?: string;
}

export default function TestCasePanel({
  testCases,
  className,
}: TestCasePanelProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard className={cn("space-y-4 p-4", className)}>
        <h3 className="text-lg font-semibold text-white">
          Test Cases
        </h3>

        <div className="space-y-3">
          {testCases.map((testCase) => (
            <div
              key={testCase.id}
              className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-medium text-white">
                  Test Case {testCase.id}
                </span>

                {testCase.status === "passed" && (
                  <CheckCircle2
                    className="h-5 w-5 text-green-500"
                    aria-hidden="true" />
                )}

                {testCase.status === "failed" && (
                  <XCircle
                    className="h-5 w-5 text-red-500"
                    aria-hidden="true" />
                )}

                {testCase.status === "pending" && (
                  <Circle
                    className="h-5 w-5 text-yellow-500"
                    aria-hidden="true" />
                )}
              </div>

              <div className="space-y-2 font-mono text-sm">
                <div>
                  <span className="text-zinc-400">
                    Input:
                  </span>

                  <pre className="mt-1 whitespace-pre-wrap text-zinc-200">
                    {testCase.input}
                  </pre>
                </div>

                <div>
                  <span className="text-zinc-400">
                    Expected Output:
                  </span>

                  <pre className="mt-1 whitespace-pre-wrap text-zinc-200">
                    {testCase.expectedOutput}
                  </pre>
                </div>

                {testCase.actualOutput !== undefined && (
                  <div>
                    <span className="text-zinc-400">
                      Your Output:
                    </span>

                    <pre className="mt-1 whitespace-pre-wrap text-zinc-200">
                      {testCase.actualOutput}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
