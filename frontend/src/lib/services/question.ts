import api from "@/lib/axios";

export const getQuestions = async (interviewId: string) => {
  const response = await api.get(
    `/question/${interviewId}`
  );

  return response.data;
};

export const submitAnswer = async (
  questionId: string,
  answer: string
) => {
  const response = await api.post(
    `/question/${questionId}/answer`,
    {
      answer,
    }
  );

  return response.data;
};