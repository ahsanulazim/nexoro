import api from "@/axios/axiosInstance";

export const getAllProjects = async () => {
  const res = await api.get("/projects/get");

  return res.data;
};
