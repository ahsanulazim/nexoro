//Order Created

import auth from "@/firebase/firebase.config";

export const createOrder = async (slug, id) => {
    const user = auth.currentUser;
    const uId = user?.uid;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/orders/checkout?uid=${uId}&slug=${slug}&planId=${id}`, { method: "POST" });

    if (!res.ok) {
        throw new Error("Failed to create order");
    }
    return res.json();
}

//get all orders of every user
export const fetchAllOrders = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/orders/getAllOrders`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch all orders");
    }

    return res.json();
};