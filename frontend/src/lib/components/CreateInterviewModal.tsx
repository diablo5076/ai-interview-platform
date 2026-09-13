"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

import {
  createInterview,
  updateInterview,
} from "@/lib/services/interview";

import type { Interview } from "@/types/interview";

interface CreateInterviewModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: "create" | "edit";
  interview?: Interview;
}

interface InterviewForm {
  title: string;
  role: string;
  level: string;
  duration: number;
}

const levelOptions = [
  {
    label: "Junior",
    value: "Junior",
  },
  {
    label: "Mid",
    value: "Mid",
  },
  {
    label: "Senior",
    value: "Senior",
  },
];

const durationOptions = [
  {
    label: "15 minutes",
    value: "15",
  },
  {
    label: "30 minutes",
    value: "30",
  },
  {
    label: "60 minutes",
    value: "60",
  },
  {
    label: "90 minutes",
    value: "90",
  },
  {
    label: "180 minutes",
    value: "180",
  },
];

export default function CreateInterviewModal({
  open,
  onClose,
  onSuccess,
  mode,
  interview,
}: CreateInterviewModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      isSubmitting,
      errors,
    },
  } = useForm<InterviewForm>({
    defaultValues: {
      title: "",
      role: "",
      level: "",
      duration: 30,
    },
  });

  /*
   * =====================================================
   * RESET FORM
   * =====================================================
   */

  useEffect(() => {
    if (mode === "edit" && interview) {
      reset({
        title: interview.title,
        role: interview.role ?? "",
        level: interview.level ?? "",
        duration: interview.duration ?? 30,
      });

      return;
    }

    reset({
      title: "",
      role: "",
      level: "",
      duration: 30,
    });
  }, [
    mode,
    interview,
    reset,
  ]);

  /*
   * =====================================================
   * SUBMIT
   * =====================================================
   */

  const onSubmit = async (
    data: InterviewForm
  ) => {
    try {
      if (mode === "create") {
        await createInterview({
          ...data,
          duration: Number(data.duration),
        });

        toast.success(
          "Interview created successfully"
        );
      } else {
        if (!interview) {
          return;
        }

        await updateInterview(
          interview.id,
          {
            ...data,
            duration: Number(data.duration),
          }
        );

        toast.success(
          "Interview updated successfully"
        );
      }

      onSuccess();
      onClose();
      reset();
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
          `Failed to ${mode} interview`
      );
    }
  };

  /*
   * =====================================================
   * CLOSE
   * =====================================================
   */

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    reset();
    onClose();
  };

  /*
   * =====================================================
   * UI
   * =====================================================
   */

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={
        mode === "create"
          ? "Create Interview"
          : "Edit Interview"
      }
    >
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Interview Title */}

        <Input
          disabled={isSubmitting}
          label="Interview Title"
          autoComplete="off"
          placeholder="Enter interview title"
          error={errors.title?.message}
          {...register("title", {
            required:
              "Interview title is required",
          })}
        />

        {/* Role */}

        <Input
          disabled={isSubmitting}
          label="Role"
          autoComplete="organization-title"
          placeholder="Enter role"
          error={errors.role?.message}
          {...register("role", {
            required:
              "Role is required",
          })}
        />

        {/* Experience Level */}

        <Select
          disabled={isSubmitting}
          label="Experience Level"
          placeholder="Select level"
          options={levelOptions}
          error={errors.level?.message}
          {...register("level", {
            required:
              "Please select a level",
          })}
        />

        {/* Duration */}

        <Select
          disabled={isSubmitting}
          label="Interview Duration"
          placeholder="Select duration"
          options={durationOptions}
          error={errors.duration?.message}
          {...register("duration", {
            required:
              "Please select interview duration",
            setValueAs: (value) =>
              Number(value),
            validate: (value) =>
              [15, 30, 60, 90, 180].includes(
                value
              ) ||
              "Please select a valid duration",
          })}
        />

        {/* Actions */}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={isSubmitting}
          >
            {mode === "create"
              ? "Create Interview"
              : "Update Interview"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}