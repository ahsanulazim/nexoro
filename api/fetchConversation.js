import api from "@/axios/axiosInstance";
import { auth } from "@/firebase/firebase.config";

export const getMessages = async (roomId) => {
  const token = await auth.currentUser?.getIdToken();

  const res = await api.get("/conversations/getMessages", {
    params: { roomId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();
  return result;
};
