import Link from "next/link";
import React from "react";
import { LuHouse } from "react-icons/lu";

const Breadcrums = ({ children }) => {
  return (
    <div className="breadcrumbs max-md:text-sm">
      <ul>
        <li>
          <Link href="/">
            <LuHouse />
          </Link>
        </li>
        <li>{children}</li>
      </ul>
    </div>
  );
};

export default Breadcrums;
