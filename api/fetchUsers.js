import api from "@/axios/axiosInstance";
import { auth } from "@/firebase/firebase.config";

//createUser
export const createUser = async (data) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  const token = await user.getIdToken();
  const res = await api.post("/users", data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

//get users
export const fetchUsers = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const token = await user?.getIdToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  return res.json();
};

//Get members
export const getMembers = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const token = await user.getIdToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/users/team/members`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch members");
  }
  return res.json();
};

//promote user
export const promoteUser = async (email, permissions) => {
  const res = await api.put("/users/promote", { email, permissions }, {
    params: { email },
  });
  return res.data;
};

//demote member
export const demoteMember = async (email) => {
  const res = await api.put("/users/demote", null, {
    params: { email },
  });
  return res.data;
};

// Update member permissions (Admin only)
export const updateMemberPermissions = async (email, permissions) => {
  const res = await api.put("/users/permissions", { email, permissions });
  return res.data;
};

//delete user
export const deleteUser = async (email) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");

  const token = await user.getIdToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/users/delete?email=${email}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }

  return res.json();
};

// Fetch assignable members and admins
export const fetchAssignableUsers = async () => {
  const res = await api.get("/users/assignable");
  return res.data;
};
