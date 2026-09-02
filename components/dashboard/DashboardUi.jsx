"use client";

import RevenueChart from "./RevenueChart";
import OrderChart from "./OrderChart";
import { useAuth } from "@/context/AuthProvider";
import { greeting } from "@/lib/greeting";
import StatsCard from "./StatsCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDashboardStats } from "@/api/fetchAnalytics";
import { useSocket } from "@/context/SocketProvider";
import { useEffect } from "react";
import {
  LuUsers,
  LuShoppingBag,
  LuBriefcase,
  LuClock,
  LuReceipt,
} from "react-icons/lu";
import RecentOrderData from "./RecentOrderData";
import RecentProjectsData from "./RecentProjectsData";
import Link from "next/link";

const DashboardUi = () => {
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  // 1. Fetch initial dashboard stats via TanStack Query
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes cache fallback
  });

  // 2. Real-time updates via Socket.io
  useEffect(() => {
    if (!socket) return;

    const handleStatsUpdate = (updatedStats) => {
      // Seamlessly update TanStack Query cache without unnecessary re-fetching
      queryClient.setQueryData(["dashboardStats"], updatedStats);
    };

    socket.on("dashboardStatsUpdate", handleStatsUpdate);

    return () => {
      socket.off("dashboardStatsUpdate", handleStatsUpdate);
    };
  }, [socket, queryClient]);

  return (
    <main className="space-y-5">
      <section>
        <div>
          <h2 className="text-lg font-semibold">
            {greeting(currentUser?.user?.name.split(" ")[0])}
          </h2>
          <p className="text-sm opacity-50">
            Here's what's happening with your agency today.
          </p>
        </div>
      </section>
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {/* Total Customers */}
          <StatsCard
            title="Total Customers"
            stat={stats?.customers}
            icon={<LuUsers />}
            isLoading={isLoading}
          />

          {/* Total Orders */}
          <StatsCard
            title="Total Orders"
            stat={stats?.orders}
            icon={<LuShoppingBag />}
            isLoading={isLoading}
          />

          {/* Assigned Projects */}
          <StatsCard
            title="Assigned Projects"
            stat={stats?.assignedProjects}
            icon={<LuBriefcase />}
            isLoading={isLoading}
          />

          {/* Pending Projects */}
          <StatsCard
            title="Pending Projects"
            stat={stats?.pendingProjects}
            icon={<LuClock />}
            isLoading={isLoading}
            inverseTone={true}
          />

          {/* Total Expenses */}
          <StatsCard
            title="Total Expenses"
            stat={stats?.expenses}
            icon={<LuReceipt />}
            isLoading={isLoading}
            inverseTone={true}
          />
        </div>
      </section>
      <section>
        <div className="grid lg:grid-cols-5 gap-5">
          <div className="bg-base-200 rounded-box p-5 lg:col-span-3">
            <h2 className="uppercase text-sm font-semibold tracking-wider mb-3">
              Revenue
            </h2>
            <RevenueChart />
          </div>
          <div className="bg-base-200 rounded-box p-5 lg:col-span-2">
            <h2 className="uppercase text-sm font-semibold tracking-wider mb-3">
              Orders
            </h2>
            <OrderChart />
          </div>
        </div>
      </section>
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-base-200 rounded-box p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="uppercase text-sm font-semibold tracking-wider">
                Recent Orders
              </h3>
              <Link href="/dashboard/orders">
                <button className="btn btn-sm btn-soft btn-accent">
                  View All
                </button>
              </Link>
            </div>
            <RecentOrderData />
          </div>
          <div className="bg-base-200 rounded-box p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="uppercase text-sm font-semibold tracking-wider">
                Recent Projects
              </h3>
              <Link href="/dashboard/projects">
                <button className="btn btn-sm btn-soft btn-accent">
                  View All
                </button>
              </Link>
            </div>
            <RecentProjectsData />
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardUi;
