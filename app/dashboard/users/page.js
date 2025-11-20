import DashBread from "@/components/dashboard/DashBread";
import ClientTable from "@/components/dashboard/users/ClientTable";

const Users = () => {
  return (
    <main className="flex flex-col gap-4">
      <section className="">
        <DashBread title="Users" />
        <h1 className="text-4xl font-semibold">Users</h1>
      </section>
      <section>
        <ClientTable />
      </section>
    </main>
  );
};

export default Users;
