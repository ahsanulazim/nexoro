export const createCategory = async (catData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(catData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to Create Category");
  }
  return data;
};

export const fetchCategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/category/allCategories`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to Get Categories");
  }

  return res.json();
};

export const createSubService = async (subServiceData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/subServices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subServiceData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to Create Sub Service");
  }
  return data;
};

export const fetchSubServices = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/subServices/allSubServices`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to Get Sub Services");
  }

  return res.json();
};
