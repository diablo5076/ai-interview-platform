"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { motion } from "motion/react";
import {
  CalendarDays,
  Clock3,
  ArrowRight,
} from "lucide-react";

import PageWrapper from "@/components/layout/PageWrapper";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/layout/PageHeader";

import EmptyState from "@/components/ui/states/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import ProtectedRoute from "@/components/common/ProtectedRoute";

import Navbar from "@/lib/components/Navbar";

import { getMyInterviews } from "@/lib/services/interview";
import type { Interview } from "@/types/interview";

export default function InterviewHistoryPage() {
  const [interviews, setInterviews] =
    useState<Interview[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);

        const data = await getMyInterviews();

        const completedInterviews =
          data.interviews.filter(
            (interview) =>
              interview.questions.length > 0 &&
              interview.questions.every(
                (question) => question.isAnswered
              )
          );

        setInterviews(completedInterviews);
      } catch (error) {
        const message =
          error instanceof AxiosError
            ? (
                error.response?.data as {
                  message?: string;
                }
              )?.message
            : undefined;

        toast.error(
          message ?? "Failed to fetch interviews."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <ProtectedRoute>
      <PageWrapper>
        <Navbar />

        <main className="min-h-screen bg-[#050505]">
          <Container className="py-8 pt-28">
            {/* Header */}

            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
              }}
            >
              <PageHeader
                title="Interview History"
                description="Browse all of your completed interview sessions."
              />
            </motion.div>

            {/* Content */}

            <div className="mt-8">
              {loading ? (
                <div className="grid gap-6">
                  {Array.from({
                    length: 5,
                  }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-32 w-full"
                    />
                  ))}
                </div>
              ) : interviews.length === 0 ? (
                <EmptyState
                  title="No completed interviews"
                  description="Complete an interview to see it here."
                />
              ) : (
                <div className="grid gap-5">
                  {interviews.map((interview) => (
                    <motion.div
                      key={interview.id}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                      whileHover={{
                        y: -3,
                      }}
                    >
                      <Link
                        href={`/interview/history/${interview.id}`}
                        className="block"
                      >
                        <GlassCard
                          className="
                            space-y-5
                            border
                            border-white/10
                            bg-zinc-950/70
                            p-6
                            transition-all
                            duration-300
                            hover:border-primary/40
                            hover:bg-zinc-900/80
                          "
                        >
                          {/* Top */}

                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h2 className="text-xl font-semibold text-white">
                                {interview.title}
                              </h2>

                              <p className="mt-2 text-sm text-zinc-400">
                                {interview.role}
                              </p>
                            </div>

                            <Badge variant="success">
                              Completed
                            </Badge>
                          </div>

                          {/* Details */}

                          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
                            <div className="flex flex-wrap items-center gap-5 text-sm text-zinc-500">
                              <span className="flex items-center gap-2">
                                <Clock3 className="h-4 w-4" />

                                {interview.duration} mins
                              </span>

                              <span className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4" />

                                {new Date(
                                  interview.createdAt
                                ).toLocaleDateString()}
                              </span>

                              <Badge variant="secondary">
                                {interview.level}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2 text-sm font-medium text-primary">
                              View Report

                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                        </GlassCard>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Container>
        </main>
      </PageWrapper>
    </ProtectedRoute>
  );
}