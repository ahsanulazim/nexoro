import DashBread from "@/components/dashboard/DashBread";
import ClientTable from "@/components/dashboard/users/ClientTable";

const Users = async () => {

  const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users`);
  const users = await userRes.json();

  return (
    <main className="flex flex-col gap-4">
      <section className="">
        <DashBread title="Users" />
        <h1 className="text-4xl font-semibold">Users</h1>
      </section>
      <section>
        <ClientTable users={users} />
      </section>
    </main>
  );
};

export default Users;
