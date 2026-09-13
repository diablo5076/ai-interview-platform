"use client";

import { useRouter } from "next/navigation";
import type { Interview } from "@/types/interview";

import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Tooltip from "@/components/ui/Tooltip";

interface InterviewCardProps {
  interview: Interview;
  variant: "dashboard" | "history";
  onEdit?: (interview: Interview) => void;
  onDelete?: (id: string) => void;
}

export default function InterviewCard({
  interview,
  variant,
  onEdit,
  onDelete,
}: InterviewCardProps) {
  const router = useRouter();

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?"
    );

    if (confirmed && onDelete) {
      onDelete(interview.id);
    }
  };

  /*
   * An interview can only be edited before
   * AI questions have been generated.
   */
  const canEdit = interview.questions.length === 0;

  return (
    <GlassCard className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            name={interview.role}
            size="md"
            className="bg-primary text-white"
          />

          <div>
            <h2 className="text-xl font-bold text-white">
              {interview.title}
            </h2>

            <p className="text-sm text-zinc-400">
              {interview.role}
            </p>
          </div>
        </div>

        <Badge variant="secondary">
          {interview.level}
        </Badge>
      </div>

      {/* Interview Details */}
      <div className="space-y-2 text-zinc-400">
        <p>
          <span className="font-semibold text-zinc-200">
            Duration:
          </span>{" "}
          {interview.duration} mins
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {variant === "dashboard" ? (
          <>
            {/* Open */}
            <Tooltip content="Open interview">
              <div className="flex-1">
                <Button
                  className="w-full"
                  onClick={() =>
                    router.push(
                      `/interview/${interview.id}`
                    )
                  }
                >
                  Open
                </Button>
              </div>
            </Tooltip>

            {/* Edit - ONLY BEFORE QUESTIONS ARE GENERATED */}
            {canEdit && (
              <Tooltip content="Edit interview">
                <div>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      onEdit?.(interview)
                    }
                  >
                    Edit
                  </Button>
                </div>
              </Tooltip>
            )}

            {/* Delete */}
            <Tooltip content="Delete interview">
              <div>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </Tooltip>
          </>
        ) : (
          <>
            {/* View Summary */}
            <Button
              className="flex-1"
              onClick={() =>
                router.push(
                  `/interview/${interview.id}/summary`
                )
              }
            >
              View Summary
            </Button>

            {/* Retake */}
            <Button
              variant="secondary"
              onClick={() =>
                router.push(
                  `/interview/${interview.id}`
                )
              }
            >
              Retake
            </Button>

            {/* Delete */}
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </GlassCard>
  );
}