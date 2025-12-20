import DashBread from "@/components/dashboard/DashBread";
import Tabs from "@/components/dashboard/settings/Tabs";

const layout = ({ children }) => {

  const settings = [
    {
      title: "General Settings",
      href: "/dashboard/settings",
    },
    {
      title: "Billing",
      href: "/dashboard/settings/billing",
    },
    {
      title: "Security",
      href: "/dashboard/settings/security",
    },
    {
      title: "Refferals",
      href: "/dashboard/settings/refferals",
    },
  ];

  return (
    <main className="flex flex-col gap-4">
      <section className="">
        <DashBread title="Settings" />
        <h1 className="text-4xl font-semibold">Settings</h1>
      </section>
      <Tabs tabItems={settings} />
      <section className="bg-base-200 p-5 rounded-md inset-shadow-sm">{children}</section>
    </main>
  );
};

export default layout;
