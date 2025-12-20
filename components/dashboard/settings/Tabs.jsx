"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Tabs = ({ tabItems }) => {
  const pathname = usePathname();

  return (
    <div role="tablist" className="tabs max-[380px]:tabs-xs max-xs:tabs-sm max-xs:flex-nowrap max-xs:overflow-x-scroll tabs-box *:shrink-0">
      {tabItems.map((tabItem) => (
        <Link
          href={tabItem.href}
          key={tabItem.title}
          role="tab"
          className={`tab ${pathname === tabItem.href && "tab-active"}`}
        >
          {tabItem.title}
        </Link>
      ))}
    </div>
  );
};

export default Tabs;
