"use client";

import InterviewCard from "./InterviewCard";
import EmptyState from "@/components/ui/states/EmptyState";
import type { Interview } from "@/types/interview";


interface InterviewListProps{
  interviews: Interview[];
  onEdit?: (interview: Interview) => void;
  onDelete?: (id: string) => void;
}

export default function InterviewList({
  interviews,
  onEdit,
  onDelete,
}: InterviewListProps) {
  if (interviews.length === 0) {
    return (
     <EmptyState title="No Interviews Yet" description="Click 'Create Interview' to get started."/>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {interviews.map((interview) => (
        <InterviewCard key={interview.id} interview={interview} variant="dashboard" onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}