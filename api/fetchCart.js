//Order Created

import { auth } from "@/firebase/firebase.config";

export const createOrder = async (slug, id) => {
  const user = auth.currentUser;
  const uId = user?.uid;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/orders/checkout?uid=${uId}&slug=${slug}&planId=${id}`,
    { method: "POST" },
  );

  if (!res.ok) {
    throw new Error("Failed to create order");
  }
  return res.json();
};

//get all orders of every user
export const fetchAllOrders = async ({ queryKey }) => {
  const [_key, page] = queryKey;
  const user = auth.currentUser;
  if (!user) return null;

  const token = await user.getIdToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/orders/getAllOrders?page=${page}&limit=10`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch all orders");
  }

  return res.json();
};

//fetch all country names for billing form
export const fetchCountries = async () => {
  const res = await fetch("https://restcountries.com/v3.1/all?fields=name");

  if (!res.ok) {
    throw new Error("Network response was not ok");
  }

  const countries = await res.json();

  return countries
    .map((country) => ({
      value: country.name.common,
      label: country.name.common,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

//update order status by admin

export const updateOrderStatus = async ({ orderId, status }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/orders/updateOrder/${orderId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to update order status");
  }

  return res.json();
};

//delete order by admin
export const deleteOrder = async (orderId) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/orders/deleteOrder/${orderId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to delete order");
  }

  return res.json();
};
