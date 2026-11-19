"use client";

import { useState, useMemo, useEffect } from "react";
import RevenueChart from "./RevenueChart";
import OrderChart from "./OrderChart";
import { useAuth } from "@/context/AuthProvider";
import { greeting } from "@/lib/greeting";
import StatsCard from "./StatsCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDashboardStats } from "@/api/fetchAnalytics";
import { fetchMyPointsSummary } from "@/api/fetchPoints";
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
  LuTrophy,
  LuMessageCircle,
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

  const userRole = currentUser?.user?.role;
  const isAdmin = userRole === "admin";
  const isMember = userRole === "member";
  const isStaff = isAdmin || isMember;

  // Date Filter State (for Admin view)
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

  // 1. Fetch dashboard stats via TanStack Query
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

  // 1.1 Fetch personal points summary for team member view
  const { data: mySummaryData } = useQuery({
    queryKey: ["myPointsSummary"],
    queryFn: fetchMyPointsSummary,
    enabled: isMember,
  });
  const mySummary = mySummaryData?.summary || {};

  // 2. Real-time updates via Socket.io
  useEffect(() => {
    if (!socket || !isStaff) return;

    const handleStatsUpdate = (updatedStats) => {
      if (!filterState.isCustom) {
        queryClient.setQueryData(
          ["dashboardStats", null, null, "this_month"],
          updatedStats
        );
      } else {
        queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      }
    };

    const handlePointsUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ["myPointsSummary"] });
    };

    socket.on("dashboardStatsUpdate", handleStatsUpdate);
    socket.on("pointsUpdated", handlePointsUpdated);

    return () => {
      socket.off("dashboardStatsUpdate", handleStatsUpdate);
      socket.off("pointsUpdated", handlePointsUpdated);
    };
  }, [socket, queryClient, isStaff, filterState.isCustom]);

  // If logged-in user is a client/customer, render the Dedicated Client Portal
  if (!isStaff) {
    return <ClientPortalUi />;
  }

  const isNetProfit = stats?.profit?.isProfit !== false;
  const activePeriodLabel = stats?.dateRange?.label || filterState.label;

  // ==========================================
  // VIEW A: ADMIN DASHBOARD (Full Agency Overview)
  // ==========================================
  if (isAdmin) {
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
              badgeText={filterState.isCustom ? activePeriodLabel : null}
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
              badgeText={filterState.isCustom ? activePeriodLabel : null}
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
              badgeText={filterState.isCustom ? activePeriodLabel : null}
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
  }

  // ==========================================
  // VIEW B: MEMBER DASHBOARD (Workstation & Team View)
  // Financial metrics & company profits are hidden
  // ==========================================
  return (
    <main className="space-y-6">
      {/* Header Greeting & Quick Submit */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {greeting(currentUser?.user?.name?.split(" ")[0] || "")}
              <span className="badge badge-sm badge-primary badge-outline font-normal">
                Team Member
              </span>
            </h2>
            <p className="text-sm opacity-50">
              Welcome to your workspace. Here is your active work, tasks, and monthly performance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/points" className="btn btn-sm btn-primary">
              <LuSparkles className="size-4" />
              <span>Submit Work</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 1. Member Operations & Personal Performance Cards */}
      <section className="space-y-2.5">
        <h3 className="text-xs uppercase font-semibold tracking-wider text-base-content/60">
          My Workspace Overview
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Assigned Projects */}
          <StatsCard
            title="Assigned Projects"
            stat={stats?.assignedProjects}
            icon={<LuBriefcase className="text-primary" />}
            isLoading={isLoading}
            highlight="primary"
            subtext="Active projects in development"
          />

          {/* Pending Projects */}
          <StatsCard
            title="Pending Projects"
            stat={stats?.pendingProjects}
            icon={<LuClock className="text-warning" />}
            isLoading={isLoading}
            inverseTone={true}
            subtext="Awaiting review or delivery"
          />

          {/* Total Client Orders */}
          <StatsCard
            title="Total Orders"
            stat={stats?.orders}
            icon={<LuShoppingBag className="text-info" />}
            isLoading={isLoading}
            subtext="Client orders in pipeline"
          />

          {/* Member's Monthly Points */}
          <StatsCard
            title="My Points This Month"
            count={mySummary?.monthlyPoints ? `${mySummary.monthlyPoints} pts` : "0 pts"}
            icon={<LuTrophy className="text-warning" />}
            highlight="success"
            badgeText={`${mySummary?.monthlyProjectsCount || mySummary?.completedProjects || 0} completed`}
            badgeVariant="success"
            subtext={`Approved extra works: ${mySummary?.approvedExtraWorks || 0}`}
          />
        </div>
      </section>

      {/* 2. Operations Activity Trends & Quick Shortcuts */}
      <section>
        <div className="grid lg:grid-cols-5 gap-5">
          {/* Order Activity Trends (Volume Only, Safe for Members) */}
          <div className="bg-base-100 rounded-box p-5 lg:col-span-3">
            <h2 className="uppercase text-sm font-semibold tracking-wider mb-3">
              Order Activity Trends
            </h2>
            <OrderChart />
          </div>

          {/* Quick Work Actions & Daily Shortcuts */}
          <div className="bg-base-100 rounded-box p-5 lg:col-span-2 flex flex-col justify-between">
            <div>
              <h2 className="uppercase text-sm font-semibold tracking-wider mb-1.5">
                Quick Shortcuts
              </h2>
              <p className="text-xs text-base-content/70 mb-4">
                Fast navigation to your daily operational responsibilities.
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/dashboard/projects"
                  className="btn btn-sm btn-outline border-base-content/20 hover:border-primary hover:bg-primary/10 flex items-center justify-start gap-2"
                >
                  <LuBriefcase className="size-4 text-primary" />
                  <span className="truncate">Projects</span>
                </Link>
                <Link
                  href="/dashboard/inbox"
                  className="btn btn-sm btn-outline border-base-content/20 hover:border-primary hover:bg-primary/10 flex items-center justify-start gap-2"
                >
                  <LuMessageCircle className="size-4 text-info" />
                  <span className="truncate">Client Inbox</span>
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="btn btn-sm btn-outline border-base-content/20 hover:border-primary hover:bg-primary/10 flex items-center justify-start gap-2"
                >
                  <LuShoppingBag className="size-4 text-accent" />
                  <span className="truncate">Orders</span>
                </Link>
                <Link
                  href="/dashboard/points"
                  className="btn btn-sm btn-outline border-base-content/20 hover:border-primary hover:bg-primary/10 flex items-center justify-start gap-2"
                >
                  <LuTrophy className="size-4 text-warning" />
                  <span className="truncate">Points Hub</span>
                </Link>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-base-200/60 border border-base-content/5 text-xs text-base-content/70 flex items-center gap-2">
              <LuSparkles className="size-4 text-primary shrink-0" />
              <span>
                Tip: Complete tasks on time and submit extra work to climb the monthly leaderboard!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Monthly Leaderboard & Points Widget */}
      <section>
        <LiveLeaderboardWidget />
      </section>

      {/* 4. Recent Projects & Recent Orders */}
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
