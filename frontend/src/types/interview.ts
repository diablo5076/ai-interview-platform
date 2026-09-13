export type QuestionType =
  | "BEHAVIORAL"
  | "TECHNICAL"
  | "SITUATIONAL"
  | "CASE_STUDY"
  | "CODING"
  | "NUMERICAL";

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface Question {
  id: string;
  order: number;
  type: QuestionType;
  question: string;
  answer: string | null;
  score: number | null;
  feedback: string | null;
  idealAnswer: string | null;

  language: string | null;
  starterCode: string | null;
  testCases: TestCase[] | null;

  communicationScore: number | null;
  technicalKnowledgeScore: number | null;
  problemSolvingScore: number | null;
  confidenceScore: number | null;

  isAnswered: boolean;
}

interface Skill {
  name: string;
  score: number;
}

export interface Interview {
  id: string;
  title: string;
  role: string;
  level: string;
  duration: number;
  startedAt: string | null;
  createdAt: string;

  completed: boolean;
  completedAt: string | null;

  questions: Question[];
  skills: Skill[];
}