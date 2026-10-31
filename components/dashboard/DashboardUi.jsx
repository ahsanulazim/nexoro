"use client";

import { useState, useMemo, useEffect } from "react";
import RevenueChart from "./RevenueChart";
import OrderChart from "./OrderChart";
import { useAuth } from "@/context/AuthProvider";
import { greeting } from "@/lib/greeting";
import StatsCard from "./StatsCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDashboardStats } from "@/api/fetchAnalytics";
import { useSocket } from "@/context/SocketProvider";
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
import DateFilterBar from "./DateFilterBar";
import DatePeriodBreakdown from "./DatePeriodBreakdown";
import LiveLeaderboardWidget from "./LiveLeaderboardWidget";

const DashboardUi = () => {
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const isStaff =
    currentUser?.user?.role === "admin" ||
    currentUser?.user?.role === "member";

  // Date Filter State
  const [filterState, setFilterState] = useState({
    presetId: "this_month",
    startDate: null,
    endDate: null,
    label: "Current Month",
    isCustom: false,
  });

  // Query Params for API
  const queryParams = useMemo(() => {
    const p = {};
    if (filterState.startDate) p.startDate = filterState.startDate;
    if (filterState.endDate) p.endDate = filterState.endDate;
    return p;
  }, [filterState.startDate, filterState.endDate]);

  // 1. Fetch dashboard stats via TanStack Query (with date filter support)
  const { data: stats, isLoading } = useQuery({
    queryKey: [
      "dashboardStats",
      filterState.startDate,
      filterState.endDate,
      filterState.presetId,
    ],
    queryFn: () => getDashboardStats(queryParams),
    staleTime: 1000 * 60 * 5, // 5 minutes cache fallback
    enabled: isStaff,
  });

  // 2. Real-time updates via Socket.io
  useEffect(() => {
    if (!socket || !isStaff) return;

    const handleStatsUpdate = (updatedStats) => {
      // If user is viewing the default (real-time current month), update cache immediately
      if (!filterState.isCustom) {
        queryClient.setQueryData(
          ["dashboardStats", null, null, "this_month"],
          updatedStats
        );
      } else {
        // Invalidate custom queries so updated numbers can be fetched
        queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      }
    };

    socket.on("dashboardStatsUpdate", handleStatsUpdate);

    return () => {
      socket.off("dashboardStatsUpdate", handleStatsUpdate);
    };
  }, [socket, queryClient, isStaff, filterState.isCustom]);

  // If logged-in user is a client/customer, render the Dedicated Client Portal!
  if (!isStaff) {
    return <ClientPortalUi />;
  }

  const isNetProfit = stats?.profit?.isProfit !== false;
  const activePeriodLabel = stats?.dateRange?.label || filterState.label;

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

      {/* Date Filter Bar */}
      <section>
        <DateFilterBar
          activeFilter={filterState}
          onChangeFilter={setFilterState}
        />
      </section>

      {/* 1. Financial Health & Performance Overview */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-semibold tracking-wider text-base-content/60">
            Financial Overview
          </h3>
          <span className="text-[11px] text-base-content/50 font-medium">
            {activePeriodLabel}
            {!filterState.isCustom && " (Real-time)"}
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
            badgeText={
              filterState.isCustom
                ? activePeriodLabel
                : null
            }
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
            badgeText={
              filterState.isCustom
                ? activePeriodLabel
                : null
            }
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
            badgeText={
              filterState.isCustom
                ? activePeriodLabel
                : null
            }
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

      {/* 3. Synchronized Visual Analytics Charts */}
      <section>
        <div className="grid lg:grid-cols-5 gap-5">
          <div className="bg-base-100 rounded-box p-5 lg:col-span-3">
            <h2 className="uppercase text-sm font-semibold tracking-wider mb-3">
              Revenue & Expenses
            </h2>
            <RevenueChart
              startDate={filterState.startDate}
              endDate={filterState.endDate}
              dateLabel={activePeriodLabel}
            />
          </div>
          <div className="bg-base-100 rounded-box p-5 lg:col-span-2">
            <h2 className="uppercase text-sm font-semibold tracking-wider mb-3">
              Orders
            </h2>
            <OrderChart
              startDate={filterState.startDate}
              endDate={filterState.endDate}
              dateLabel={activePeriodLabel}
            />
          </div>
        </div>
      </section>

      {/* 4. Detailed Period Breakdown of Transactions & Expenses */}
      <section>
        <DatePeriodBreakdown
          dateRange={stats?.dateRange || filterState}
          fallbackSummary={{
            totalIncome: stats?.income?.total,
            totalExpenseAmount: stats?.expenses?.amount,
            netDifference:
              (stats?.income?.total || 0) - (stats?.expenses?.amount || 0),
            periodLabel: activePeriodLabel,
          }}
        />
      </section>

      {/* 4.5. Live Monthly Leaderboard & Points Widget */}
      <section>
        <LiveLeaderboardWidget />
      </section>

      {/* 5. Recent Activity Lists */}
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
