export const createPlan = async (data, slug) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/plans/${slug}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const planData = await res.json();
  return planData;
};

export const fetchPlans = async (selectedSlug) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/plans/${selectedSlug}`);
  if (res.status === 404) {
    return null;
  }

  if (!res.ok) throw new Error("Failed to fetch plans");
  return res.json();
};
