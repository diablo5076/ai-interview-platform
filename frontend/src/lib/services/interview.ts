import api from "@/lib/axios";
import type { Interview } from "@/types/interview";

interface InterviewResponse {
  interview: Interview;
}

interface StartInterviewResponse {
  startedAt: string;
  interview?: Interview;
}

export const createInterview = async (data: {
  title: string;
  role: string;
  level: string;
  duration: number;
}) => {
  const response = await api.post<InterviewResponse>(
    "/interview/create",
    data
  );

  return response.data;
};

export const updateInterview = async (
  id: string,
  data: {
    title: string;
    role: string;
    level: string;
    duration: number;
  }
) => {
  const response = await api.put<InterviewResponse>(
    `/interview/${id}`,
    data
  );

  return response.data;
};

export const getMyInterviews = async (): Promise<{
  interviews: Interview[];
}> => {
  const response = await api.get<{ interviews: Interview[] }>(
    "/interview/my"
  );

  return response.data;
};

export const getInterview = async (
  id: string
): Promise<InterviewResponse> => {
  const response = await api.get<InterviewResponse>(
    `/interview/${id}`
  );

  return response.data;
};

export const generateQuestions = async (
  interviewId: string
) => {
  const response = await api.post<InterviewResponse>(
    `/ai/generate/${interviewId}`
  );

  return response.data;
};

export const evaluateQuestion = async (
  questionId: string
) => {
  const response = await api.post(
    `/ai/evaluate/${questionId}`
  );

  return response.data;
};

export const startInterview = async (
  id: string
): Promise<StartInterviewResponse> => {
  const response = await api.post<StartInterviewResponse>(
    `/interview/${id}/start`
  );

  return response.data;
};

export const finishInterview = async (
  id: string
): Promise<InterviewResponse> => {
  const response = await api.post<InterviewResponse>(
    `/interview/${id}/finish`
  );

  return response.data;
};

export const deleteInterview = async (id: string) => {
  const response = await api.delete(`/interview/${id}`);

  return response.data;
};