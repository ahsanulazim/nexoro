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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/clients`, {
        method: "POST",
        body: formData,
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