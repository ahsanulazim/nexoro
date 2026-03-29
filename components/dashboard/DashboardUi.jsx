"use client";

import {
  LuBox,
  LuDollarSign,
  LuShoppingBasket,
  LuUserRound,
} from "react-icons/lu";
import StatsCard from "./StatsCard";
import { useContext } from "react";
import { MyContext } from "@/context/MyProvider";

const DashboardUi = () => {
  const { isAdmin, isEmployee, isMember } = useContext(MyContext);

  const statuses = [
    {
      id: 0,
      title: "New Orders",
      count: 200,
      comparison: 25,
      grow: true,
      icon: <LuShoppingBasket />,
    },
    {
      id: 1,
      title: "New Users",
      count: 20,
      comparison: 5,
      grow: true,
      icon: <LuUserRound />,
    },
    {
      id: 2,
      title: "Pending Orders",
      count: 6,
      comparison: 2,
      grow: false,
      icon: <LuBox />,
    },
    {
      id: 3,
      title: "Earning",
      count: 2000,
      comparison: 40,
      grow: true,
      icon: <LuDollarSign />,
    },
  ];

  return (
    <main>
      <section>
        {isAdmin ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-5">
            {statuses.map((status) => (
              <StatsCard key={status.id} status={status} />
            ))}
          </div>
        ) : isEmployee ? (
          <p>Employee Dashboard</p>
        ) : (
          <></>
        )}
      </section>
    </main>
  );
};

export default DashboardUi;
