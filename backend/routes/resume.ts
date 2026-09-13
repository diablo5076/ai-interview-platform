import { Router } from "express";
import fs from "fs";
import { PDFParse } from "pdf-parse";

import { prisma } from "../lib/prisma.js";
import { auth, type AuthRequest } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { groq } from "../ai/groq.js";

const router = Router();

router.post(
  "/upload",
  auth,
  upload.single("resume"),
  async (req: AuthRequest, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Resume file is required",
        });
      }

      const pdfBuffer = fs.readFileSync(req.file.path);

      const parser = new PDFParse({
        data: pdfBuffer,
      });

      const pdfData = await parser.getText();

      await parser.destroy();

      const extractedText = pdfData.text;

      if (!extractedText.trim()) {
        return res.status(400).json({
          message: "Could not extract text from the resume",
        });
      }

      const prompt = `
You are an expert ATS (Applicant Tracking System) resume reviewer.

Evaluate the resume as if it were being screened for a Software Engineer or Full Stack Developer role.

Rules:
- ATS score must be an INTEGER between 0 and 100.
- 90-100 = Excellent
- 80-89 = Very Good
- 70-79 = Good
- 60-69 = Average
- Below 60 = Needs Significant Improvement

Be realistic and consistent.

Analyze the following resume and return ONLY valid JSON.

Resume:
${extractedText}

Return in this format:

{
  "atsScore": 85,
  "strengths": [
    "...",
    "...",
    "..."
  ],
  "weaknesses": [
    "...",
    "...",
    "..."
  ],
  "suggestions": [
    "...",
    "...",
    "..."
  ]
}
`;

      const completion =
        await groq.chat.completions.create({
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });

      const response =
        completion.choices[0]?.message.content;

      if (!response) {
        return res.status(500).json({
          message: "AI returned an empty response",
        });
      }

      const cleaned = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let parsed: unknown;

      try {
        parsed = JSON.parse(cleaned);
      } catch {
        return res.status(500).json({
          message: "Invalid JSON returned by AI",
        });
      }

      if (
        typeof parsed !== "object" ||
        parsed === null ||
        !("atsScore" in parsed) ||
        !("strengths" in parsed) ||
        !("weaknesses" in parsed) ||
        !("suggestions" in parsed)
      ) {
        return res.status(500).json({
          message: "AI returned invalid ATS analysis",
        });
      }

      const analysis = parsed as {
        atsScore: unknown;
        strengths: unknown;
        weaknesses: unknown;
        suggestions: unknown;
      };

      if (
        typeof analysis.atsScore !== "number" ||
        !Number.isFinite(analysis.atsScore) ||
        !Array.isArray(analysis.strengths) ||
        !Array.isArray(analysis.weaknesses) ||
        !Array.isArray(analysis.suggestions) ||
        analysis.strengths.some(
          (item) => typeof item !== "string"
        ) ||
        analysis.weaknesses.some(
          (item) => typeof item !== "string"
        ) ||
        analysis.suggestions.some(
          (item) => typeof item !== "string"
        )
      ) {
        return res.status(500).json({
          message: "AI returned invalid ATS analysis",
        });
      }

      const atsScore = Math.max(
        0,
        Math.min(100, Math.round(analysis.atsScore))
      );

      const strengths = analysis.strengths.map(
        (item) => item.trim()
      );

      const weaknesses = analysis.weaknesses.map(
        (item) => item.trim()
      );

      const suggestions = analysis.suggestions.map(
        (item) => item.trim()
      );

      const resume = await prisma.resume.create({
        data: {
          title: req.file.originalname,
          fileName: req.file.filename,
          fileUrl: req.file.path,
          extractedText,

          atsScore,
          strengths: JSON.stringify(strengths),
          weaknesses: JSON.stringify(weaknesses),
          suggestions: JSON.stringify(suggestions),

          userId: req.userId,
        },
      });

      return res.status(201).json({
        message: "Resume uploaded successfully",
        resume: {
          ...resume,
          strengths,
          weaknesses,
          suggestions,
        },
      });
    } catch (error) {
      console.error("Resume upload failed:", error);

      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Resume upload failed",
      });
    }
  }
);

router.get(
  "/",
  auth,
  async (req: AuthRequest, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const resumes = await prisma.resume.findMany({
        where: {
          userId: req.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(
        resumes.map((resume) => ({
          ...resume,
          strengths: resume.strengths
            ? JSON.parse(resume.strengths)
            : [],
          weaknesses: resume.weaknesses
            ? JSON.parse(resume.weaknesses)
            : [],
          suggestions: resume.suggestions
            ? JSON.parse(resume.suggestions)
            : [],
        }))
      );
    } catch (error) {
      console.error(
        "Failed to fetch resumes:",
        error
      );

      return res.status(500).json({
        message: "Failed to fetch resumes.",
      });
    }
  }
);

router.get(
  "/:id",
  auth,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;

      if (typeof id !== "string") {
        return res.status(400).json({
          message: "Invalid resume ID",
        });
      }

      if (!req.userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const resume = await prisma.resume.findFirst({
        where: {
          id,
          userId: req.userId,
        },
      });

      if (!resume) {
        return res.status(404).json({
          message: "Resume not found.",
        });
      }

      return res.status(200).json({
        ...resume,
        strengths: resume.strengths
          ? JSON.parse(resume.strengths)
          : [],
        weaknesses: resume.weaknesses
          ? JSON.parse(resume.weaknesses)
          : [],
        suggestions: resume.suggestions
          ? JSON.parse(resume.suggestions)
          : [],
      });
    } catch (error) {
      console.error(
        "Failed to fetch resume:",
        error
      );

      return res.status(500).json({
        message: "Failed to fetch resume.",
      });
    }
  }
);

export default router;