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
  LuTrendingUp,
  LuTrendingDown,
  LuSparkles,
} from "react-icons/lu";
import RecentOrderData from "./RecentOrderData";
import RecentProjectsData from "./RecentProjectsData";
import Link from "next/link";
import ClientPortalUi from "./client/ClientPortalUi";

const DashboardUi = () => {
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const isStaff =
    currentUser?.user?.role === "admin" ||
    currentUser?.user?.role === "member";

  // 1. Fetch initial dashboard stats via TanStack Query (Only for agency staff)
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes cache fallback
    enabled: isStaff,
  });

  // 2. Real-time updates via Socket.io
  useEffect(() => {
    if (!socket || !isStaff) return;

    const handleStatsUpdate = (updatedStats) => {
      // Seamlessly update TanStack Query cache without unnecessary re-fetching
      queryClient.setQueryData(["dashboardStats"], updatedStats);
    };

    socket.on("dashboardStatsUpdate", handleStatsUpdate);

    return () => {
      socket.off("dashboardStatsUpdate", handleStatsUpdate);
    };
  }, [socket, queryClient, isStaff]);

  // If logged-in user is a client/customer, render the Dedicated Client Portal!
  if (!isStaff) {
    return <ClientPortalUi />;
  }

  const isNetProfit = stats?.profit?.isProfit !== false;

  return (
    <main className="space-y-6">
      {/* Header Greeting */}
      <section>
        <div>
          <h2 className="text-lg font-semibold">
            {greeting(currentUser?.user?.name?.split(" ")[0] || "")}
          </h2>
          <p className="text-sm opacity-50">
            {"Here's what's happening with your agency today."}
          </p>
        </div>
      </section>

      {/* 1. Financial Health & Performance Overview */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-semibold tracking-wider text-base-content/60">
            Financial Overview
          </h3>
          <span className="text-[11px] text-base-content/40">
            Current Month (Real-time)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Total Income / Revenue */}
          <StatsCard
            title="Total Income"
            stat={stats?.income}
            isCurrency={true}
            icon={<LuTrendingUp className="text-primary" />}
            isLoading={isLoading}
            subtext={
              stats?.income?.allTime !== undefined
                ? `All-time: ৳${stats.income.allTime.toLocaleString()}`
                : null
            }
            highlight="primary"
          />

          {/* Total Expenses (Standalone + Order Project Costs) */}
          <StatsCard
            title="Total Expenses"
            stat={stats?.expenses}
            isCurrency={true}
            icon={<LuReceipt className="text-error" />}
            isLoading={isLoading}
            inverseTone={true}
            subtext={
              stats?.expenses?.standalone !== undefined
                ? `General: ৳${(stats.expenses.standalone || 0).toLocaleString()} • Orders: ৳${(stats.expenses.orderCosts || 0).toLocaleString()}`
                : null
            }
          />

          {/* Net Profit / Loss */}
          <StatsCard
            title={isNetProfit ? "Net Profit" : "Net Loss"}
            stat={stats?.profit}
            isCurrency={true}
            icon={
              isNetProfit ? (
                <LuSparkles className="text-success" />
              ) : (
                <LuTrendingDown className="text-error" />
              )
            }
            isLoading={isLoading}
            badgeText={
              stats?.profit?.margin !== undefined
                ? `${isNetProfit ? "+" : ""}${stats.profit.margin}% margin`
                : null
            }
            badgeVariant={isNetProfit ? "success" : "error"}
            highlight={isNetProfit ? "success" : "error"}
            subtext={
              stats?.profit?.allTime !== undefined
                ? `All-time Net: ৳${stats.profit.allTime.toLocaleString()}`
                : null
            }
          />
        </div>
      </section>

      {/* 2. Operational Activity Metrics */}
      <section className="space-y-2.5">
        <h3 className="text-xs uppercase font-semibold tracking-wider text-base-content/60">
          Operations & Activity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

          {/* Total Users */}
          <StatsCard
            title="Total Users"
            stat={stats?.registeredUsers || stats?.users || stats?.customers}
            icon={<LuUsers />}
            isLoading={isLoading}
          />
        </div>
      </section>
      <section>
        <div className="grid lg:grid-cols-5 gap-5">
          <div className="bg-base-100 rounded-box p-5 lg:col-span-3">
            <h2 className="uppercase text-sm font-semibold tracking-wider mb-3">
              Revenue
            </h2>
            <RevenueChart />
          </div>
          <div className="bg-base-100 rounded-box p-5 lg:col-span-2">
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
