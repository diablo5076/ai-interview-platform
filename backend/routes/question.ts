import { Router } from "express";
import { prisma } from "../lib/prisma";
import { auth, AuthRequest } from "../middleware/auth";
const router = Router();

router.post("/:interviewId", auth, async (req: AuthRequest, res) => {
  try {
    const { question } = req.body;

    const created = await prisma.question.create({
      data: {
        question,
        interviewId: req.params.interviewId,
      },
    });
    res.json(created);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Question creation failed",
    });
  }
});

router.get("/:interviewId", auth, async (req: AuthRequest, res) => {
  try {
    const questions = await prisma.question.findMany({
      where: {
        interviewId: req.params.interviewId,
      },
    });

    res.json(questions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch questions",
    });
  }
});

router.post("/:questionId/answer", auth, async (req: AuthRequest, res) => {
  try {
    
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({
        message: "Answer is required"
      });
    }

    const question = await prisma.question.findUnique({
      where: {
        id: req.params.questionId
      }
    });

    if (!question) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    const updatedQuestion = await prisma.question.update({
      where: {
        id: req.params.questionId
      },
      data: {
        answer
      }
    });

    return res.status(200).json({
      message: "Answer submitted successfully",
      question: updatedQuestion
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to submit answer"
    });
  }
});

export default router;
