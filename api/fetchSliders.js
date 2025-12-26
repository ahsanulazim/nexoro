//add client sliders
export const clientSliders = async (selectedIds) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/sliders/clients`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ids: selectedIds,
      slider: true,
    }),
  });
  if (!res.ok) {
    throw new Error("Failed to add sliders to clients");
  }
  return res.json();
}

export const removeClientSliders = async (id) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/sliders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error("Failed to remove sliders from clients");
  }
  return res.json();
}