"use client";

import { useParams } from "next/navigation";
import toast from "react-hot-toast";

import { AxiosError } from "axios";

import PageWrapper from "@/components/layout/PageWrapper";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/layout/PageHeader";

import EmptyState from "@/components/ui/states/EmptyState";

import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

import { getResumeById } from "@/lib/services/resume";
import { useEffect, useState } from "react";
import Skeleton from "@/components/ui/Skeleton";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Breadcrumb from "@/components/common/Breadcrumb";
import Navbar from "@/lib/components/Navbar";

interface Resume {
  id: string;
  title: string;
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export default function ResumeDetailsPage() {
  const { id } = useParams();

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login first.");
          return;
        }

        const data = await getResumeById(
          id as string,
          token
        );

        setResume(data);
      } catch (error) {
        const message =
          error instanceof AxiosError
            ? (error.response?.data as { message?: string })?.message
            : undefined;
      
        toast.error(message ?? "Failed to fetch resume.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResume();
    }
  }, [id]);

  return (
  <ProtectedRoute>
      <PageWrapper>
        <Navbar />

      <Container className="py-8">
        {loading ? (
          <>
             <Skeleton className="mb-6 h-12 w-72" />
         
             <GlassCard className="space-y-6 p-6">
               <div className="flex items-center justify-between">
                 <Skeleton className="h-8 w-32" />
                 <Skeleton className="h-8 w-20" />
               </div>
         
               <div>
                 <Skeleton className="mb-3 h-6 w-32" />
                 <Skeleton className="mb-2 h-4 w-full" />
                 <Skeleton className="mb-2 h-4 w-5/6" />
                 <Skeleton className="h-4 w-4/6" />
               </div>
         
               <div>
                 <Skeleton className="mb-3 h-6 w-36" />
                 <Skeleton className="mb-2 h-4 w-full" />
                 <Skeleton className="mb-2 h-4 w-3/4" />
                 <Skeleton className="h-4 w-2/3" />
               </div>
         
               <div>
                 <Skeleton className="mb-3 h-6 w-36" />
                 <Skeleton className="mb-2 h-4 w-full" />
                 <Skeleton className="mb-2 h-4 w-4/5" />
                 <Skeleton className="h-4 w-3/5" />
               </div>
             </GlassCard>
           </> ) : !resume ? (
            <EmptyState
              title="Resume not found"
              description="The requested resume could not be found."
            />
        ):(
            <>
              <Breadcrumb 
                className="mb-6"
                    items={[
                          {
                            label: "Resume History",
                            href: "/resume/history",
                          },
                          {
                            label: resume.title,
                          },
                        ]}
                />
                <PageHeader
                  title={resume.title}
                  description="Resume Analysis"
                />

              <GlassCard className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    ATS Score
                  </h2>

                  <Badge variant="success">
                    {resume.atsScore}/100
                  </Badge>
                </div>

                <div>
                  <h2 className="mb-2 text-xl font-semibold text-white">
                    Strengths
                  </h2>
                
                  <ul className="list-disc space-y-2 pl-6 text-zinc-300">
                    {resume.strengths.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="mb-2 text-xl font-semibold text-white">
                    Weaknesses
                  </h2>
                
                  <ul className="list-disc space-y-2 pl-6 text-zinc-300">
                    {resume.weaknesses.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="mb-2 text-xl font-semibold text-white">
                    Suggestions
                  </h2>
                
                  <ul className="list-disc space-y-2 pl-6 text-zinc-300">
                    {resume.suggestions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </>
        )}
     </Container>
    </PageWrapper>
  </ProtectedRoute>
  );
}