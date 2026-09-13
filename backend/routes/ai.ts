import { Router } from "express";
import { Prisma } from "@prisma/client";
import { groq } from "../ai/groq.js";
import { prisma } from "../lib/prisma.js";
import { auth, type AuthRequest } from "../middleware/auth.js";

const router = Router();

const INTERVIEW_CONFIG = {
  15: {
    questions: 5,
    style: "quick screening interview with concise, high-value questions",
  },
  30: {
    questions: 8,
    style: "standard interview covering core knowledge and practical ability",
  },
  60: {
    questions: 12,
    style: "comprehensive interview covering fundamentals, practical ability, problem-solving, and technical depth",
  },
  90: {
    questions: 16,
    style: "deep-dive interview with technical depth, scenarios, problem-solving, and real-world decision-making",
  },
  180: {
    questions: 25,
    style: "extensive comprehensive interview covering multiple competency areas with substantial technical and practical depth",
  },
} as const;

type SupportedDuration = keyof typeof INTERVIEW_CONFIG;

type QuestionType =
  | "BEHAVIORAL"
  | "TECHNICAL"
  | "SITUATIONAL"
  | "CASE_STUDY"
  | "CODING"
  | "NUMERICAL";

type GeneratedQuestion = {
  type: QuestionType;
  question: string;
  language: string | null;
  starterCode: string | null;
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }> | null;
};

const QUESTION_TYPES: QuestionType[] = [
  "BEHAVIORAL",
  "TECHNICAL",
  "SITUATIONAL",
  "CASE_STUDY",
  "CODING",
  "NUMERICAL",
];

function getQuestionCount(duration: number): number {
  if (duration in INTERVIEW_CONFIG) {
    return INTERVIEW_CONFIG[duration as SupportedDuration].questions;
  }

  return INTERVIEW_CONFIG[30].questions;
}

function getInterviewStyle(duration: number): string {
  if (duration in INTERVIEW_CONFIG) {
    return INTERVIEW_CONFIG[duration as SupportedDuration].style;
  }

  return INTERVIEW_CONFIG[30].style;
}

function getAnswerGuidance(duration: number): string {
  if (duration === 15) {
    return `
- Keep questions short and focused.
- Answers should generally be concise.
- Prioritize high-signal questions.
- Avoid multi-part questions.
`;
  }

  if (duration === 30) {
    return `
- Questions may require short to medium-length answers.
- Include a mixture of fundamentals and practical scenarios.
- Keep questions focused enough for a live interview.
`;
  }

  if (duration === 60) {
    return `
- Questions may require medium-length answers.
- Include meaningful technical depth.
- Include practical and scenario-based questions.
- Allow enough time for the candidate to explain their reasoning.
`;
  }

  if (duration === 90) {
    return `
- Questions can explore technical depth and real-world scenarios.
- Include debugging, architecture, trade-offs, or decision-making where relevant.
- Questions may require detailed answers but should remain focused.
`;
  }

  return `
- This is an extended interview.
- Questions may explore substantial technical depth.
- Include advanced scenarios, architecture, trade-offs, problem-solving, practical experience, and role-specific expertise where appropriate.
- Questions can require detailed answers.
- Avoid artificially making questions long simply because the interview is long.
`;
}

function isGeneratedQuestion(value: unknown): value is GeneratedQuestion {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const question = value as Record<string, unknown>;

  if (
    typeof question.type !== "string" ||
    !QUESTION_TYPES.includes(question.type as QuestionType)
  ) {
    return false;
  }

  if (
    typeof question.question !== "string" ||
    !question.question.trim()
  ) {
    return false;
  }

  if (
    question.language !== null &&
    typeof question.language !== "string"
  ) {
    return false;
  }

  if (
    question.starterCode !== null &&
    typeof question.starterCode !== "string"
  ) {
    return false;
  }

  if (
    question.testCases !== null &&
    !Array.isArray(question.testCases)
  ) {
    return false;
  }

  if (Array.isArray(question.testCases)) {
    for (const testCase of question.testCases) {
      if (
        typeof testCase !== "object" ||
        testCase === null ||
        typeof (testCase as Record<string, unknown>).input !== "string" ||
        typeof (testCase as Record<string, unknown>).expectedOutput !== "string"
      ) {
        return false;
      }
    }
  }

  return true;
}

function normalizeGeneratedQuestion(
  question: GeneratedQuestion
): GeneratedQuestion {
  if (question.type !== "CODING") {
    return {
      type: question.type,
      question: question.question.trim(),
      language: null,
      starterCode: null,
      testCases: null,
    };
  }

  return {
    type: "CODING",
    question: question.question.trim(),
    language: question.language?.trim() || "javascript",
    starterCode: question.starterCode ?? "",
    testCases: question.testCases ?? [],
  };
}

