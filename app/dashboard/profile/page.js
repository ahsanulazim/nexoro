import DashBread from "@/components/dashboard/DashBread";
import AccountInfo from "@/components/dashboard/profile/AccountInfo";

const profile = () => {
  return (
    <main>
      <section className="mb-5">
        <DashBread title="Profile" />
        <h1 className="text-4xl font-semibold">Profile</h1>
      </section>
      <section className="">
        <AccountInfo />
      </section>
    </main>
  );
};

export default profile;
