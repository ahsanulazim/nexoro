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
