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

export const updateOrder = async ({ orderId, ...data }) => {
  const res = await api.put("/orders/updateOrder", data, {
    params: {
      orderId,
    },
  });
  return res.data;
};

export const assignOrder = async ({ orderId, ...data }) => {
  const { value } = data;

  const res = await api.put("/orders/assignOrderToMember", value, {
    params: {
      id: orderId,
    },
  });
  return res.data;
};

export const updateOrderTasks = async ({ orderId, tasks, assignedTo }) => {
  const res = await api.put(
    "/orders/updateTasks",
    { tasks, assignedTo },
    {
      params: {
        id: orderId,
      },
    },
  );
  return res.data;
};

export const updateOrderCosts = async ({ orderId, costs }) => {
  const res = await api.put(
    "/orders/updateCosts",
    { costs },
    {
      params: {
        id: orderId,
      },
    },
  );
  return res.data;
};
