"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ActiveLink = ({ children, href, dataTip }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? "menu-active bg-main-dark" : ""}`}
      data-tip={dataTip}
    >
      {/* Home icon */}
      {children}
    </Link>
  );
};

export default ActiveLink;
