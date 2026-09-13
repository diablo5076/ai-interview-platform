"use client";

import { motion } from "motion/react";
import { UserCheck, UserX, Users } from "lucide-react";

import { fadeIn } from "@/animations";
import Badge from "@/components/ui/Badge";

interface FaceStatusBadgeProps {
  status: "Face Detected" | "No Face" | "Multiple Faces";
}

export default function FaceStatusBadge({
  status,
}: FaceStatusBadgeProps) {
  const config = {
    "Face Detected": {
      variant: "success" as const,
      icon: <UserCheck className="h-4 w-4" />,
    },
    "No Face": {
      variant: "warning" as const,
      icon: <UserX className="h-4 w-4" />,
    },
    "Multiple Faces": {
      variant: "danger" as const,
      icon: <Users className="h-4 w-4" />,
    },
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <Badge
        variant={config[status].variant}
        className="flex items-center gap-2 px-4 py-2"
      >
        {config[status].icon}
        {status}
      </Badge>
    </motion.div>
  );
}