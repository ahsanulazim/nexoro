import api from "@/axios/axiosInstance";

export const getAnalytics = async () => {
  const res = await api.get("/dashboard/analytics");
  return res.data;
};

export const getChart = async (range = "1month") => {
  const res = await api.get("/analytics/revenueChart", {
    params: { range },
  });
  return res.data;
};

export const getDashboardStats = async () => {
  const res = await api.get("/dashboard/stats");
  return res.data?.data;
};

export const getRecentOrders = async (limit = 6) => {
  const res = await api.get("/dashboard/recent-orders", {
    params: {
      limit,
    },
  });
  return res.data?.orders;
};

export const getRecentProjects = async (limit = 6) => {
  const res = await api.get("/dashboard/recent-projects", {
    params: {
      limit,
    },
  });
  return res.data?.projects;
};
