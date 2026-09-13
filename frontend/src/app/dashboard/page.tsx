"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ClipboardList,
  CheckCircle2,
  Clock3,
  Plus,
  Briefcase,
  FileText,
  History,
  User,
  ArrowRight,
} from "lucide-react";

import Navbar from "@/lib/components/Navbar";
import CreateInterviewModal from "@/lib/components/CreateInterviewModal";
import InterviewList from "@/lib/components/InterviewList";

import {
  getMyInterviews,
  deleteInterview,
} from "@/lib/services/interview";

import toast from "react-hot-toast";
import { AxiosError } from "axios";

import PageWrapper from "@/components/layout/PageWrapper";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/layout/PageHeader";

import StatCard from "@/components/dashboard/StatCard";
import RecentInterviewCard from "@/components/dashboard/RecentInterviewCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";

import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import ProtectedRoute from "@/components/common/ProtectedRoute";

import type { Interview } from "@/types/interview";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);

  const [interviews, setInterviews] =
    useState<Interview[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [mode, setMode] =
    useState<"create" | "edit">("create");

  const [selectedInterview, setSelectedInterview] =
    useState<Interview | undefined>();

  const [mousePosition, setMousePosition] =
    useState({
      x: 50,
      y: 30,
    });

  /*
   * ============================================================
   * MOUSE FOLLOWING GLOW
   * ============================================================
   */

  useEffect(() => {
    const handleMouseMove = (
      event: MouseEvent
    ) => {
      setMousePosition({
        x:
          (event.clientX /
            window.innerWidth) *
          100,

        y:
          (event.clientY /
            window.innerHeight) *
          100,
      });
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);

  /*
   * ============================================================
   * FETCH INTERVIEWS
   * ============================================================
   */

  const fetchInterviews = async () => {
    try {
      setLoading(true);

      const response =
        await getMyInterviews();

      setInterviews(
        response.interviews
      );
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
        message ??
          "Failed to load interviews"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ============================================================
   * EDIT INTERVIEW
   * ============================================================
   */

  const handleEdit = (
    interview: Interview
  ) => {
    setSelectedInterview(
      interview
    );

    setMode("edit");
    setOpen(true);
  };

  /*
   * ============================================================
   * DELETE INTERVIEW
   * ============================================================
   */

  const handleDelete = async (
    id: string
  ) => {
    try {
      await deleteInterview(id);

      toast.success(
        "Interview deleted"
      );

      await fetchInterviews();
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
        message ?? "Delete failed"
      );
    }
  };

  /*
   * ============================================================
   * INTERVIEW STATS
   * ============================================================
   *
   * IMPORTANT:
   *
   * completed is now taken directly from
   * the database instead of calculating it
   * from question.isAnswered.
   *
   * ============================================================
   */

  const totalInterviews =
    interviews.length;

  const completedInterviews =
    interviews.filter(
      (interview) =>
        interview.completed
    ).length;

  const pendingInterviews =
    totalInterviews -
    completedInterviews;

  /*
   * ============================================================
   * RECENT INTERVIEWS
   * ============================================================
   */

  const recentInterviews =
    [...interviews]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      )
      .slice(0, 5);

  /*
   * ============================================================
   * INITIAL LOAD
   * ============================================================
   */

  useEffect(() => {
    fetchInterviews();
  }, []);

  /*
   * ============================================================
   * QUICK ACTIONS
   * ============================================================
   */

  const quickActions = [
    {
      title: "Create Interview",
      description:
        "Start a new AI interview session.",
      href: "/interview",
      icon: (
        <Plus className="h-6 w-6" />
      ),
    },

    {
      title: "Resume Analyzer",
      description:
        "Analyze your resume with AI.",
      href: "/resume",
      icon: (
        <FileText className="h-6 w-6" />
      ),
    },

    {
      title: "Interview History",
      description:
        "Review your past interviews.",
      href: "/history",
      icon: (
        <History className="h-6 w-6" />
      ),
    },

    {
      title: "Profile",
      description:
        "Manage your account settings.",
      href: "/profile",
      icon: (
        <User className="h-6 w-6" />
      ),
    },
  ];

  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  return (
    <ProtectedRoute>
      <PageWrapper>

        <div className="relative min-h-screen overflow-hidden bg-[#050505]">

          {/* ================================================== */}
          {/* AMBIENT BACKGROUND */}
          {/* ================================================== */}

          <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

            {/* Mouse Glow */}

            <motion.div
              className="
                absolute
                h-[600px]
                w-[600px]
                rounded-full
                bg-purple-600/10
                blur-[140px]
              "
              animate={{
                left: `${
                  mousePosition.x - 15
                }%`,

                top: `${
                  mousePosition.y - 15
                }%`,
              }}
              transition={{
                type: "spring",
                stiffness: 25,
                damping: 30,
              }}
            />

            {/* Purple Glow */}

            <motion.div
              className="
                absolute
                -left-48
                -top-48
                h-[600px]
                w-[600px]
                rounded-full
                bg-purple-700/10
                blur-[140px]
              "
              animate={{
                scale: [1, 1.15, 1],
                opacity: [
                  0.4,
                  0.7,
                  0.4,
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Blue Glow */}

            <motion.div
              className="
                absolute
                -bottom-64
                -right-48
                h-[650px]
                w-[650px]
                rounded-full
                bg-blue-600/10
                blur-[150px]
              "
              animate={{
                scale: [1, 1.2, 1],
                opacity: [
                  0.3,
                  0.6,
                  0.3,
                ],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Grid */}

            <div
              className="
                absolute
                inset-0
                opacity-[0.025]
                [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
                [background-size:55px_55px]
              "
            />

            {/* Vignette */}

            <div
              className="
                absolute
                inset-0
                bg-[radial-gradient(circle_at_center,transparent_20%,#050505_90%)]
              "
            />

          </div>

          {/* ================================================== */}
          {/* FLOATING PARTICLES */}
          {/* ================================================== */}

          <div className="pointer-events-none fixed inset-0 z-0">

            {Array.from({
              length: 25,
            }).map(
              (_, index) => (
                <motion.span
                  key={index}
                  className="
                    absolute
                    h-1
                    w-1
                    rounded-full
                    bg-purple-400/30
                  "
                  style={{
                    left: `${
                      (index * 41) %
                      100
                    }%`,

                    top: `${
                      (index * 67) %
                      100
                    }%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [
                      0.1,
                      0.6,
                      0.1,
                    ],
                    scale: [
                      1,
                      1.5,
                      1,
                    ],
                  }}
                  transition={{
                    duration:
                      4 +
                      (index % 4),

                    repeat:
                      Infinity,

                    ease:
                      "easeInOut",
                  }}
                />
              )
            )}

          </div>

          {/* ================================================== */}
          {/* NAVBAR */}
          {/* ================================================== */}

          <div className="relative z-20">
            <Navbar />
          </div>

          {/* ================================================== */}
          {/* MAIN CONTENT */}
          {/* ================================================== */}

          <div className="relative z-10">

            <Container className="py-8 pt-28">

              {/* ================================================== */}
              {/* HEADER */}
              {/* ================================================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: -12,
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
                  title="Dashboard"
                  description="Welcome to your AI Interview Platform."
                  action={
                    <motion.div
                      whileHover={{
                        scale: 1.03,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                    >
                      <Button
                        onClick={() => {
                          setMode(
                            "create"
                          );

                          setSelectedInterview(
                            undefined
                          );

                          setOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4" />

                        Create Interview
                      </Button>
                    </motion.div>
                  }
                />
              </motion.div>

              {/* ================================================== */}
              {/* STATS */}
              {/* ================================================== */}

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
                className="mt-8 grid gap-6 md:grid-cols-3"
              >

                {loading ? (
                  <>
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                  </>
                ) : (
                  <>
                    <motion.div
                      whileHover={{
                        y: -5,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                    >
                      <StatCard
                        title="Total Interviews"
                        value={
                          totalInterviews
                        }
                        description="All interviews created"
                        icon={
                          <ClipboardList className="h-6 w-6" />
                        }
                      />
                    </motion.div>

                    <motion.div
                      whileHover={{
                        y: -5,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                    >
                      <StatCard
                        title="Completed"
                        value={
                          completedInterviews
                        }
                        description="Successfully finished"
                        icon={
                          <CheckCircle2 className="h-6 w-6" />
                        }
                      />
                    </motion.div>

                    <motion.div
                      whileHover={{
                        y: -5,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                    >
                      <StatCard
                        title="Pending"
                        value={
                          pendingInterviews
                        }
                        description="Awaiting completion"
                        icon={
                          <Clock3 className="h-6 w-6" />
                        }
                      />
                    </motion.div>
                  </>
                )}

              </motion.div>

              {/* ================================================== */}
              {/* QUICK ACTIONS */}
              {/* ================================================== */}

              <motion.section
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
                className="mt-12"
              >

                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white">
                    Quick Actions
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Jump back into your interview workflow.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                  {quickActions.map(
                    (action) => (
                      <motion.div
                        key={
                          action.title
                        }
                        initial={{
                          opacity: 0,
                          y: 8,
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
                          y: -6,
                        }}
                      >
                        <QuickActionCard
                          title={
                            action.title
                          }
                          description={
                            action.description
                          }
                          href={
                            action.href
                          }
                          icon={
                            action.icon
                          }
                        />
                      </motion.div>
                    )
                  )}

                </div>
              </motion.section>

              {/* ================================================== */}
              {/* RECENT INTERVIEWS */}
              {/* ================================================== */}

              <motion.section
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
                className="mt-12"
              >

                <div className="mb-6 flex items-end justify-between">

                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      Recent Interviews
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                      Your latest interview activity.
                    </p>
                  </div>

                  <span className="text-sm text-zinc-500">
                    Last{" "}
                    {
                      recentInterviews.length
                    }{" "}
                    interview
                    {recentInterviews.length !==
                    1
                      ? "s"
                      : ""}
                  </span>

                </div>

                {loading ? (
                  <div className="space-y-4">

                    {Array.from({
                      length: 5,
                    }).map(
                      (_, index) => (
                        <Skeleton
                          key={index}
                          className="h-24 w-full"
                        />
                      )
                    )}

                  </div>
                ) : recentInterviews.length ===
                  0 ? (
                  <EmptyState
                    title="No Recent Interviews"
                    description="Create your first interview to see it here."
                  />
                ) : (
                  <div className="space-y-4">

                    {recentInterviews.map(
                      (interview) => {

                        /*
                         * Completion now comes
                         * directly from Prisma.
                         */

                        const answeredQuestions =
                          interview.questions.filter(
                            (
                              question
                            ) =>
                              question.score !==
                              null
                          );

                        const overallScore =
                          answeredQuestions.length >
                          0
                            ? Math.round(
                                (
                                  answeredQuestions.reduce(
                                    (
                                      sum,
                                      question
                                    ) =>
                                      sum +
                                      (
                                        question.score ??
                                        0
                                      ),
                                    0
                                  ) /
                                    answeredQuestions.length
                                ) * 10
                              )
                            : 0;

                        return (
                          <motion.div
                            key={
                              interview.id
                            }
                            initial={{
                              opacity: 0,
                              y: 8,
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
                              x: 4,
                            }}
                          >
                            <RecentInterviewCard
                              title={
                                interview.title
                              }
                              role={
                                interview.role
                              }
                              date={new Date(
                                interview.createdAt
                              ).toLocaleDateString()}
                              score={
                                overallScore
                              }
                              status={
                                interview.completed
                                  ? "Completed"
                                  : "Pending"
                              }
                              href={`/interview/${interview.id}`}
                              icon={
                                <Briefcase className="h-5 w-5" />
                              }
                            />
                          </motion.div>
                        );
                      }
                    )}

                  </div>
                )}

              </motion.section>

              {/* ================================================== */}
              {/* ALL INTERVIEWS */}
              {/* ================================================== */}

              <motion.section
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
                className="my-12"
              >

                <div className="mb-6 flex items-center justify-between">

                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      All Interviews
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                      Manage your interview sessions.
                    </p>
                  </div>

                  <ArrowRight className="h-5 w-5 text-zinc-600" />

                </div>

                {loading ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {Array.from({
                      length: 6,
                    }).map(
                      (_, index) => (
                        <Skeleton
                          key={index}
                          className="h-72 w-full"
                        />
                      )
                    )}

                  </div>
                ) : (
                  <InterviewList
                    interviews={
                      interviews
                    }
                    onEdit={
                      handleEdit
                    }
                    onDelete={
                      handleDelete
                    }
                  />
                )}

              </motion.section>

            </Container>

          </div>

          {/* ================================================== */}
          {/* CREATE / EDIT MODAL */}
          {/* ================================================== */}

          <CreateInterviewModal
            open={open}
            onClose={() => {
              setOpen(false);
              setMode("create");
              setSelectedInterview(
                undefined
              );
            }}
            onSuccess={
              fetchInterviews
            }
            mode={mode}
            interview={
              selectedInterview
            }
          />

        </div>

      </PageWrapper>
    </ProtectedRoute>
  );
}