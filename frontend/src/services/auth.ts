import api from "@/lib/axios";

interface SignupData {
  email: string;
  password: string;
}

interface LoginData{
  email: string;
  password: string;
}

export const signup = async (data: SignupData) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};