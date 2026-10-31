import api from "@/axios/axiosInstance";

export const submitExtraWork = async (data) => {
  const res = await api.post("/points/submit-work", data);
  return res.data;
};

export const fetchWorkSubmissions = async ({ queryKey }) => {
  const [_key, params] = queryKey;
  const res = await api.get("/points/submissions", { params });
  return res.data;
};

export const reviewWorkSubmission = async ({ id, action, points, adminNote }) => {
  const res = await api.patch(`/points/submissions/${id}/review`, {
    action,
    points,
    adminNote,
  });
  return res.data;
};

export const fetchLeaderboard = async ({ queryKey }) => {
  const [_key, params] = queryKey;
  const res = await api.get("/points/leaderboard", { params });
  return res.data;
};

export const fetchMyPointsSummary = async ({ queryKey }) => {
  const [_key, params] = queryKey || [];
  const res = await api.get("/points/my-summary", { params });
  return res.data;
};

