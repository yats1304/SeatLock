import api from "@/lib/axios";

export interface registerPayload {
  name: string;
  email: string;
  password: string;
}

export interface loginPayload {
  email: string;
  password: string;
}

export const registerUser = async (payload: registerPayload) => {
  const { data } = await api.post("/auth/register", payload);

  return data;
};

export const loginUser = async (payload: loginPayload) => {
  const { data } = await api.post("/auth/login", payload);

  return data;
};

export const getProfile = async () => {
  const { data } = await api.get("/auth/me");

  return data;
};

export const logoutUser = async () => {
  const { data } = await api.post("/auth/logout");

  return data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const { data } = await api.post("auth/change-password", {
    currentPassword,
    newPassword,
  });

  return data;
};
