import api from "@/lib/axios";

export const uploadResume = async (
  file: File,
  token: string
) => {
  const formData = new FormData();

  formData.append("resume", file);

  const response = await api.post(
    "/resume/upload",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getResumes = async (token: string) => {
  const response = await api.get(
    "/resume",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getResumeById = async (
  id: string,
  token: string
) => {
  const response = await api.get(
    `/resume/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};