import api from "@/axios/axiosInstance";

export const createOrder = async (data) => {
  const res = await api.post("/orders/createOrder", data);
  return res.data;
};

export const getOrder = async ({ queryKey }) => {
  const [_key, orderId] = queryKey;

  const res = await api.get("/orders/getOrder", {
    params: {
      id: orderId,
    },
  });
  return res.data;
};
