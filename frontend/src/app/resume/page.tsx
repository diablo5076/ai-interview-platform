"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { uploadResume } from "@/lib/services/resume";

import PageWrapper from "@/components/layout/PageWrapper";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/layout/PageHeader";

import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";

import ProtectedRoute from "@/components/common/ProtectedRoute";
import Navbar from "@/lib/components/Navbar";

interface ResumeResult {
  resume: {
    atsScore: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
}

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeResult | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      toast.error("Please select a PDF file.");
      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a resume.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const data = await uploadResume(file, token);

      setResult(data);

      toast.success("Resume analyzed successfully.");
    } catch (error) {
      console.error("Resume analysis failed:", error);

      const message =
        error instanceof AxiosError
          ? (
              error.response?.data as {
                message?: string;
              }
            )?.message
          : undefined;

      toast.error(
        message ?? "Resume analysis failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <PageWrapper>
        <Navbar />

        <Container className="max-w-3xl py-8">
          <PageHeader
            title="AI Resume Analyzer"
            description="Upload your resume in PDF format to receive an ATS analysis."
          />

          <GlassCard className="space-y-6 p-8">
            <Input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              disabled={loading}
            />

            {file && (
              <Badge variant="secondary">
                {file.name}
              </Badge>
            )}

            <Button
              className="w-full"
              loading={loading}
              onClick={handleUpload}
              disabled={!file || loading}
            >
              Analyze Resume
            </Button>

            {loading && (
              <div className="space-y-6">
                <Skeleton className="h-28" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
              </div>
            )}

            {!loading && result && (
              <div className="space-y-6">
                {/* ATS Score */}
                <GlassCard className="p-6">
                  <h2 className="mb-2 text-xl font-semibold text-white">
                    ATS Score
                  </h2>

                  <p className="text-4xl font-bold text-primary">
                    {result.resume.atsScore}/100
                  </p>
                </GlassCard>

                {/* Strengths */}
                <GlassCard className="p-6">
                  <h2 className="mb-3 text-xl font-semibold text-white">
                    Strengths
                  </h2>

                  <ul className="list-disc space-y-2 pl-6 text-zinc-300">
                    {result.resume.strengths.map(
                      (item, index) => (
                        <li key={`${item}-${index}`}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </GlassCard>

                {/* Weaknesses */}
                <GlassCard className="p-6">
                  <h2 className="mb-3 text-xl font-semibold text-white">
                    Weaknesses
                  </h2>

                  <ul className="list-disc space-y-2 pl-6 text-zinc-300">
                    {result.resume.weaknesses.map(
                      (item, index) => (
                        <li key={`${item}-${index}`}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </GlassCard>

                {/* Suggestions */}
                <GlassCard className="p-6">
                  <h2 className="mb-3 text-xl font-semibold text-white">
                    Suggestions
                  </h2>

                  <ul className="list-disc space-y-2 pl-6 text-zinc-300">
                    {result.resume.suggestions.map(
                      (item, index) => (
                        <li key={`${item}-${index}`}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </GlassCard>
              </div>
            )}
          </GlassCard>
        </Container>
      </PageWrapper>
    </ProtectedRoute>
  );
}