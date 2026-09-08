import api from "@/axios/axiosInstance";

// get all clients
export const fetchClients = async () => {
  const res = await api.get("/clients");
  return res.data;
};

// add a client
export const addClient = async (formData) => {
  const fd = new FormData();
  fd.append("name", formData.name);
  fd.append("role", formData.clientRole);
  fd.append("company", formData.company);
  fd.append("country", formData.country);
  fd.append("email", formData.clientEmail);
  fd.append("folder", "clients");
  if (formData.logo && formData.logo[0]) {
    fd.append("logo", formData.logo[0]);
  }
  fd.append("phone", formData.clientPhone || "");

  const res = await api.post("/clients", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// delete a client
export const deleteClient = async (email, public_id) => {
  const res = await api.delete(`/clients/${encodeURIComponent(email)}`, {
    data: { public_id },
  });
  return res.data;
};

// Update existing client
export const updateClient = async (id, formData) => {
  const fd = new FormData();
  fd.append("name", formData.name);
  fd.append("role", formData.clientRole);
  fd.append("company", formData.company);
  fd.append("country", formData.country);
  fd.append("email", formData.clientEmail);
  fd.append("folder", "clients");
  if (formData.logo && formData.logo[0]) {
    fd.append("logo", formData.logo[0]);
  }
  fd.append("phone", formData.clientPhone || "");

  const res = await api.put(`/clients/${id}`, fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

