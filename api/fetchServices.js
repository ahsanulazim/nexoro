// lib/api.js
export const addService = async (formData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/services`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to add service");
  }
  return data;
};

export const fetchServices = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/services`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  return res.json();
};

export const deleteService = async (slug, public_id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/services/${slug}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_id }),
    }
  );
  if (!res.ok) {
    throw new Error("Failed to delete service");
  }
  return res.json();
};
