import api from "@/axios/axiosInstance";

export const getAllProjects = async (contextOrParams) => {
  let params = {};
  if (contextOrParams?.queryKey) {
    const [_key, qParams] = contextOrParams.queryKey;
    params = typeof qParams === "object" ? qParams : {};
  } else if (typeof contextOrParams === "object") {
    params = contextOrParams;
  }

  const res = await api.get("/projects/get", { params });

  return res.data;
};
