import DashBread from "@/components/dashboard/DashBread";
import Tabs from "@/components/dashboard/settings/Tabs";

const layout = ({ children }) => {
  return (
    <main className="flex flex-col gap-4">
      <section className="">
        <DashBread title="Settings" />
      </section>
      <section className="bg-base-200 p-5 rounded-md inset-shadow-sm">
        {children}
      </section>
    </main>
  );
};

export default layout;
