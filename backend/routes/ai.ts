import { Router } from "express";
import { groq } from "../ai/groq";
import { prisma } from "../lib/prisma";
import { auth, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/generate/:interviewId", auth, async (req: AuthRequest, res) => {
  try {
    const interview = await prisma.interview.findUnique({
      where: {
        id: req.params.interviewId,
      },
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    const existingQuestions = await prisma.question.count({
      where: {
        interviewId: interview.id,
      },
    });

    if (existingQuestions > 0) {
      return res.status(400).json({
        message: "Question already generated for this interview",
      });
    }

    const prompt = `
      Generate exactly 10 technical interview questions.

      Role:${interview.role}

      Level:${interview.level}

      Interview Title:${interview.title}

      Duration:${interview.duration} minutes

      IMPORTANT:
      Return ONLY valid JSON.
      Do NOT use markdown.
      Do NOT wrap the JSON in \`\`\`.
      Do NOT add any explanation.

      Format:

      {
        "questions": [
          "Question 1",
          "Question 2",
          "Question 3"
        ]
      }`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const response = completion.choices[0]?.message.content;

    if (!response) {
      return res.status(500).json({
        message: "AI returned an empty response",
      });
    }

    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed: { questions: string[] };

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({
        message: "Invalid JSON returned by AI",
      });
    }

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      return res.status(500).json({
        message: "AI returned an invalid question list",
      });
    }

    await prisma.question.createMany({
      data: parsed.questions.map((question: string) => ({
        question,
        interviewId: interview.id,
      })),
    });

    const savedQuestions = await prisma.question.findMany({
      where: {
        interviewId: interview.id,
      },
    });

    return res.status(201).json({
      message: "Question generated successfully",
      questions: savedQuestions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Question generation failed",
    });
  }
});

router.post("/evaluate/:questionId", auth, async (req: AuthRequest, res) => {
  try {
    const question = await prisma.question.findUnique({
      where: {
        id: req.params.questionId,
      },
    });

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    if (!question.answer) {
      return res.status(400).json({
        message: "Answer not submitted yet",
      });
    }

    if (question.score !== null) {
      return res.status(409).json({
        message: "Question has already been evaluated",
      });
    }

    const prompt = `
      Evaluate the following interview answer.

      Question: ${question.question}

      Candidate Answer: ${question.answer}

      You are an experienced technical interviewer.

      IMPORTANT:
      Return ONLY valid JSON.
      Do NOT use markdown.
      Do NOT wrap the JSON in \`\`\`.
      Do NOT add any explanation.

      Score should be an integer from 0 to 10.

      Format:

      {
        "score": 8,
        "feedback": "Detailed explanation of the answer.",
        "idealAnswer": "Write the ideal answer here."
      }
      `;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const response = completion.choices[0]?.message.content;

    if (!response) {
      return res.status(500).json({
        message: "AI returned an empty response",
      });
    }

    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed: {
      score: number;
      feedback: string;
      idealAnswer: string;
    };

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({
        message: "Invalid JSON returned by AI",
      });
    }

    if (
      typeof parsed.score !== "number" ||
      typeof parsed.feedback !== "string" ||
      typeof parsed.idealAnswer !== "string"
    ) {
      return res.status(500).json({
        message: "AI returned an invalid evaluation",
      });
    }

    parsed.score = Math.max(0, Math.min(10, parsed.score));
    
    const updatedQuestion = await prisma.question.update({
      where: {
        id: question.id,
      },
      data: {
        score: parsed.score,
        feedback: parsed.feedback,
        idealAnswer: parsed.idealAnswer,
      },
    });

    return res.status(200).json({
      message: "Answer evaluated successfully",
      evaluation: {
        score: parsed.score,
        feedback: parsed.feedback,
        idealAnswer: parsed.idealAnswer,
      },

      question: updatedQuestion,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Evaluation failed",
    });
  }
});

export default router;
