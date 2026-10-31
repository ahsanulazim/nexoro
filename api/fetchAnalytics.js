import api from "@/axios/axiosInstance";

export const getAnalytics = async () => {
  const res = await api.get("/dashboard/analytics");
  return res.data;
};

export const getChart = async (range = "1month", startDate = null, endDate = null) => {
  const params = {};
  if (range) params.range = range;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const res = await api.get("/analytics/revenueChart", {
    params,
  });
  return res.data;
};

export const getDashboardStats = async (filterParams = {}) => {
  const res = await api.get("/dashboard/stats", {
    params: filterParams,
  });
  return res.data?.data;
};

export const getPeriodBreakdown = async (filterParams = {}) => {
  const res = await api.get("/dashboard/period-breakdown", {
    params: filterParams,
  });
  return res.data;
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
