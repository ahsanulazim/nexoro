import auth from "@/firebase/firebase.config";

//get users
export const fetchUsers = async () => {
    const user = auth.currentUser;
    if (!user) return null;

    const token = await user?.getIdToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }
    return res.json();

};

//delete user
export const deleteUser = async (email) => {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const token = await user.getIdToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/${email}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to delete user");
    }

    return res.json();
};
