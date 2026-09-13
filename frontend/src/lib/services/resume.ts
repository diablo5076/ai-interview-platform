import axios from "axios";

export const uploadResume = async(
  file: File,
  token: string
) => {
  const formData = new FormData();

  formData.append("resume", file);

  const response = await axios.post(
    "http://localhost:5000/api/resume/upload",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export const getResumes = async (token: string) => {
  const response = await axios.get(
    "http://localhost:5000/api/resume",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export const getResumeById = async (
  id: string,
  token: string
) => {
  const response = await axios.get(
    `http://localhost:5000/api/resume/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};