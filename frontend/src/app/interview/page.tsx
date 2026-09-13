"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import PageWrapper from "@/components/layout/PageWrapper";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/layout/PageHeader";

import EmptyState from "@/components/ui/states/EmptyState";

import Button from "@/components/ui/Button";

import { Plus } from "lucide-react";

import InterviewCard from "@/lib/components/InterviewCard";
import { getMyInterviews,deleteInterview } from "@/lib/services/interview";
import type { Interview } from "@/types/interview";
import CreateInterviewModal from "@/lib/components/CreateInterviewModal";
import Skeleton from "@/components/ui/Skeleton";
import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function InterviewPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedInterview, setSelectedInterview] = useState<Interview>();

  const fetchInterviews = async () => {
    try {
      setLoading(true);
  
      const response = await getMyInterviews();
  
      setInterviews(response.interviews);
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data as { message?: string })?.message
          : undefined;
  
      toast.error(message ?? "Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleEdit = (interview: Interview) => {
    setSelectedInterview(interview);
    setMode("edit");
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInterview(id);
      toast.success("Interview deleted successfully");

      fetchInterviews();
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data as { message?: string })?.message
          : undefined;
    
      toast.error(message ?? "Failed to delete interview");
    }
  };

  return (
  <ProtectedRoute>
    <PageWrapper>
      <Container className="py-8">
        <PageHeader
          title="My Interviews"
          description="Manage and continue your AI interview sessions."
          action={
            <Button
              onClick={() => {
                setMode("create");
                setSelectedInterview(undefined);
                setOpenModal(true);
              }}>
              <Plus className="h-4 w-4"/>
              Create Interview
             </Button>
          }
        />
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-72 w-full rounded-2xl"
              />
            ))}
          </div>
        )  : interviews.length === 0 ? (
          <EmptyState 
            title="No interviews yet"
            description="Create your first AI interview to start practicing." />
          ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {interviews.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    interview={interview}
                    variant="dashboard"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
        )}
        <CreateInterviewModal
              open={openModal}
              onClose={() => {
                setOpenModal(false);
                setMode("create");
                setSelectedInterview(undefined);
              }}
              onSuccess={fetchInterviews}
              mode={mode}
              interview={selectedInterview}
            />
      </Container>
    </PageWrapper>
  </ProtectedRoute>
  );
}