import { Router } from "express";

import { prisma } from "../lib/prisma.js";
import { auth, type AuthRequest } from "../middleware/auth.js";

const router = Router();

const QUESTION_TYPES = [
"BEHAVIORAL",
"TECHNICAL",
"SITUATIONAL",
"CASE_STUDY",
"CODING",
"NUMERICAL",
] as const;

type QuestionType = (typeof QUESTION_TYPES)[number];

router.post("/:interviewId", auth, async (req: AuthRequest, res) => {
try {
const { interviewId } = req.params;

if (typeof interviewId !== "string") {
  return res.status(400).json({
    message: "Invalid interview ID",
  });
}

if (!req.userId) {
  return res.status(401).json({
    message: "Unauthorized",
  });
}

const {
  question,
  type,
  language,
  starterCode,
  testCases,
} = req.body;

if (typeof question !== "string" || !question.trim()) {
  return res.status(400).json({
    message: "Question is required",
  });
}

const questionType: QuestionType = type ?? "TECHNICAL";

if (!QUESTION_TYPES.includes(questionType)) {
  return res.status(400).json({
    message: "Invalid question type",
  });
}

if (
  questionType === "CODING" &&
  typeof language !== "string"
) {
  return res.status(400).json({
    message: "Language is required for coding questions",
  });
}

if (
  questionType === "CODING" &&
  typeof starterCode !== "string"
) {
  return res.status(400).json({
    message: "Starter code is required for coding questions",
  });
}

if (
  questionType === "CODING" &&
  !Array.isArray(testCases)
) {
  return res.status(400).json({
    message: "Test cases are required for coding questions",
  });
}

const interview = await prisma.interview.findFirst({
  where: {
    id: interviewId,
    userId: req.userId,
  },
  select: {
    id: true,
    completed: true,
    startedAt: true,
  },
});

if (!interview) {
  return res.status(404).json({
    message: "Interview not found",
  });
}

if (interview.completed) {
  return res.status(400).json({
    message: "Cannot add questions to a completed interview",
  });
}

if (interview.startedAt) {
  return res.status(400).json({
    message: "Cannot add questions after the interview has started",
  });
}

const count = await prisma.question.count({
  where: {
    interviewId,
  },
});

const created = await prisma.question.create({
  data: {
    question: question.trim(),
    order: count,
    type: questionType,
    language:
      questionType === "CODING"
        ? language.trim()
        : null,
    starterCode:
      questionType === "CODING"
        ? starterCode
        : null,
    testCases:
      questionType === "CODING"
        ? testCases
        : null,
    interviewId,
  },
});

return res.status(201).json(created);

} catch (error) {
console.error("Question creation failed:", error);

return res.status(500).json({
  message: "Question creation failed",
});

}
});

router.get("/:interviewId", auth, async (req: AuthRequest, res) => {
try {
const { interviewId } = req.params;

if (typeof interviewId !== "string") {
  return res.status(400).json({
    message: "Invalid interview ID",
  });
}

if (!req.userId) {
  return res.status(401).json({
    message: "Unauthorized",
  });
}

const interview = await prisma.interview.findFirst({
  where: {
    id: interviewId,
    userId: req.userId,
  },
  select: {
    id: true,
  },
});

if (!interview) {
  return res.status(404).json({
    message: "Interview not found",
  });
}

const questions = await prisma.question.findMany({
  where: {
    interviewId,
  },
  orderBy: {
    order: "asc",
  },
});

return res.status(200).json(questions);

} catch (error) {
console.error("Failed to fetch questions:", error);

return res.status(500).json({
  message: "Failed to fetch questions",
});

}
});

router.post("/:questionId/answer", auth, async (req: AuthRequest, res) => {
try {
const { questionId } = req.params;

if (typeof questionId !== "string") {
  return res.status(400).json({
    message: "Invalid question ID",
  });
}

if (!req.userId) {
  return res.status(401).json({
    message: "Unauthorized",
  });
}

const { answer } = req.body;

if (typeof answer !== "string" || !answer.trim()) {
  return res.status(400).json({
    message: "Answer is required",
  });
}

const question = await prisma.question.findFirst({
  where: {
    id: questionId,
    interview: {
      userId: req.userId,
    },
  },
  include: {
    interview: {
      select: {
        id: true,
        completed: true,
        startedAt: true,
        duration: true,
      },
    },
  },
});

if (!question) {
  return res.status(404).json({
    message: "Question not found",
  });
}

if (question.interview.completed) {
  return res.status(400).json({
    message: "Interview has already been completed",
  });
}

if (!question.interview.startedAt) {
  return res.status(400).json({
    message: "Interview has not been started",
  });
}

if (question.interview.duration == null) {
  return res.status(400).json({
    message: "Interview duration is not configured",
  });
}

const elapsedSeconds = Math.floor(
  (Date.now() - question.interview.startedAt.getTime()) / 1000
);

const durationSeconds = question.interview.duration * 60;

if (elapsedSeconds >= durationSeconds) {
  await prisma.interview.update({
    where: {
      id: question.interview.id,
    },
    data: {
      completed: true,
      completedAt: new Date(),
    },
  });

  return res.status(400).json({
    message: "Interview time has expired",
  });
}

const updatedQuestion = await prisma.question.update({
  where: {
    id: questionId,
  },
  data: {
    answer: answer.trim(),
    isAnswered: true,
  },
});

return res.status(200).json({
  message: "Answer submitted successfully",
  question: updatedQuestion,
  interviewCompleted: false,
});

} catch (error) {
console.error("Failed to submit answer:", error);

return res.status(500).json({
  message: "Failed to submit answer",
});

}
});

export default router;
