// add a service
export const addService = async (formData) => {
  const fd = new FormData();
  fd.append("serviceTitle", formData.serviceTitle);
  fd.append("slug", formData.slug);
  fd.append("shortDes", formData.shortDes);
  fd.append("longDes", formData.longDes);
  fd.append("icon", formData.icon[0]);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/services`, {
    method: "POST",
    body: fd,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to add service");
  }
  return data;
};

//get all services
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


//delete services
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

// Update existing service
export const updateService = async (id, formData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/services/${id}`, {
    method: "PUT",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update service");
  }
  return data;
};