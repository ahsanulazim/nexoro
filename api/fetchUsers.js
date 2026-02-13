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

//Get members
export const getMembers = async () => {
    const user = auth.currentUser;
    if (!user) return null;

    const token = await user.getIdToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/team/members`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch members");
    }
    return res.json();
};

//promote user
export const promoteUser = async (email) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/promote?email=${email}`, { method: "PUT" })
    const user = await res.json();

    if (!res.ok) {
        throw new Error(user.message || "Failed to promote user");
    }
    return user;
}

//demote member
export const demoteMember = async (email) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/demote?email=${email}`, { method: "PUT" });
    const member = await res.json();

    if (!res.ok) {
        throw new Error(member.message || "Failed to demote member");
    }
    return member;
}

//delete user
export const deleteUser = async (email) => {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const token = await user.getIdToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/delete?email=${email}`, {
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
