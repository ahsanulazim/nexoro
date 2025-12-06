// add a client
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
