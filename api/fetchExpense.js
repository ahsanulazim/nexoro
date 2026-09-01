import api from "@/axios/axiosInstance";

export const addExpense = async (data) => {
  const res = await api.post("/expenses/add-expense", data);
  return res;
};

export const getAllExpenses = async () => {
  const res = await api.get("/expenses/get-expenses");
  return res.data;
};

export const getExpense = async ({ queryKey }) => {
  const [_, id] = queryKey;
  const res = await api.get("/expenses/get-expense", {
    params: {
      id,
    },
  });
  return res.data;
};

export const updateExpense = async ({ id, data }) => {
  const res = await api.put("/expenses/update-expense", data, {
    params: {
      id,
    },
  });
  return res;
};

export const deleteExpense = async (id) => {
  const res = await api.delete("/expenses/delete-expense", {
    params: {
      id,
    },
  });
  return res;
};
