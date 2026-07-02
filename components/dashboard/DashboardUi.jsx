"use client";

import StatsCard from "./StatsCard";
import { useContext } from "react";
import { MyContext } from "@/context/MyProvider";
import Analytics, { transformAnalytics } from "./Analytics";
import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/api/fetchAnalytics";
import RevenueChart from "./RevenueChart";
import OrderChart from "./OrderChart";

const DashboardUi = () => {
  const { isAdmin, isEmployee, isMember } = useContext(MyContext);

  const {
    data: statuses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["salesData"],
    queryFn: getAnalytics,
    select: (data) => transformAnalytics(data),
  });

  return (
    <main>
      <section>
        {isAdmin ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-5">
            {isLoading ? (
              <div className="col-span-1 xs:col-span-2 lg:col-span-4 flex justify-center py-10">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : isError ? (
              <div className="col-span-1 xs:col-span-2 lg:col-span-4 text-error font-medium">
                Error loading analytics. Please try again.
              </div>
            ) : (
              statuses.map((status) => (
                <StatsCard key={status.id} status={status} />
              ))
            )}
          </div>
        ) : isEmployee ? (
          <p>Employee Dashboard</p>
        ) : null}
      </section>
      <section className="mt-5">
        <div className="grid grid-cols-5 gap-5">
          <div className="bg-base-200 rounded-box p-5 col-span-3">
            <h2 className="uppercase text-sm font-semibold tracking-wider">
              Revenue
            </h2>
            <RevenueChart />
          </div>
          <div className="bg-base-200 rounded-box p-5 col-span-2">
            <h2 className="uppercase text-sm font-semibold tracking-wider">
              Orders
            </h2>
            <OrderChart />
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardUi;