function cleanJsonResponse(response: string): string {
  return response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

function normalizeScore(value: number): number {
  return Math.max(0, Math.min(10, Math.round(value)));
}

router.post("/generate/:interviewId", auth, async (req: AuthRequest, res) => {
  try {
    const { interviewId } = req.params;

    if (typeof interviewId !== "string") {
      return res.status(400).json({ message: "Invalid interview ID" });
    }

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        userId: req.userId,
      },
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.completed) {
      return res.status(400).json({
        message: "Cannot generate questions for a completed interview",
      });
    }

    if (interview.startedAt) {
      return res.status(400).json({
        message: "Cannot generate questions after the interview has started",
      });
    }

    const existingQuestions = await prisma.question.count({
      where: {
        interviewId: interview.id,
      },
    });

    if (existingQuestions > 0) {
      return res.status(400).json({
        message: "Questions already generated for this interview",
      });
    }

    const duration = interview.duration;

    if (
      duration === null ||
      ![15, 30, 60, 90, 180].includes(duration)
    ) {
      return res.status(400).json({
        message:
          "Invalid interview duration. Duration must be 15, 30, 60, 90, or 180 minutes.",
      });
    }

    const questionCount = getQuestionCount(duration);
    const interviewStyle = getInterviewStyle(duration);
    const averageMinutesPerQuestion = duration / questionCount;
    const answerGuidance = getAnswerGuidance(duration);

    const prompt = `
You are an experienced professional interviewer conducting a structured hiring interview.

Interview Details:

- Role: ${interview.role ?? "Not specified"}
- Experience Level: ${interview.level ?? "Not specified"}
- Interview Title: ${interview.title}
- Interview Duration: ${duration} minutes
- Number of Questions: ${questionCount}
- Interview Style: ${interviewStyle}
- Approximate Time Available Per Question: ${averageMinutesPerQuestion.toFixed(1)} minutes

Generate EXACTLY ${questionCount} professional interview questions.

The complete interview must realistically fit within ${duration} minutes.

The ${duration}-minute duration applies to the ENTIRE interview, not to each individual question.

${answerGuidance}

QUESTION TYPES

Use these question types:

1. BEHAVIORAL
Use for past experience, teamwork, leadership, communication, conflict, ownership, failures, achievements, and workplace behavior.

2. TECHNICAL
Use for technical knowledge, concepts, technologies, frameworks, tools, implementation decisions, debugging, performance, architecture, security, testing, and engineering practices.

3. SITUATIONAL
Use hypothetical workplace or role-specific situations where the candidate must explain what they would do.

4. CASE_STUDY
Use realistic business, product, engineering, analytical, or role-specific problems that require structured reasoning.

5. CODING
Use ONLY when coding/programming ability is genuinely relevant to the role.

6. NUMERICAL
Use calculations, quantitative reasoning, data interpretation, estimation, metrics, or numerical analysis when relevant to the role.

ROLE-BASED QUESTION RULE

Do NOT force coding questions into every interview.

For programming, software engineering, backend, frontend, full-stack, data engineering, machine learning, DevOps, automation, or other strongly technical programming roles, include appropriate CODING questions.

For non-programming roles such as HR, sales, marketing, operations, finance, design, customer support, recruitment, or similar roles, do NOT generate CODING questions unless the role explicitly requires programming.

For technical roles, use a balanced combination of TECHNICAL, CODING, BEHAVIORAL, SITUATIONAL, CASE_STUDY, and NUMERICAL where appropriate.

For non-technical roles, prioritize BEHAVIORAL, SITUATIONAL, CASE_STUDY, NUMERICAL, and role-specific TECHNICAL questions.

CODING QUESTION RULES

For every CODING question:

- language must contain the programming language.
- starterCode must contain usable starter code.
- testCases must contain between 2 and 5 test cases.
- Every test case must contain input and expectedOutput as strings.
- Coding problems must be appropriate for the candidate's experience level.
- Coding problems must be realistically solvable within the available interview time.
- Do not require external libraries unless necessary.
- Do not require internet access.
- Do not provide the solution.
- Do not put the solution inside starterCode.
- Use JavaScript for frontend/full-stack JavaScript roles unless another language is clearly more appropriate.
- Use Python for Python/data/ML roles unless another language is clearly more appropriate.

NON-CODING QUESTION RULES

For every non-CODING question:

- language must be null.
- starterCode must be null.
- testCases must be null.

TIME MANAGEMENT RULES

1. Generate exactly ${questionCount} questions.
2. Keep the total interview realistically completable within ${duration} minutes.
3. Do not create unnecessarily long questions.
4. Do not include multiple unrelated questions inside one question.
5. Do not add follow-up questions.
6. Avoid questions requiring excessively long explanations unless the interview duration supports them.
7. Questions should be appropriate for a live interviewer-candidate conversation.
8. The candidate should have enough time to understand and answer every question.
9. Longer interviews should increase depth and coverage rather than simply making questions verbose.
10. Shorter interviews should prioritize the highest-value competencies.

QUESTION DESIGN RULES

1. Every question must assess a DIFFERENT skill, competency, knowledge area, or capability relevant to the role.
2. Do NOT repeat, rephrase, or overlap topics.
3. Questions should progress from basic to advanced difficulty where appropriate.
4. The interview should feel realistic, as if conducted by an experienced interviewer.
5. Adapt every question to the specified role.
6. Adapt every question to the specified experience level.
7. Avoid vague or generic questions unless genuinely useful.
8. Avoid yes/no questions.
9. Ask concise, clear, interview-quality questions.
10. Do not number the questions.
11. Do not include answers.
12. Do not include explanations.
13. Do not include hints.
14. Do not include grading criteria.

TECHNICAL ROLE GUIDANCE

If the role is technical, consider relevant areas such as:

- Core concepts
- Practical implementation
- Coding
- Debugging
- Performance
- Architecture
- Security
- Testing
- Optimization
- Real-world engineering scenarios
- Trade-offs
- Technologies and frameworks relevant to the role

Do not force every category into every interview.

NON-TECHNICAL ROLE GUIDANCE

If the role is non-technical, prioritize relevant areas such as:

- Behavioral questions
- Situational judgment
- Communication
- Problem-solving
- Analytical thinking
- Decision-making
- Role-specific knowledge
- Real-world workplace scenarios

QUALITY RULES

- Every question must be meaningfully different.
- No two questions should test the same concept.
- Prefer scenario-based questions over simple definitions when appropriate.
- Questions should sound like questions asked by an experienced interviewer.
- Avoid artificial or overly academic wording.
- Avoid trivia unless it is genuinely relevant to the role.
- Do not make all questions equally difficult.
- The final question set must provide useful coverage of the candidate within the available time.

IMPORTANT OUTPUT RULES

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT wrap the JSON in code fences.

Do NOT include any explanation before or after the JSON.

Return exactly this structure:

{
  "questions": [
    {
      "type": "TECHNICAL",
      "question": "Question text",
      "language": null,
      "starterCode": null,
      "testCases": null
    },
    {
      "type": "CODING",
      "question": "Question text",
      "language": "javascript",
      "starterCode": "function solution() {\\n  \\n}",
      "testCases": [
        {
          "input": "example input",
          "expectedOutput": "example output"
        },
        {
          "input": "example input",
          "expectedOutput": "example output"
        }
      ]
    }
  ]
}

The array MUST contain exactly ${questionCount} questions.
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
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

    const cleaned = cleanJsonResponse(response);

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
      !("questions" in parsed) ||
      !Array.isArray(parsed.questions)
    ) {
      return res.status(500).json({
        message: "AI returned an invalid question list",
      });
    }

    const questions = parsed.questions;

    if (
      questions.length !== questionCount ||
      questions.some((question) => !isGeneratedQuestion(question))
    ) {
      return res.status(500).json({
        message: `AI must return exactly ${questionCount} valid questions`,
      });
    }

    const normalizedQuestions = questions.map(normalizeGeneratedQuestion);

    const hasInvalidQuestion = normalizedQuestions.some((question) => {
      if (question.type !== "CODING") {
        return false;
      }

      return (
        !question.language ||
        !question.starterCode ||
        !question.testCases ||
        question.testCases.length < 2 ||
        question.testCases.length > 5
      );
    });

    if (hasInvalidQuestion) {
      return res.status(500).json({
        message: "AI returned an invalid coding question",
      });
    }

    await prisma.question.createMany({
      data: normalizedQuestions.map((question, index) => ({
        order: index,
        type: question.type,
        question: question.question,
        language: question.language,
        starterCode: question.starterCode,
        testCases: question.testCases === null
            ? Prisma.JsonNull
            : question.testCases,
        interviewId: interview.id,
      })),
    });

    const savedQuestions = await prisma.question.findMany({
      where: {
        interviewId: interview.id,
      },
      orderBy: {
        order: "asc",
      },
    });

    return res.status(201).json({
      message: "Questions generated successfully",
      duration,
      questionCount,
      questions: savedQuestions,
    });
  } catch (error) {
    console.error("Question generation failed:", error);

    return res.status(500).json({
      message: "Question generation failed",
    });
  }
});

router.post("/evaluate/:questionId", auth, async (req: AuthRequest, res) => {
  try {
    const { questionId } = req.params;

    if (typeof questionId !== "string") {
      return res.status(400).json({ message: "Invalid question ID" });
    }

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
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
            title: true,
            role: true,
            level: true,
          },
        },
      },
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.interview.role === null && question.interview.level === null) {
      return res.status(400).json({
        message: "Interview role and experience level are not configured",
      });
    }

    if (!question.answer?.trim()) {
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

Interview Title:
${question.interview.title}

Role:
${question.interview.role ?? "Not specified"}

Experience Level:
${question.interview.level ?? "Not specified"}

Question Type:
${question.type}

Question:
${question.question}

Candidate Answer:
${question.answer}

You are an experienced professional interviewer.

Evaluate the answer fairly according to the question, the candidate's role, and the expected level of experience.

For CODING questions, evaluate the candidate's approach, correctness, algorithmic reasoning, code quality, edge-case awareness, and technical understanding.

For non-CODING questions, evaluate the answer according to the competency being tested.

IMPORTANT:

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT wrap the JSON in code fences.

Do NOT add any explanation outside the JSON.

Score must be an integer from 0 to 10.

Return this exact structure:

{
  "score": 8,
  "feedback": "Detailed explanation of the candidate's answer.",
  "idealAnswer": "A strong example of what an ideal answer could contain.",
  "skills": {
    "communication": 8,
    "technicalKnowledge": 9,
    "problemSolving": 7,
    "confidence": 8
  }
}

Evaluation Rules:

- Overall score must be an integer from 0 to 10.
- Every skill score must be an integer from 0 to 10.
- Communication measures clarity, organization, and explanation.
- Technical Knowledge measures correctness, relevance, and depth.
- Problem Solving measures reasoning, structure, and approach.
- Confidence measures completeness, decisiveness, and ability to communicate the answer clearly.
- For coding questions, technical correctness and problem-solving are especially important.
- Do not give a high score simply because the answer is long.
- Do not penalize a concise answer if it is accurate and complete.
- Evaluate the answer based on what the question actually asks.
- Do not invent facts about the candidate.
- Feedback should identify strengths and specific areas for improvement.
- The ideal answer should demonstrate the key points a strong candidate should cover.
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
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

    const cleaned = cleanJsonResponse(response);

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
      !("score" in parsed) ||
      !("feedback" in parsed) ||
      !("idealAnswer" in parsed) ||
      !("skills" in parsed)
    ) {
      return res.status(500).json({
        message: "AI returned an invalid evaluation",
      });
    }

    const evaluation = parsed as {
      score: unknown;
      feedback: unknown;
      idealAnswer: unknown;
      skills: {
        communication?: unknown;
        technicalKnowledge?: unknown;
        problemSolving?: unknown;
        confidence?: unknown;
      };
    };

    const { score, feedback, idealAnswer, skills } = evaluation;

    if (
      typeof score !== "number" ||
      typeof feedback !== "string" ||
      typeof idealAnswer !== "string" ||
      typeof skills !== "object" ||
      skills === null ||
      typeof skills.communication !== "number" ||
      typeof skills.technicalKnowledge !== "number" ||
      typeof skills.problemSolving !== "number" ||
      typeof skills.confidence !== "number"
    ) {
      return res.status(500).json({
        message: "AI returned an invalid evaluation",
      });
    }

    const normalizedScore = normalizeScore(score);

    const normalizedSkills = {
      communication: normalizeScore(skills.communication),
      technicalKnowledge: normalizeScore(skills.technicalKnowledge),
      problemSolving: normalizeScore(skills.problemSolving),
      confidence: normalizeScore(skills.confidence),
    };

    const updatedQuestion = await prisma.question.update({
      where: {
        id: question.id,
      },
      data: {
        score: normalizedScore,
        feedback,
        idealAnswer,
        communicationScore: normalizedSkills.communication,
        technicalKnowledgeScore: normalizedSkills.technicalKnowledge,
        problemSolvingScore: normalizedSkills.problemSolving,
        confidenceScore: normalizedSkills.confidence,
      },
    });

    return res.status(200).json({
      message: "Answer evaluated successfully",
      evaluation: {
        score: normalizedScore,
        feedback,
        idealAnswer,
        skills: normalizedSkills,
      },
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Evaluation failed:", error);

    return res.status(500).json({
      message: "Evaluation failed",
    });
  }
});

export default router;