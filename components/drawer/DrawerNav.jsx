"use client";

import Link from "next/link";

const DrawerNav = ({ children, link }) => {
  const drawerClose = () => {
    const drawer = document.getElementById("my-drawer-2");
    if (drawer) drawer.checked = false;
  };
  return (
    <li>
      <Link href={link} onClick={drawerClose}>
        {children}
      </Link>
    </li>
  );
};

export default DrawerNav;
