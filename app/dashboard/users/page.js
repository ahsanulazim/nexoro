"use client";

import { fetchUsers } from "@/api/fetchUsers";
import DashBread from "@/components/dashboard/DashBread";
import ClientTable from "@/components/dashboard/users/ClientTable";
import Loader from "@/components/ui/Loader";
import auth from "@/firebase/firebase.config";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Users = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ["users", user?.uid],
    queryFn: fetchUsers,
    enabled: !!user,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || isLoading) {
    return <Loader />;
  }

  if (isError) {
    router.push("/dashboard");
    return null;
  }

  return (
    <main className="flex flex-col gap-4">
      <section className="">
        <DashBread title="Users" />
        <h1 className="text-4xl font-semibold">Users</h1>
      </section>
      <section><ClientTable users={users} /></section>
    </main>
  );
};

export default Users;
