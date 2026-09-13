import { Router } from "express";

import { prisma } from "../lib/prisma.js";
import { auth, type AuthRequest } from "../middleware/auth.js";

const router = Router();

const ALLOWED_DURATIONS = [15, 30, 60, 90, 180];

router.post("/create", auth, async (req: AuthRequest, res) => {
try {
if (!req.userId) {
return res.status(401).json({ message: "Unauthorized" });
}

const { title, role, level, duration } = req.body;

if (typeof title !== "string" || !title.trim()) {
  return res.status(400).json({ message: "Title is required" });
}

if (
  typeof duration !== "number" ||
  !ALLOWED_DURATIONS.includes(duration)
) {
  return res.status(400).json({
    message: "Duration must be 15, 30, 60, 90, or 180 minutes",
  });
}

const interview = await prisma.interview.create({
  data: {
    title: title.trim(),
    role: typeof role === "string" ? role.trim() : null,
    level: typeof level === "string" ? level.trim() : null,
    duration,
    userId: req.userId,
  },
});

return res.status(201).json(interview);

} catch (error) {
console.error("Interview creation failed:", error);
return res.status(500).json({ message: "Interview creation failed" });
}
});

router.get("/my", auth, async (req: AuthRequest, res) => {
try {
if (!req.userId) {
return res.status(401).json({ message: "Unauthorized" });
}

const interviews = await prisma.interview.findMany({
  where: {
    userId: req.userId,
  },
  include: {
    questions: {
      orderBy: {
        order: "asc",
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
});

return res.status(200).json({ interviews });

} catch (error) {
console.error("Failed to fetch interviews:", error);
return res.status(500).json({ message: "Failed to fetch interviews" });
}
});

router.post("/:id/start", auth, async (req: AuthRequest, res) => {
try {
const { id } = req.params;

if (typeof id !== "string") {
  return res.status(400).json({ message: "Invalid interview ID" });
}

if (!req.userId) {
  return res.status(401).json({ message: "Unauthorized" });
}

const interview = await prisma.interview.findFirst({
  where: {
    id,
    userId: req.userId,
  },
  include: {
    questions: {
      select: {
        id: true,
      },
    },
  },
});

if (!interview) {
  return res.status(404).json({ message: "Interview not found" });
}

if (interview.completed) {
  return res.status(400).json({
    message: "This interview has already been completed",
  });
}

if (interview.questions.length === 0) {
  return res.status(400).json({
    message: "Generate interview questions before starting",
  });
}

if (interview.startedAt) {
  if (interview.duration == null) {
    return res.status(400).json({
      message: "Interview duration is not configured",
    });
  }

  const expiresAt = new Date(
    interview.startedAt.getTime() + interview.duration * 60 * 1000
  );

  if (new Date() >= expiresAt) {
    const completedAt = new Date();

    const expiredInterview = await prisma.interview.update({
      where: {
        id: interview.id,
      },
      data: {
        completed: true,
        completedAt,
      },
    });

    return res.status(400).json({
      message: "Interview time has expired",
      interviewCompleted: expiredInterview.completed,
      completedAt: expiredInterview.completedAt,
    });
  }

  return res.status(200).json({
    message: "Interview already started",
    interviewStarted: true,
    startedAt: interview.startedAt,
    duration: interview.duration,
    completed: interview.completed,
    completedAt: interview.completedAt,
  });
}

if (interview.duration == null) {
  return res.status(400).json({
    message: "Interview duration is not configured",
  });
}

const startedAt = new Date();

const updatedInterview = await prisma.interview.update({
  where: {
    id: interview.id,
  },
  data: {
    startedAt,
  },
});

return res.status(200).json({
  message: "Interview started successfully",
  interviewStarted: true,
  startedAt: updatedInterview.startedAt,
  duration: updatedInterview.duration,
  completed: updatedInterview.completed,
  completedAt: updatedInterview.completedAt,
});

} catch (error) {
console.error("Interview start failed:", error);
return res.status(500).json({ message: "Failed to start interview" });
}
});

router.post("/:id/finish", auth, async (req: AuthRequest, res) => {
try {
const { id } = req.params;

if (typeof id !== "string") {
  return res.status(400).json({ message: "Invalid interview ID" });
}

if (!req.userId) {
  return res.status(401).json({ message: "Unauthorized" });
}

const interview = await prisma.interview.findFirst({
  where: {
    id,
    userId: req.userId,
  },
  include: {
    questions: {
      orderBy: {
        order: "asc",
      },
    },
  },
});

if (!interview) {
  return res.status(404).json({ message: "Interview not found" });
}

if (interview.completed) {
  return res.status(200).json({
    message: "Interview already completed",
    interviewCompleted: true,
    completedAt: interview.completedAt,
    interview,
  });
}

if (!interview.startedAt) {
  return res.status(400).json({
    message: "Interview has not been started",
  });
}

const completedAt = new Date();

const updatedInterview = await prisma.interview.update({
  where: {
    id: interview.id,
  },
  data: {
    completed: true,
    completedAt,
  },
  include: {
    questions: {
      orderBy: {
        order: "asc",
      },
    },
  },
});

return res.status(200).json({
  message: "Interview completed successfully",
  interviewCompleted: true,
  completedAt,
  interview: updatedInterview,
});

} catch (error) {
console.error("Interview completion failed:", error);
return res.status(500).json({
message: "Failed to complete interview",
});
}
});

router.put("/:id", auth, async (req: AuthRequest, res) => {
try {
const { id } = req.params;

if (typeof id !== "string") {
  return res.status(400).json({ message: "Invalid interview ID" });
}

if (!req.userId) {
  return res.status(401).json({ message: "Unauthorized" });
}

const interview = await prisma.interview.findFirst({
  where: {
    id,
    userId: req.userId,
  },
  include: {
    questions: {
      select: {
        id: true,
      },
    },
  },
});

if (!interview) {
  return res.status(404).json({ message: "Interview not found" });
}

if (interview.questions.length > 0) {
  return res.status(400).json({
    message:
      "Interview cannot be edited after questions have been generated",
  });
}

if (interview.completed) {
  return res.status(400).json({
    message: "Completed interviews cannot be edited",
  });
}

const { title, role, level, duration } = req.body;

if (
  title !== undefined &&
  (typeof title !== "string" || !title.trim())
) {
  return res.status(400).json({ message: "Invalid title" });
}

if (
  duration !== undefined &&
  (typeof duration !== "number" ||
    !ALLOWED_DURATIONS.includes(duration))
) {
  return res.status(400).json({
    message: "Duration must be 15, 30, 60, 90, or 180 minutes",
  });
}

const updatedInterview = await prisma.interview.update({
  where: {
    id,
  },
  data: {
    ...(title !== undefined && {
      title: title.trim(),
    }),
    ...(role !== undefined && {
      role: typeof role === "string" ? role.trim() : null,
    }),
    ...(level !== undefined && {
      level: typeof level === "string" ? level.trim() : null,
    }),
    ...(duration !== undefined && {
      duration,
    }),
  },
});

return res.status(200).json({
  interview: updatedInterview,
  message: "Interview updated successfully",
});

} catch (error) {
console.error("Interview update failed:", error);
return res.status(500).json({ message: "Update failed" });
}
});

router.delete("/:id", auth, async (req: AuthRequest, res) => {
try {
const { id } = req.params;

if (typeof id !== "string") {
  return res.status(400).json({ message: "Invalid interview ID" });
}

if (!req.userId) {
  return res.status(401).json({ message: "Unauthorized" });
}

const deleted = await prisma.interview.deleteMany({
  where: {
    id,
    userId: req.userId,
  },
});

if (deleted.count === 0) {
  return res.status(404).json({ message: "Interview not found" });
}

return res.status(200).json({
  message: "Interview deleted successfully",
});

} catch (error) {
console.error("Interview deletion failed:", error);
return res.status(500).json({ message: "Delete failed" });
}
});

router.get("/:id", auth, async (req: AuthRequest, res) => {
try {
const { id } = req.params;

if (typeof id !== "string") {
  return res.status(400).json({ message: "Invalid interview ID" });
}

if (!req.userId) {
  return res.status(401).json({ message: "Unauthorized" });
}

const interview = await prisma.interview.findFirst({
  where: {
    id,
    userId: req.userId,
  },
  include: {
    questions: {
      orderBy: {
        order: "asc",
      },
    },
  },
});

if (!interview) {
  return res.status(404).json({ message: "Interview not found" });
}

const evaluatedQuestions = interview.questions.filter(
  (question) => question.score !== null
);

const skills =
  evaluatedQuestions.length > 0
    ? [
        {
          name: "Communication",
          score: Math.round(
            (evaluatedQuestions.reduce(
              (sum, question) =>
                sum + (question.communicationScore ?? 0),
              0
            ) /
              evaluatedQuestions.length) *
              10
          ),
        },
        {
          name: "Technical Knowledge",
          score: Math.round(
            (evaluatedQuestions.reduce(
              (sum, question) =>
                sum + (question.technicalKnowledgeScore ?? 0),
              0
            ) /
              evaluatedQuestions.length) *
              10
          ),
        },
        {
          name: "Problem Solving",
          score: Math.round(
            (evaluatedQuestions.reduce(
              (sum, question) =>
                sum + (question.problemSolvingScore ?? 0),
              0
            ) /
              evaluatedQuestions.length) *
              10
          ),
        },
        {
          name: "Confidence",
          score: Math.round(
            (evaluatedQuestions.reduce(
              (sum, question) =>
                sum + (question.confidenceScore ?? 0),
              0
            ) /
              evaluatedQuestions.length) *
              10
          ),
        },
      ]
    : [];

return res.status(200).json({
  interview: {
    ...interview,
    skills,
  },
});

} catch (error) {
console.error("Failed to fetch interview:", error);
return res.status(500).json({
message: "Failed to fetch interview",
});
}
});

export default router;
