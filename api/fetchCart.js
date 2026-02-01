//Order Created

import auth from "@/firebase/firebase.config";

export const createOrder = async (slug, id) => {
    const user = auth.currentUser;
    const email = user?.email;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/cart/${email}/${slug}/plans/${id}`, { method: "PUT" });

    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }
    return res.json();
}