// add a team member
export const addMember = async (formData) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/team`, {
        method: "POST",
        body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to add Member");
    }
    return data;
};

//get all Team Members
export const fetchMembers = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/team`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch Team Members");
    }

    return res.json();
};

//delete a team member
export const deleteMember = async (id, public_id) => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/team/${id}`,
        {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_id }),
        }
    );
    if (!res.ok) {
        throw new Error("Failed to delete Member");
    }
    return res.json();
};

// Update existing member
export const updateMember = async (id, formData) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/team/${id}`, {
        method: "PUT",
        body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to update Member");
    }
    return data;
};