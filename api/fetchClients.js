//get all clients
export const fetchClients = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/clients`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch clients");
    }

    return res.json();
};

// add a client
export const addClient = async (formData) => {

    const fd = new FormData();
    fd.append("client", formData.clientName);
    fd.append("role", formData.clientRole);
    fd.append("company", formData.company);
    fd.append("country", formData.country);
    fd.append("email", formData.clientEmail);
    fd.append("folder", "clients");
    fd.append("logo", formData.logo[0]);
    fd.append("phone", formData.clientPhone);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/clients`, {
        method: "POST",
        body: fd,
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to add client");
    }
    return data;
};

//delete a client
export const deleteClient = async (email, public_id) => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/clients/${email}`,
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

// Update existing client
export const updateClient = async (id, formData) => {

    const fd = new FormData();
    fd.append("client", formData.clientName);
    fd.append("role", formData.clientRole);
    fd.append("company", formData.company);
    fd.append("country", formData.country);
    fd.append("email", formData.clientEmail);
    fd.append("folder", "clients");
    if (formData.logo) {
        fd.append("logo", formData.logo[0]);
    }
    fd.append("phone", formData.clientPhone);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/clients/${id}`, {
        method: "PUT",
        body: fd,
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to update client");
    }
    return data;
};
