//Order Created

import auth from "@/firebase/firebase.config";

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
export const fetchAllOrders = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/orders/getAllOrders`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
