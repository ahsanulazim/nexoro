import DashBread from "@/components/dashboard/DashBread";
import Tabs from "@/components/dashboard/settings/Tabs";

const layout = ({ children }) => {
  return (
    <main className="flex flex-col gap-4">
      <section className="">
        <DashBread title="Settings" />
        <h1 className="text-4xl font-semibold">Settings</h1>
      </section>
      <Tabs />
      {children}
    </main>
  );
};

export default layout;
