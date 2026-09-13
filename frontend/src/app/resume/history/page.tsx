"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

import { AxiosError } from "axios";

import PageWrapper from "@/components/layout/PageWrapper";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/layout/PageHeader";

import EmptyState from "@/components/ui/states/EmptyState";

import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

import { getResumes } from "@/lib/services/resume";
import Skeleton from "@/components/ui/Skeleton";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Navbar from "@/lib/components/Navbar";

interface Resume {
  id: string;
  title: string;
  atsScore: number;
  createdAt: string;
}

export default function ResumeHistoryPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login first.");
          return;
        }

        const data = await getResumes(token);

        setResumes(data);
      } catch (error){
        const message =
          error instanceof AxiosError
            ? (error.response?.data as { message?: string })?.message
            : undefined;
      
        toast.error(message ?? "Failed to fetch resumes.");
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  return (
  <ProtectedRoute>
    <PageWrapper>
      <Navbar />
      <Container className="py-8">
        <PageHeader
          title="Resume History"
          description="Browse all of your uploaded resume analyses." />

      {loading ? (
        <div className="grid gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-32 w-full"
              />
            ))}
          </div>      ) : resumes.length === 0 ? (
            <EmptyState
              title="No resumes found"
              description="Upload a resume to see it here."
            />
      ) : (
        <div className="grid gap-6">
          {resumes.map((resume) => (
            <Link key={resume.id} href={`/resume/history/${resume.id}`}>
              
             <GlassCard className="space-y-4 p-6 transition-all hover:border-primary/40">
                <div className="flex items-start justify-between">
                  <div>
                  <h2 className="text-xl font-semibold text-white">
                    {resume.title}
                  </h2>

                  <p className="mt-2 text-zinc-400">
                    Uploaded resume
                  </p>
                </div>

                <Badge variant="success">
                  {resume.atsScore}/100
                </Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-zinc-500">
                  <span>ATS Analysis</span>

                  <span>
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </span>
                </div>
            </GlassCard>
            </Link>
          ))}
        </div>
        )}
       </Container>
      </PageWrapper>
  </ProtectedRoute>

  );
}