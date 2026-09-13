"use client";

import { useEffect, useState } from "react";
import type { Interview } from "@/types/interview";
import { deleteInterview, getMyInterviews } from "@/lib/services/interview";
import InterviewCard from "@/lib/components/InterviewCard";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import Pagination from "@/components/common/Pagination";
import PageWrapper from "@/components/layout/PageWrapper";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/layout/PageHeader";

import EmptyState from "@/components/ui/states/EmptyState";

import Select from "@/components/ui/Select";
import GlassCard from "@/components/ui/GlassCard";
import SearchBar from "@/components/common/SearchBar";
import Skeleton from "@/components/ui/Skeleton";
import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function MyInterviewPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const [currentPage, setCurrentPage] = useState(1);
  const interviewsPerPage = 6;


  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const data = await getMyInterviews();

      setInterviews(data.interviews);
    } catch (error){
      const message =
        error instanceof AxiosError
          ? (error.response?.data as { message?: string })?.message
          : undefined;
    
      toast.error(message ?? "Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInterview(id);

      setInterviews((prev) =>
        prev.filter((interview) => interview.id !== id));

      toast.success("Interview deleted successfully");
    } catch (error){
      const message =
        error instanceof AxiosError
          ? (error.response?.data as { message?: string })?.message
          : undefined;
    
      toast.error(message ?? "Failed to delete interview");
    }
  };

  const filteredInterviews = interviews.filter((interview) => {
    const query = search.toLowerCase();

    const matchesSearch =
      interview.title.toLowerCase().includes(query) ||
      interview.role.toLowerCase().includes(query) ||
      interview.level.toLowerCase().includes(query);

    const matchesLevel = levelFilter === "All" || interview.level === levelFilter;

    return matchesSearch && matchesLevel;
  });

  const sortedInterviews = [...filteredInterviews].sort((a, b) => {
    if (sortBy === "Newest") {
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    if (sortBy === "Oldest") {
      return (
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    if (sortBy === "Title") {
      return a.title.localeCompare(b.title);
    }

    return 0;
  });

  const indexOfLastInterview = currentPage * interviewsPerPage;
  const indexOffirstInterview = indexOfLastInterview - interviewsPerPage;

  const currentInterviews = sortedInterviews.slice(
    indexOffirstInterview,
    indexOfLastInterview
  );

  const totalPages = Math.ceil(
    sortedInterviews.length / interviewsPerPage
  );

 
  useEffect(() => {
    fetchInterviews();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, levelFilter, sortBy]);

  if (loading) {
    return (
    <ProtectedRoute>
      <PageWrapper>
            <Container className="py-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-72" />
                ))}
              </div>            
            </Container>
        </PageWrapper>
    </ProtectedRoute>
    );
  }

  if (interviews.length === 0){
    return (
    <ProtectedRoute>
      <PageWrapper>
        <Container className="py-8 ">
          <PageHeader
            title="My Interviews"
            description="Search and manage all your interviews."
          />

          <EmptyState
            title="No interviews found"
            description="Create an interview to get started."
          />
        </Container>
        </PageWrapper>
    </ProtectedRoute>
    );
  }
  return (
  <ProtectedRoute>
      <PageWrapper>
        <Container className="py-8">
          <PageHeader title="My Interviews" description="Search, filter and manage your interviews."/>
        <GlassCard className="mb-6 flex flex-col gap-4 p-6 md:flex-row">
          <SearchBar placeholder="Search Interviews..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
            <Select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              options={[
                    { label: "All Levels", value: "All" },
                    { label: "Beginner", value: "Beginner" },
                    { label: "Intermediate", value: "Intermediate" },
                    { label: "Advanced", value: "Advanced" },
              ]}
            />

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                  { label: "Newest", value: "Newest" },
                  { label: "Oldest", value: "Oldest" },
                  { label: "Title (A-Z)", value: "Title" },
              ]}
            />
        </GlassCard>
        {currentInterviews.length === 0 ? (
          <EmptyState
            title="No matching interviews"
            description="Try changing your search or filters."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                variant="history"
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
          <Pagination className="mt-8" currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
        </Container>
      </PageWrapper>
  </ProtectedRoute>
    ) 
}