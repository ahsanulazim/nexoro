import api from "@/axios/axiosInstance";

export const getAnalytics = async () => {
  const res = await api.get("/dashboard/analytics");
  return res.data;
};
