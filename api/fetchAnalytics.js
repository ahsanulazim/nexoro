import api from "@/axios/axiosInstance";

export const getAnalytics = async () => {
  const res = await api.get("/dashboard/analytics");
  return res.data;
};

export const getChart = async () => {
  const res = await api.get("/analytics/revenueChart");
  return res.data;
};
