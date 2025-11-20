import DashBread from "@/components/dashboard/DashBread";
import AccountInfo from "@/components/dashboard/profile/AccountInfo";

const profile = () => {
  return (
    <main className="flex flex-col gap-4">
      <section className="">
        <DashBread title="Profile" />
        <h1 className="text-4xl font-semibold">Profile</h1>
      </section>
      <section className="">
        <AccountInfo />
      </section>
      <section className="">
        <AccountInfo />
      </section>
    </main>
  );
};

export default profile;
