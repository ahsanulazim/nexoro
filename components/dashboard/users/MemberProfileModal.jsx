"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchMemberProfileStats } from "@/api/fetchUsers";
import moment from "moment";
import {
  LuX,
  LuFolderGit2,
  LuClock,
  LuCoins,
  LuTrendingUp,
  LuAward,
  LuReceipt,
  LuSearch,
  LuCopy,
  LuCheck,
  LuShieldAlert,
  LuUserCheck,
  LuRotateCcw,
  LuLayers,
  LuSparkles,
  LuCircleCheck,
  LuCalendar,
  LuCalendarDays,
} from "react-icons/lu";

// Avatar colors matching UserRow
const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-purple-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-red-600",
  "from-cyan-500 to-blue-600",
];

const getAvatarGradient = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);
  if (!parts[0]) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function MemberProfileModal({ member, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [filterTab, setFilterTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeframe, setTimeframe] = useState("all");
  const [failedModalImg, setFailedModalImg] = useState(null);

  const memberId = member?._id || member?.uid || member?.email;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["member-profile-stats", memberId],
    queryFn: () => fetchMemberProfileStats(memberId),
    enabled: isOpen && !!memberId,
  });

  const memberInfo = data?.member || member || {};
  const serverStats = data?.stats;
  const projectsList = data?.projects;

  const handleCopyEmail = () => {
    if (!memberInfo.email) return;
    navigator.clipboard.writeText(memberInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Filter projects by selected timeframe
  const timeframeProjects = useMemo(() => {
    const list = Array.isArray(projectsList) ? projectsList : [];
    if (timeframe === "all") return list;

    return list.filter((project) => {
      if (!project.createdAt) return false;
      const projectDate = moment(project.createdAt);

      if (timeframe === "current") {
        // Current month
        return projectDate.isSameOrAfter(moment().startOf("month"));
      } else if (timeframe === "7days") {
        // Last 7 days
        return projectDate.isSameOrAfter(
          moment().subtract(7, "days").startOf("day"),
        );
      } else if (timeframe === "last_month") {
        // Last month
        const startOfLastMonth = moment().subtract(1, "month").startOf("month");
        const endOfLastMonth = moment().subtract(1, "month").endOf("month");
        return projectDate.isBetween(
          startOfLastMonth,
          endOfLastMonth,
          null,
          "[]",
        );
      }
      return true;
    });
  }, [projectsList, timeframe]);

  // 2. Compute dynamic stats for the selected timeframe
  const currentStats = useMemo(() => {
    if (timeframe === "all" && serverStats) {
      return serverStats;
    }

    const list = Array.isArray(timeframeProjects) ? timeframeProjects : [];
    let totalProjects = list.length;
    let completedProjects = 0;
    let activeProjects = 0;
    let cancelledProjects = 0;
    let pendingProjects = 0;

    let totalGrossRevenue = 0;
    let totalCollectedRevenue = 0;
    let totalCosts = 0;
    let totalTasks = 0;
    let completedTasks = 0;

    list.forEach((p) => {
      const statusLower = (p.status || "pending").toLowerCase();
      if (statusLower === "completed") completedProjects++;
      else if (["processing", "active", "in progress"].includes(statusLower))
        activeProjects++;
      else if (statusLower === "cancelled") cancelledProjects++;
      else pendingProjects++;

      const price = Number(p.price) || 0;
      const amount = Number(p.amount) || 0;
      const cost = Number(p.cost) || 0;

      if (statusLower !== "cancelled") {
        totalGrossRevenue += price;
      }
      totalCollectedRevenue += amount;
      totalCosts += cost;

      totalTasks += p.tasksCount || 0;
      completedTasks += p.completedTasksCount || 0;
    });

    const netProfit = totalCollectedRevenue - totalCosts;
    const grossProfit = totalGrossRevenue - totalCosts;
    const completionRate =
      totalProjects > 0
        ? Math.round((completedProjects / totalProjects) * 100)
        : 0;

    return {
      totalProjects,
      completedProjects,
      activeProjects,
      cancelledProjects,
      pendingProjects,
      completionRate,
      totalGrossRevenue,
      totalCollectedRevenue,
      totalCosts,
      netProfit,
      grossProfit,
      totalRewardPoints: completedProjects * 5,
      totalTasks,
      completedTasks,
    };
  }, [timeframe, timeframeProjects, serverStats]);

  // 3. Filter projects by tab & search (from timeframe subset)
  const filteredProjects = useMemo(() => {
    const list = Array.isArray(timeframeProjects) ? timeframeProjects : [];
    return list.filter((project) => {
      const statusLower = (project.status || "").toLowerCase();
      let matchTab = true;
      if (filterTab === "active") {
        matchTab = ["processing", "active", "in progress", "pending"].includes(
          statusLower,
        );
      } else if (filterTab === "completed") {
        matchTab = statusLower === "completed";
      } else if (filterTab === "cancelled") {
        matchTab = statusLower === "cancelled";
      }

      if (!matchTab) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        (project.orderId && project.orderId.toLowerCase().includes(term)) ||
        (project.serviceName &&
          project.serviceName.toLowerCase().includes(term)) ||
        (project.client && project.client.toLowerCase().includes(term)) ||
        (project.planName && project.planName.toLowerCase().includes(term))
      );
    });
  }, [timeframeProjects, filterTab, searchTerm]);

  // Timeframe display label
  const timeframeLabel = useMemo(() => {
    if (timeframe === "current")
      return `Current Month (${moment().format("MMMM YYYY")})`;
    if (timeframe === "7days") return "Last 7 Days";
    if (timeframe === "last_month")
      return `Last Month (${moment().subtract(1, "month").format("MMMM YYYY")})`;
    return "All Time";
  }, [timeframe]);

  const displayName = memberInfo.name || memberInfo.userName || "Team Member";
  const role = (memberInfo.role || "member").toLowerCase();
  const isAdmin = role === "admin";
  const avatarGradient = getAvatarGradient(displayName);
  const initials = getInitials(displayName);

  const candidatePics = [
    memberInfo.profilePic,
    memberInfo.photoURL,
    memberInfo.avatar,
    memberInfo.image,
  ];
  const modalProfilePic = candidatePics.find(
    (url) =>
      typeof url === "string" &&
      url.trim().length > 0 &&
      url !== "null" &&
      url !== "undefined" &&
      url !== failedModalImg,
  );

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-base-100 border border-base-200/90 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-base-200 flex items-center justify-between shrink-0 bg-base-200/40">
          <div className="flex items-center gap-3.5">
            {modalProfilePic ? (
              <Image
                width={48}
                height={48}
                unoptimized
                src={modalProfilePic}
                alt={displayName}
                onError={() => setFailedModalImg(modalProfilePic)}
                className="size-12 rounded-xl object-cover ring-2 ring-base-300 shrink-0"
              />
            ) : (
              <div
                className={`size-12 rounded-xl bg-linear-to-br ${avatarGradient} text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0`}
              >
                {initials}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg text-base-content">
                  {displayName}
                </h3>
                {isAdmin ? (
                  <span className="badge badge-sm badge-soft badge-primary gap-1">
                    <LuShieldAlert className="size-3" /> Admin
                  </span>
                ) : (
                  <span className="badge badge-sm badge-soft badge-info gap-1">
                    <LuUserCheck className="size-3" /> Team Member
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-base-content/60">
                  {memberInfo.email || "No email"}
                </span>
                {memberInfo.email && (
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-1 rounded hover:bg-base-200 text-base-content/50 hover:text-base-content transition-colors"
                    title={copied ? "Copied!" : "Copy email"}
                  >
                    {copied ? (
                      <LuCheck className="size-3 text-success" />
                    ) : (
                      <LuCopy className="size-3" />
                    )}
                  </button>
                )}
                {memberInfo.createdAt && (
                  <>
                    <span className="text-base-content/30">•</span>
                    <span className="text-xs text-base-content/50">
                      Joined {moment(memberInfo.createdAt).format("MMM YYYY")}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-base-content/60 hover:text-base-content"
          >
            <LuX className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-28 rounded-xl bg-base-200/60 animate-pulse"
                  />
                ))}
              </div>
              <div className="h-48 rounded-xl bg-base-200/60 animate-pulse mt-4" />
            </div>
          ) : isError ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
              <div className="size-12 rounded-2xl bg-error/10 text-error flex items-center justify-center">
                <LuShieldAlert className="size-6" />
              </div>
              <h4 className="font-semibold text-base text-base-content">
                Failed to load member statistics
              </h4>
              <p className="text-xs text-base-content/60 max-w-sm">
                {error?.message ||
                  "Something went wrong while retrieving data."}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="btn btn-sm btn-primary btn-soft gap-2 mt-1"
              >
                <LuRotateCcw className="size-3.5" /> Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Timeframe Selector & Overview Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-base-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                    <LuCalendarDays className="size-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-base-content flex items-center gap-2">
                      Performance Overview
                    </h4>
                    <p className="text-[11px] text-base-content/60">
                      Showing metrics for:{" "}
                      <span className="font-semibold text-primary">
                        {timeframeLabel}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Timeframe Dropdown */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <label
                    htmlFor="timeframe-select"
                    className="text-xs font-medium text-base-content/70 flex items-center gap-1.5 shrink-0"
                  >
                    <LuCalendar className="size-3.5 text-primary" />
                    <span>Timeframe:</span>
                  </label>
                  <select
                    id="timeframe-select"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="select select-sm select-bordered rounded-xl bg-base-300 font-semibold text-xs focus:bg-base-100 border-base-300 shadow-2xs hover:border-primary/50 transition-colors"
                  >
                    <option value="all">All Time (Lifetime)</option>
                    <option value="current">
                      Current Month ({moment().format("MMM YYYY")})
                    </option>
                    <option value="7days">Last 7 Days</option>
                    <option value="last_month">
                      Last Month (
                      {moment().subtract(1, "month").format("MMM YYYY")})
                    </option>
                  </select>
                </div>
              </div>

              {/* 4 Top Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Projects Breakdown */}
                <div className="rounded-xl border border-base-200 bg-base-100 p-4 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-base-content/60">
                      Projects Handled
                    </span>
                    <span className="p-2 rounded-lg bg-primary/10 text-primary">
                      <LuFolderGit2 className="size-4" />
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-base-content">
                      {currentStats.totalProjects}
                    </span>
                    <span className="text-xs text-base-content/50">Total</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap text-[11px]">
                    <span className="badge badge-xs badge-soft badge-success gap-0.5">
                      <LuCircleCheck className="size-3" />{" "}
                      {currentStats.completedProjects} Done
                    </span>
                    <span className="badge badge-xs badge-soft badge-info gap-0.5">
                      <LuClock className="size-3" />{" "}
                      {currentStats.activeProjects} Active
                    </span>
                  </div>
                </div>

                {/* 2. Total Gross Deal Value */}
                <div className="rounded-xl border border-base-200 bg-base-100 p-4 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-base-content/60">
                      Total Project Value
                    </span>
                    <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                      <LuCoins className="size-4" />
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-base-content">
                      ৳{currentStats.totalGrossRevenue.toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-3 text-[11px] text-base-content/60 truncate">
                    Gross budget of assigned projects
                  </p>
                </div>

                {/* 3. Collected Revenue & Net Profit */}
                <div className="rounded-xl border border-base-200 bg-base-100 p-4 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-base-content/60">
                      Collected & Profit
                    </span>
                    <span className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
                      <LuTrendingUp className="size-4" />
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-purple-600">
                      ৳{currentStats.totalCollectedRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] pt-1 border-t border-base-200/60">
                    <span className="text-base-content/60">
                      Cost: ৳{currentStats.totalCosts.toLocaleString()}
                    </span>
                    <span
                      className={`font-semibold ${
                        currentStats.netProfit >= 0
                          ? "text-success"
                          : "text-error"
                      }`}
                    >
                      Profit: ৳{currentStats.netProfit.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 4. Completion Rate & Points */}
                <div className="rounded-xl border border-base-200 bg-base-100 p-4 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-base-content/60">
                      Delivery & Points
                    </span>
                    <span className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                      <LuAward className="size-4" />
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-base-content">
                      {currentStats.completionRate}%
                    </span>
                    <span className="badge badge-sm badge-soft badge-warning font-semibold gap-1">
                      <LuSparkles className="size-3" />{" "}
                      {currentStats.totalRewardPoints} pts
                    </span>
                  </div>
                  <div className="mt-3">
                    <progress
                      className="progress progress-warning w-full h-1.5"
                      value={currentStats.completionRate}
                      max="100"
                    ></progress>
                    <p className="text-[10px] text-base-content/50 mt-1">
                      {currentStats.completedTasks} / {currentStats.totalTasks}{" "}
                      sub-tasks finished
                    </p>
                  </div>
                </div>
              </div>

              {/* Projects Breakdown Section */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base text-base-content flex items-center gap-2">
                      <LuLayers className="size-4 text-primary" /> Assigned
                      Projects ({filteredProjects.length})
                    </h4>
                    <p className="text-xs text-base-content/60">
                      List of all client projects worked on by this member
                    </p>
                  </div>

                  {/* Filters & Search */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Tab Pills */}
                    <div className="join bg-base-200/80 p-0.5 rounded-lg text-xs">
                      <button
                        type="button"
                        onClick={() => setFilterTab("all")}
                        className={`join-item px-2.5 py-1 font-medium rounded-md transition-colors ${
                          filterTab === "all"
                            ? "bg-base-100 shadow-xs text-base-content font-semibold"
                            : "text-base-content/60 hover:text-base-content"
                        }`}
                      >
                        All ({currentStats.totalProjects})
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterTab("active")}
                        className={`join-item px-2.5 py-1 font-medium rounded-md transition-colors ${
                          filterTab === "active"
                            ? "bg-base-100 shadow-xs text-base-content font-semibold"
                            : "text-base-content/60 hover:text-base-content"
                        }`}
                      >
                        Active ({currentStats.activeProjects})
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterTab("completed")}
                        className={`join-item px-2.5 py-1 font-medium rounded-md transition-colors ${
                          filterTab === "completed"
                            ? "bg-base-100 shadow-xs text-base-content font-semibold"
                            : "text-base-content/60 hover:text-base-content"
                        }`}
                      >
                        Done ({currentStats.completedProjects})
                      </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                      <LuSearch className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input input-xs h-8 pl-8 pr-3 rounded-lg bg-base-200/70 border-base-300 w-36 sm:w-44 text-xs focus:bg-base-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Projects Table */}
                <div className="rounded-xl border border-base-200 overflow-hidden bg-base-100 shadow-2xs">
                  {filteredProjects.length === 0 ? (
                    <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
                      <LuReceipt className="size-8 text-base-content/30" />
                      <p className="text-xs font-medium text-base-content/70">
                        No projects found
                      </p>
                      <p className="text-[11px] text-base-content/50">
                        {searchTerm ||
                        filterTab !== "all" ||
                        timeframe !== "all"
                          ? "Try adjusting your search, status tab, or timeframe filter."
                          : "This member hasn't been assigned to any projects yet."}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto max-h-72">
                      <table className="table table-xs w-full">
                        <thead className="bg-base-200/60 sticky top-0 z-10 text-[11px] uppercase tracking-wider text-base-content/70">
                          <tr>
                            <th className="py-2.5 pl-4">Project / Service</th>
                            <th className="py-2.5">Client</th>
                            <th className="py-2.5 text-right">Budget (৳)</th>
                            <th className="py-2.5 text-right">Collected (৳)</th>
                            <th className="py-2.5 text-right">Profit (৳)</th>
                            <th className="py-2.5 text-center">Status</th>
                            <th className="py-2.5 text-center">Payment</th>
                            <th className="py-2.5 pr-4 text-right">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-base-200/60 text-xs">
                          {filteredProjects.map((p) => {
                            const statusLower = (p.status || "").toLowerCase();
                            const isDone = statusLower === "completed";
                            const isProg = [
                              "processing",
                              "active",
                              "in progress",
                            ].includes(statusLower);
                            const isCancel = statusLower === "cancelled";

                            const payLower = (p.payment || "").toLowerCase();
                            const isPaid = payLower === "success";
                            const isPartial = payLower === "partial";

                            return (
                              <tr
                                key={p._id || p.orderId}
                                className="hover:bg-base-200/30 transition-colors"
                              >
                                <td className="py-2.5 pl-4">
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-base-content truncate max-w-[170px]">
                                      {p.serviceName}
                                    </span>
                                    <span className="text-[10px] text-base-content/50">
                                      #{p.orderId} • {p.planName}
                                    </span>
                                  </div>
                                </td>

                                <td className="py-2.5">
                                  <span className="text-base-content/80 font-medium">
                                    {p.client || "—"}
                                  </span>
                                </td>

                                <td className="py-2.5 text-right font-medium">
                                  ৳{p.price?.toLocaleString()}
                                </td>

                                <td className="py-2.5 text-right font-semibold text-purple-600">
                                  ৳{p.amount?.toLocaleString()}
                                </td>

                                <td className="py-2.5 text-right font-semibold">
                                  <span
                                    className={
                                      p.profit >= 0
                                        ? "text-success"
                                        : "text-error"
                                    }
                                  >
                                    ৳{p.profit?.toLocaleString()}
                                  </span>
                                </td>

                                <td className="py-2.5 text-center whitespace-nowrap">
                                  {isDone ? (
                                    <span className="badge badge-xs badge-soft badge-success">
                                      Completed
                                    </span>
                                  ) : isProg ? (
                                    <span className="badge badge-xs badge-soft badge-info">
                                      In Progress
                                    </span>
                                  ) : isCancel ? (
                                    <span className="badge badge-xs badge-soft badge-error">
                                      Cancelled
                                    </span>
                                  ) : (
                                    <span className="badge badge-xs badge-soft badge-warning">
                                      {p.status || "Pending"}
                                    </span>
                                  )}
                                </td>

                                <td className="py-2.5 text-center whitespace-nowrap">
                                  {isPaid ? (
                                    <span className="badge badge-xs badge-soft badge-success">
                                      Paid
                                    </span>
                                  ) : isPartial ? (
                                    <span className="badge badge-xs badge-soft badge-warning">
                                      Partial
                                    </span>
                                  ) : (
                                    <span className="badge badge-xs badge-soft">
                                      {p.payment || "Pending"}
                                    </span>
                                  )}
                                </td>

                                <td className="py-2.5 pr-4 text-right text-base-content/60 text-[11px] whitespace-nowrap">
                                  {p.createdAt
                                    ? moment(p.createdAt).format("MMM DD, YYYY")
                                    : "—"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-base-200 flex items-center justify-between shrink-0 bg-base-200/30">
          <span className="text-[11px] text-base-content/50">
            Analytics aggregated from client orders & project costs
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
