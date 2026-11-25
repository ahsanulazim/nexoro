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
  return res.data;
};

export const deleteConversation = async (roomId) => {
  const token = await auth.currentUser?.getIdToken();

  const res = await api.delete("/conversations/deleteConversation", {
    params: { roomId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const toggleBlockConversation = async ({ roomId, reason }) => {
  const token = await auth.currentUser?.getIdToken();

  const res = await api.post(
    "/conversations/toggleBlock",
    { roomId, reason },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const toggleFollowUpConversation = async ({
  roomId,
  isFollowUp,
  reason,
  dueDate,
  priority,
}) => {
  const token = await auth.currentUser?.getIdToken();

  const res = await api.post(
    "/conversations/toggleFollowUp",
    { roomId, isFollowUp, reason, dueDate, priority },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
