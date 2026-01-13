import Link from "next/link";
import React from "react";
import { LuHouse } from "react-icons/lu";

const Breadcrums = ({ children, subtitle }) => {
  return (
    <div className="breadcrumbs max-md:text-sm">
      <ul>
        <li>
          <Link href="/">
            <LuHouse />
          </Link>
        </li>
        {subtitle && <li><Link href={`/${subtitle.slice(0, 1).toLowerCase() + subtitle.slice(1, subtitle.length)}`}>{subtitle}</Link></li>}
        <li>{children}</li>
      </ul>
    </div>
  );
};

export default Breadcrums;
