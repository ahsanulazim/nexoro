"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Tabs = () => {
  const pathname = usePathname();

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
    <div role="tablist" className="tabs tabs-box">
      {settings.map((setting) => (
        <Link
          href={setting.href}
          key={setting.title}
          role="tab"
          className={`tab ${pathname === setting.href && "tab-active"}`}
        >
          {setting.title}
        </Link>
      ))}
    </div>
  );
};

export default Tabs;
