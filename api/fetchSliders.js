//add a logo to sliders
export const addLogo = async (logo) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/sliders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ logo }),
  });

  if (!res.ok) {
    throw new Error("Failed to add slider");
  }

  return res.json();
};

//fetch sliders
export const fetchSliders = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/sliders`);
  if (!res.ok) {
    throw new Error("Failed to fetch sliders");
  }
  return res.json();
};
