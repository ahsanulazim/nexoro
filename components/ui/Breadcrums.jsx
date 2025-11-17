import Link from "next/link";
import React from "react";
import { LuHouse } from "react-icons/lu";

const Breadcrums = () => {
  return (
    <div className="breadcrumbs">
      <ul>
        <li>
          <Link href="/">
            <LuHouse />
          </Link>
        </li>
        <li>About</li>
      </ul>
    </div>
  );
};

export default Breadcrums;
