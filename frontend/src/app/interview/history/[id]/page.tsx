"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import PageWrapper from "@/components/layout/PageWrapper";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/layout/PageHeader";

import LoadingState from "@/components/ui/states/LoadingState";
import EmptyState from "@/components/ui/states/EmptyState";

import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

import { getInterview } from "@/lib/services/interview";
import type { Interview } from "@/types/interview";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Breadcrumb from "@/components/common/Breadcrumb";
import ScoreCard from "@/components/report/ScoreCard";
import FeedbackCard from "@/components/report/FeedbackCard";
import InterviewSummary from "@/components/report/InterviewSummary";
import { getCurrentUser } from "@/lib/services/auth";
import SkillBreakDown from "@/components/report/SkillBreakDown";
import RadarChart from "@/components/report/RadarChart";
import Navbar from "@/lib/components/Navbar";


export default function InterviewDetailsPage() {
  const { id } = useParams();

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    email: string;
    createdAt: string;
  } | null>(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const data = await getInterview(id as string);
        setInterview(data.interview);

        const userResponse = await getCurrentUser();
        setUser(userResponse.user);
      } catch (error) {
        const message =
          error instanceof AxiosError
            ? (error.response?.data as { message?: string })?.message
            : undefined;
      
        toast.error(message ?? "Failed to fetch interview.");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchInterview();
    }
  }, [id]);

  const answeredQuestions = interview?.questions.filter(
    (question) => question.score !== null
  ) ?? [];

  const overallScore =
    answeredQuestions.length > 0
      ? Math.round(
          (
            answeredQuestions.reduce(
              (sum, question) => sum + (question.score ?? 0),
              0
            ) / answeredQuestions.length
          ) * 10
        )
      : 0;

  const radarData = interview?.skills.map((skill) => ({
    subject: skill.name,
    score: skill.score,
  })) ?? [];
  return (
  <ProtectedRoute>
      <PageWrapper >
        <Navbar/>
      <Container className="py-8">
        {loading ? (
          <LoadingState message="Loading interview..."/>
        ) : !interview ? (
            <EmptyState
              title="Interview not found"
              description="The requested interview could not be found." />
        ) : (
          <>
            <Breadcrumb
              className="mb-6"
              items={[
                {
                  label: "Interview History",
                  href: "/interview/history",
                },
                {
                  label: interview.title,
                },
              ]}
            />
            <PageHeader
              title={interview.title}
              description={`${interview.role} • ${interview.level} • ${interview.duration} mins`}
            />
                  <InterviewSummary
                    candidateName={user?.email.split("@")[0] ?? "Unknown User"}
                    interviewRole={interview.role}
                    completedOn={new Date(interview.createdAt).toLocaleDateString()}
                    duration={`${interview.duration} mins`}
                    overallScore={overallScore}
                 />
            <div className="my-8">
              <ScoreCard
                title="Overall Score"
                score={overallScore}
                description="Average performance across all questions."/>
            </div>
            
            <div className="mb-8">
              <SkillBreakDown skills={interview.skills}/>
              <RadarChart data={radarData} />
            </div>
     
            <div className="space-y-6">
              {interview.questions.map((question, index) => (
                <GlassCard key={question.id} className="space-y-6 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-semibold text-white">
                    Question {index + 1}
                    </h2>

                    <Badge variant={question.score !== null ? "success" : "warning"}>
                      {question.score !== null
                        ? `${question.score}/10`
                        : "Not Evaluated"}
                    </Badge>
                  </div>
                  
                  <p className="text-zinc-300">
                    {question.question}
                  </p>

                  <div className="mt-6 space-y-5">
                    <div>
                      <h3 className="font-semibold text-white">
                        Your Answer
                      </h3>

                      <p className="mt-1 whitespace-pre-line text-zinc-300">
                        {question.answer ?? "No answer submitted."}
                      </p>
                    </div>          
                    <div className="grid gap-6 lg:grid-cols-2">
                    <FeedbackCard
                      title="Feedback"
                      feedback={question.feedback ?? "No feedback available."}
                      type={
                        question.score !== null && question.score >= 8
                          ? "positive"
                          : question.score !== null && question.score >= 5
                          ? "neutral"
                          : "improvement"
                      }
                    />
                    <FeedbackCard
                      title="Ideal Answer"
                      feedback={question.idealAnswer ?? "No ideal answer avaliable."}
                      type="neutral"
                    />
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </>
        )}
      </Container>
    </PageWrapper>
  </ProtectedRoute>
  );
}