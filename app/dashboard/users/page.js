"use client";

import DashBread from "@/components/dashboard/DashBread";
import ClientTable from "@/components/dashboard/users/ClientTable";
import Loader from "@/components/ui/Loader";
import { MyContext } from "@/context/MyProvider";
import auth from "@/firebase/firebase.config";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Users = () => {
  const [user, loading] = useAuthState(auth);
  const { isAdmin } = useContext(MyContext);
  const [users, setUsers] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          router.push("/dashboard");
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [user, router]);

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="flex flex-col gap-4">
      <section className="">
        <DashBread title="Users" />
        <h1 className="text-4xl font-semibold">Users</h1>
      </section>
      <section>{isAdmin && <ClientTable users={users} />}</section>
    </main>
  );
};

export default Users;
