"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import moment from "moment";
import { toast } from "react-toastify";
import DashBread from "@/components/dashboard/DashBread";
import { useAuth } from "@/context/AuthProvider";
import { useSocket } from "@/context/SocketProvider";
import {
  fetchLeaderboard,
  fetchMyPointsSummary,
  fetchWorkSubmissions,
  reviewWorkSubmission,
  submitExtraWork,
} from "@/api/fetchPoints";
import {
  LuAward,
  LuBriefcase,
  LuCalendar,
  LuCheck,
  LuCircleCheck,
  LuCircleX,
  LuClock,
  LuCrown,
  LuExternalLink,
  LuFilePlus,
  LuFlame,
  LuHistory,
  LuLink,
  LuMedal,
  LuRefreshCw,
  LuSend,
  LuSparkles,
  LuStar,
  LuTrophy,
  LuUser,
  LuX,
} from "react-icons/lu";

const formatMonthLabel = (monthKey) => {
  if (!monthKey || monthKey === "all_time") return "All-Time Ranking";
  return moment(monthKey, "YYYY-MM").format("MMMM YYYY");
};

const PointsAndLeaderboardContent = () => {
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isAdmin = currentUser?.user?.role === "admin";
  const currentUserId = currentUser?.user?._id
    ? String(currentUser.user._id)
    : "";
  const currentUserEmail = currentUser?.user?.email?.toLowerCase() || "";

  // Active tab state ("overview" | "submit" | "leaderboard" | "approvals")
  const initialTab = searchParams.get("tab") || "leaderboard";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Leaderboard period state (default: current month, or YYYY-MM / all_time)
  const [selectedMonth, setSelectedMonth] = useState("");

  // Extra work form state
  const [workTitle, setWorkTitle] = useState("");
  const [workDesc, setWorkDesc] = useState("");
  const [proofLink, setProofLink] = useState("");
  const [workDate, setWorkDate] = useState(moment().format("YYYY-MM-DD"));

  // Admin review modal/inline state
  const [submissionFilter, setSubmissionFilter] = useState("pending");
  const [reviewingItem, setReviewingItem] = useState(null);
  const [reviewPoints, setReviewPoints] = useState("5");
  const [reviewNote, setReviewNote] = useState("");

  // Sync URL when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/dashboard/points?${params.toString()}`, { scroll: false });
  };

  // 1. Fetch User's Points Profile & History
  const { data: mySummaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["myPointsSummary"],
    queryFn: fetchMyPointsSummary,
  });

  // 2. Fetch Live Leaderboard
  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
    isFetching: leaderboardFetching,
  } = useQuery({
    queryKey: ["leaderboard", { month: selectedMonth || undefined }],
    queryFn: fetchLeaderboard,
    placeholderData: keepPreviousData,
  });

  // 3. Fetch User's Own Work Submissions (Members only)
  const { data: mySubmissionsData, isLoading: mySubmissionsLoading } = useQuery(
    {
      queryKey: ["workSubmissions", { scope: "my", limit: 30 }],
      queryFn: fetchWorkSubmissions,
      enabled: !isAdmin,
    },
  );

  // 4. Fetch Admin All Work Submissions (for Approvals tab)
  const { data: adminSubmissionsData, isLoading: adminSubmissionsLoading } =
    useQuery({
      queryKey: [
        "workSubmissions",
        { scope: "all", status: submissionFilter, limit: 50 },
      ],
      queryFn: fetchWorkSubmissions,
      enabled: isAdmin,
    });

  // Real-time socket listener for instant leaderboard & points updates
  useEffect(() => {
    if (!socket) return;

    const handlePointsUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ["myPointsSummary"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["workSubmissions"] });
    };

    socket.on("pointsUpdated", handlePointsUpdated);
    return () => {
      socket.off("pointsUpdated", handlePointsUpdated);
    };
  }, [socket, queryClient]);

  // Submit Extra Work Mutation
  const { mutate: createSubmission, isPending: isSubmittingWork } = useMutation(
    {
      mutationFn: submitExtraWork,
      onSuccess: () => {
        toast.success("Work submitted! Waiting for admin approval.");
        setWorkTitle("");
        setWorkDesc("");
        setProofLink("");
        setWorkDate(moment().format("YYYY-MM-DD"));
        queryClient.invalidateQueries({ queryKey: ["workSubmissions"] });
        queryClient.invalidateQueries({ queryKey: ["myPointsSummary"] });
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message || "Failed to submit extra work",
        );
      },
    },
  );

  // Admin Review Mutation (Approve / Reject)
  const { mutate: submitReview, isPending: isReviewing } = useMutation({
    mutationFn: reviewWorkSubmission,
    onSuccess: (res) => {
      toast.success(res.message || "Submission reviewed");
      setReviewingItem(null);
      setReviewPoints("5");
      setReviewNote("");
      queryClient.invalidateQueries({ queryKey: ["workSubmissions"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["myPointsSummary"] });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed to review submission",
      );
    },
  });

  const handleExtraWorkSubmit = (e) => {
    e.preventDefault();
    if (!workTitle.trim()) {
      toast.warning("Please enter a work title");
      return;
    }
    createSubmission({
      title: workTitle.trim(),
      description: workDesc.trim(),
      proofLink: proofLink.trim(),
      workDate,
    });
  };

  const handleReviewAction = (actionType) => {
    if (!reviewingItem) return;
    if (actionType === "approve") {
      const pts = Number(reviewPoints);
      if (isNaN(pts) || pts <= 0) {
        toast.warning("Please enter a valid positive point amount");
        return;
      }
      submitReview({
        id: reviewingItem._id,
        action: "approve",
        points: pts,
        adminNote: reviewNote,
      });
    } else {
      submitReview({
        id: reviewingItem._id,
        action: "reject",
        points: 0,
        adminNote: reviewNote,
      });
    }
  };

  const summary = mySummaryData?.summary || {};
  const historyLogs = mySummaryData?.history || [];
  const leaderboard = leaderboardData?.leaderboard || [];
  const currentMonthKey =
    leaderboardData?.currentMonthKey || moment().format("YYYY-MM");
  const activePeriod = leaderboardData?.period || currentMonthKey;
  const availableMonths = leaderboardData?.availableMonths || [currentMonthKey];
  const nextResetDate = leaderboardData?.nextResetDate;

  // Find current user's current month rank from leaderboard
  const myLeaderboardEntry = leaderboard.find(
    (entry) =>
      (currentUserEmail && entry.userEmail === currentUserEmail) ||
      (currentUserId && String(entry.userId) === currentUserId),
  );

  const pendingApprovalsCount =
    adminSubmissionsData?.counts?.pending ?? summary.adminPendingTotal ?? 0;

  return (
    <main className="space-y-6">
      {/* Top Header */}
      <section>
        <DashBread title="Work & Points" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-2.5">
              <LuTrophy className="text-warning" /> Work Points & Leaderboard
            </h1>
            <p className="text-sm opacity-60 mt-1">
              Earn automatic points from assigned client tasks, submit extra
              daily work, and compete on the monthly leaderboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {!isAdmin && (
              <button
                type="button"
                onClick={() => handleTabChange("submit")}
                className="btn btn-primary btn-nexoro-primary gap-2 shadow-xs"
              >
                <LuFilePlus className="size-4" /> Submit Extra Work
              </button>
            )}
            {isAdmin && (
              <button
                type="button"
                onClick={() => handleTabChange("approvals")}
                className="btn btn-warning btn-soft gap-2 shadow-xs"
              >
                <LuClock className="size-4" /> Pending Approvals
                {pendingApprovalsCount > 0 && (
                  <span className="badge badge-warning badge-sm font-bold">
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Top Summary Cards (Admin vs Member) */}
      {isAdmin ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Admin Card 1: Pending Approvals */}
          <div className="p-5 rounded-2xl bg-base-100 border border-warning/30 shadow-xs relative overflow-hidden">
            <div className="absolute -right-6 -top-6 size-24 rounded-full bg-warning/10 blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                Pending Work Approvals
              </span>
              <div className="p-2.5 rounded-xl bg-warning/15 text-warning">
                <LuClock className="size-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-warning">
                {adminSubmissionsLoading ? "..." : pendingApprovalsCount}
              </span>
              <span className="text-xs opacity-60">awaiting review</span>
            </div>
            <p className="text-[11px] opacity-60 mt-1.5">
              Review & assign points to member submissions
            </p>
          </div>

          {/* Admin Card 2: Top Ranked Member */}
          <div className="p-5 rounded-2xl bg-base-100 border border-primary/20 shadow-xs relative overflow-hidden">
            <div className="absolute -right-6 -top-6 size-24 rounded-full bg-primary/10 blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                #1 Member ({moment(currentMonthKey, "YYYY-MM").format("MMM")})
              </span>
              <div className="p-2.5 rounded-xl bg-primary/15 text-primary">
                <LuCrown className="size-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-extrabold truncate">
                {leaderboardLoading
                  ? "..."
                  : leaderboard[0]?.totalPoints > 0
                    ? leaderboard[0].userName
                    : "No leader yet"}
              </span>
            </div>
            <p className="text-[11px] opacity-60 mt-1.5">
              {leaderboard[0]?.totalPoints || 0} pts earned this month
            </p>
          </div>

          {/* Admin Card 3: Total Active Members */}
          <div className="p-5 rounded-2xl bg-base-100 border border-base-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                Ranked Team Members
              </span>
              <div className="p-2.5 rounded-xl bg-success/15 text-success">
                <LuUser className="size-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">
                {leaderboardLoading ? "..." : leaderboard.length}
              </span>
              <span className="text-xs opacity-60">members</span>
            </div>
            <p className="text-[11px] opacity-60 mt-1.5">
              Competing on the monthly leaderboard
            </p>
          </div>

          {/* Admin Card 4: Approved Works Count */}
          <div className="p-5 rounded-2xl bg-base-100 border border-base-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                Approved Extra Works
              </span>
              <div className="p-2.5 rounded-xl bg-info/15 text-info">
                <LuCircleCheck className="size-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">
                {adminSubmissionsLoading
                  ? "..."
                  : adminSubmissionsData?.counts?.approved || 0}
              </span>
              <span className="text-xs opacity-60">approved</span>
            </div>
            <p className="text-[11px] opacity-60 mt-1.5">
              Total extra work submissions approved
            </p>
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: This Month's Points */}
          <div className="p-5 rounded-2xl bg-base-100 border border-primary/20 shadow-xs relative overflow-hidden">
            <div className="absolute -right-6 -top-6 size-24 rounded-full bg-primary/10 blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                This Month&apos;s Points
              </span>
              <div className="p-2.5 rounded-xl bg-primary/15 text-primary">
                <LuFlame className="size-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary">
                {summaryLoading ? "..." : summary.monthlyPoints || 0}
              </span>
              <span className="text-xs font-semibold opacity-60">pts</span>
            </div>
            <p className="text-[11px] opacity-60 mt-1.5">
              Projects: +{summary.monthlyProjectPoints || 0} • Extra: +
              {summary.monthlyExtraPoints || 0}
            </p>
          </div>

          {/* Card 2: Current Monthly Rank */}
          <div className="p-5 rounded-2xl bg-base-100 border border-warning/25 shadow-xs relative overflow-hidden">
            <div className="absolute -right-6 -top-6 size-24 rounded-full bg-warning/10 blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                Current Rank ({moment(currentMonthKey, "YYYY-MM").format("MMM")}
                )
              </span>
              <div className="p-2.5 rounded-xl bg-warning/15 text-warning">
                <LuCrown className="size-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-warning">
                {leaderboardLoading
                  ? "..."
                  : myLeaderboardEntry
                    ? `#${myLeaderboardEntry.rank}`
                    : "—"}
              </span>
              <span className="text-xs opacity-60">
                of {leaderboard.length} members
              </span>
            </div>
            <p className="text-[11px] opacity-60 mt-1.5">
              Resets automatically on{" "}
              {nextResetDate
                ? moment(nextResetDate).format("MMM 1, YYYY")
                : "1st of next month"}
            </p>
          </div>

          {/* Card 3: All-Time Total Points */}
          <div className="p-5 rounded-2xl bg-base-100 border border-base-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                All-Time Career Points
              </span>
              <div className="p-2.5 rounded-xl bg-success/15 text-success">
                <LuAward className="size-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">
                {summaryLoading ? "..." : summary.allTimePoints || 0}
              </span>
              <span className="text-xs font-semibold opacity-60">
                total pts
              </span>
            </div>
            <p className="text-[11px] opacity-60 mt-1.5">
              {summary.completedProjects || 0} Completed Projects •{" "}
              {summary.approvedExtraWorks || 0} Extra Works
            </p>
          </div>

          {/* Card 4: Pending Submissions */}
          <div className="p-5 rounded-2xl bg-base-100 border border-base-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                My Pending Work
              </span>
              <div className="p-2.5 rounded-xl bg-info/15 text-info">
                <LuClock className="size-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">
                {summaryLoading ? "..." : summary.pendingSubmissionsCount || 0}
              </span>
              <span className="text-xs opacity-60">submissions</span>
            </div>
            <p className="text-[11px] opacity-60 mt-1.5">
              Waiting for admin review & points
            </p>
          </div>
        </section>
      )}

      {/* Navigation Tabs */}
      <section className="flex flex-wrap items-center justify-between gap-3 bg-base-100 p-2.5 rounded-2xl border border-base-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleTabChange("leaderboard")}
            className={`btn btn-sm rounded-xl gap-2 ${
              activeTab === "leaderboard"
                ? "btn-primary bg-main border-main text-white shadow-xs"
                : "btn-ghost"
            }`}
          >
            <LuTrophy className="size-4" /> Live Leaderboard
          </button>

          {!isAdmin && (
            <>
              <button
                type="button"
                onClick={() => handleTabChange("overview")}
                className={`btn btn-sm rounded-xl gap-2 ${
                  activeTab === "overview"
                    ? "btn-primary bg-main border-main text-white shadow-xs"
                    : "btn-ghost"
                }`}
              >
                <LuHistory className="size-4" /> My Points & History
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("submit")}
                className={`btn btn-sm rounded-xl gap-2 ${
                  activeTab === "submit"
                    ? "btn-primary bg-main border-main text-white shadow-xs"
                    : "btn-ghost"
                }`}
              >
                <LuFilePlus className="size-4" /> Extra / Daily Work
                {summary.pendingSubmissionsCount > 0 && (
                  <span className="badge badge-xs badge-warning font-bold">
                    {summary.pendingSubmissionsCount}
                  </span>
                )}
              </button>
            </>
          )}

          {isAdmin && (
            <button
              type="button"
              onClick={() => handleTabChange("approvals")}
              className={`btn btn-sm rounded-xl gap-2 ${
                activeTab === "approvals"
                  ? "btn-primary bg-main border-main text-white shadow-xs"
                  : "btn-ghost"
              }`}
            >
              <LuCircleCheck className="size-4" /> Admin Approvals
              {pendingApprovalsCount > 0 && (
                <span className="badge badge-xs badge-error text-white font-bold">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Auto-reset info pill */}
        <div className="px-3 py-1 rounded-xl bg-base-200/80 text-[11px] flex items-center gap-1.5 font-medium opacity-80">
          <LuRefreshCw className="size-3.5 text-primary" />
          <span>Monthly Leaderboard Auto-Resets on the 1st of Every Month</span>
        </div>
      </section>

      {/* =====================================================================
          TAB 1: LIVE LEADERBOARD & RANKING
      ===================================================================== */}
      {activeTab === "leaderboard" && (
        <section className="space-y-6">
          {/* Period Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-4 rounded-2xl border border-base-200">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <LuCrown className="text-warning size-5" />
                  {formatMonthLabel(activePeriod)}
                </h2>
                {activePeriod === currentMonthKey && (
                  <span className="badge badge-success badge-sm gap-1 font-semibold">
                    <span className="size-1.5 rounded-full bg-current animate-ping" />
                    Live Month
                  </span>
                )}
                {leaderboardFetching && !leaderboardLoading && (
                  <span className="loading loading-spinner loading-xs text-primary" />
                )}
              </div>
              <p className="text-xs opacity-60 mt-0.5">
                Rankings are calculated in real-time based on completed client
                projects and approved extra work.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold opacity-60 whitespace-nowrap">
                Period:
              </span>
              <select
                className="select select-sm select-bordered bg-base-100 font-medium"
                value={selectedMonth || currentMonthKey}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {availableMonths.map((m) => (
                  <option key={m} value={m}>
                    {formatMonthLabel(m)}{" "}
                    {m === currentMonthKey ? "(Current)" : ""}
                  </option>
                ))}
                <option value="all_time">All-Time Ranking</option>
              </select>
            </div>
          </div>

          {/* Top 3 Podium Cards */}
          {leaderboard.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {leaderboard.slice(0, 3).map((member, index) => {
                const isFirst = index === 0;
                const isSecond = index === 1;
                const medalStyles = isFirst
                  ? {
                      border: "border-warning/50 ring-1 ring-warning/30",
                      bg: "bg-linear-to-b from-warning/15 via-base-100 to-base-100",
                      badge: "badge-warning text-warning-content",
                      label: "1st Place",
                      icon: <LuTrophy className="size-3" />,
                    }
                  : isSecond
                    ? {
                        border: "border-base-content/25",
                        bg: "bg-linear-to-b from-base-content/10 via-base-100 to-base-100",
                        badge: "badge-neutral",
                        label: "2nd Place",
                        icon: <LuMedal className="size-3" />,
                      }
                    : {
                        border: "border-amber-700/30",
                        bg: "bg-linear-to-b from-amber-700/10 via-base-100 to-base-100",
                        badge: "badge-accent",
                        label: "3rd Place",
                        icon: <LuAward className="size-3" />,
                      };

                return (
                  <div
                    key={member.userId || member.userEmail || index}
                    className={`p-5 rounded-2xl border shadow-xs ${medalStyles.border} ${medalStyles.bg} flex flex-col justify-between gap-4`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="size-12 rounded-full bg-base-300 ring-2 ring-primary/20 flex items-center justify-center overflow-hidden">
                            {member.profilePic ? (
                              <img
                                src={member.profilePic}
                                alt={member.userName}
                                className="object-cover size-full"
                              />
                            ) : (
                              <span className="text-lg font-bold uppercase flex items-center justify-center size-full">
                                {(member.userName || "M").charAt(0)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <span
                            className={`badge badge-xs font-bold gap-1 ${medalStyles.badge} mb-1`}
                          >
                            {medalStyles.icon}
                            {medalStyles.label}
                          </span>
                          <h3 className="font-bold text-base leading-tight">
                            {member.userName}
                          </h3>
                          <p className="text-xs opacity-60">{member.role}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-2xl font-extrabold text-primary block leading-none">
                          {member.totalPoints}
                        </span>
                        <span className="text-[10px] uppercase font-bold opacity-50">
                          Points
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-base-200 text-xs">
                      <div className="bg-base-200/60 p-2 rounded-lg">
                        <span className="opacity-60 block text-[10px]">
                          Client Projects
                        </span>
                        <span className="font-bold">
                          {member.completedProjectsCount} (+
                          {member.projectPoints} pts)
                        </span>
                      </div>
                      <div className="bg-base-200/60 p-2 rounded-lg">
                        <span className="opacity-60 block text-[10px]">
                          Extra Work
                        </span>
                        <span className="font-bold">
                          {member.extraWorksCount} (+{member.extraWorkPoints}{" "}
                          pts)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full Ranking Table */}
          <div className="bg-base-100 rounded-2xl border border-base-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-200/70 text-xs uppercase font-bold opacity-70">
                    <th>Rank</th>
                    <th>Member</th>
                    <th>Project Points</th>
                    <th>Extra Work Points</th>
                    <th>Total Points</th>
                    <th>Last Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardLoading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12">
                        <span className="loading loading-spinner loading-md text-primary" />
                      </td>
                    </tr>
                  ) : leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 opacity-60">
                        No members found for this period.
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((member) => {
                      const isMe =
                        (currentUserEmail &&
                          member.userEmail === currentUserEmail) ||
                        (currentUserId &&
                          String(member.userId) === currentUserId);

                      return (
                        <tr
                          key={member.userId || member.userEmail}
                          className={`border-b border-base-200/60 transition-colors ${
                            isMe
                              ? "bg-primary/5 font-medium"
                              : "hover:bg-base-200/40"
                          }`}
                        >
                          <td>
                            <div className="flex items-center gap-1.5 font-bold">
                              {member.rank === 1 ? (
                                <span className="badge badge-warning badge-sm font-extrabold gap-1">
                                  #1 <LuTrophy className="size-3" />
                                </span>
                              ) : member.rank === 2 ? (
                                <span className="badge badge-neutral badge-sm font-bold gap-1">
                                  #2 <LuMedal className="size-3" />
                                </span>
                              ) : member.rank === 3 ? (
                                <span className="badge badge-accent badge-sm font-bold gap-1">
                                  #3 <LuAward className="size-3" />
                                </span>
                              ) : (
                                <span className="px-2 text-sm opacity-70">
                                  #{member.rank}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="size-9 rounded-full bg-base-300 flex items-center justify-center overflow-hidden">
                                  {member.profilePic ? (
                                    <img
                                      src={member.profilePic}
                                      alt={member.userName}
                                    />
                                  ) : (
                                    <span className="text-xs font-bold uppercase flex items-center justify-center size-full">
                                      {(member.userName || "M").charAt(0)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="font-bold flex items-center gap-1.5">
                                  <span>{member.userName}</span>
                                  {isMe && (
                                    <span className="badge badge-primary badge-xs">
                                      You
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs opacity-60">
                                  {member.role}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="font-semibold">
                              +{member.projectPoints} pts
                            </span>
                            <span className="text-xs opacity-50 block">
                              {member.completedProjectsCount} completed
                            </span>
                          </td>
                          <td>
                            <span className="font-semibold">
                              +{member.extraWorkPoints} pts
                            </span>
                            <span className="text-xs opacity-50 block">
                              {member.extraWorksCount} approved
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-primary badge-soft font-extrabold text-sm py-3 px-3">
                              {member.totalPoints} pts
                            </span>
                          </td>
                          <td className="text-xs opacity-60">
                            {member.lastEarnedAt
                              ? moment(member.lastEarnedAt).fromNow()
                              : "No points yet"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          TAB 2: MY POINTS & HISTORY (Members Only)
      ===================================================================== */}
      {activeTab === "overview" && !isAdmin && (
        <section className="bg-base-100 rounded-2xl border border-base-200 p-5 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-base-200">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <LuHistory className="text-primary" /> My Points History
              </h2>
              <p className="text-xs opacity-60">
                Complete log of points earned from assigned client tasks and
                approved extra work.
              </p>
            </div>
            <span className="badge badge-neutral badge-sm font-semibold">
              {historyLogs.length} Records
            </span>
          </div>

          {summaryLoading ? (
            <div className="py-12 text-center">
              <span className="loading loading-spinner loading-md text-primary" />
            </div>
          ) : historyLogs.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <LuAward className="size-10 mx-auto opacity-30" />
              <h3 className="font-bold text-base">No Points History Yet</h3>
              <p className="text-xs opacity-60 max-w-sm mx-auto">
                Complete your assigned project tasks or submit extra daily work
                to start earning points!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {historyLogs.map((log) => {
                const isReverted = log.status === "reverted";
                const isProject = log.type === "project_completed";

                return (
                  <div
                    key={log._id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-colors ${
                      isReverted
                        ? "bg-error/5 border-error/20 opacity-75"
                        : "bg-base-200/40 border-base-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                          isReverted
                            ? "bg-error/15 text-error"
                            : isProject
                              ? "bg-primary/15 text-primary"
                              : "bg-success/15 text-success"
                        }`}
                      >
                        {isReverted ? (
                          <LuCircleX className="size-5" />
                        ) : isProject ? (
                          <LuBriefcase className="size-5" />
                        ) : (
                          <LuSparkles className="size-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={`font-bold text-sm ${
                              isReverted ? "line-through opacity-75" : ""
                            }`}
                          >
                            {log.title}
                          </h3>
                          <span className="badge badge-xs badge-ghost font-semibold uppercase">
                            {isProject ? "Client Task" : "Extra Work"}
                          </span>
                          {isReverted && (
                            <span className="badge badge-xs badge-error text-white font-semibold">
                              Reverted (-{log.points} pts)
                            </span>
                          )}
                        </div>
                        {log.description && (
                          <p className="text-xs opacity-70 mt-0.5">
                            {log.description}
                          </p>
                        )}
                        {isReverted && log.revertReason && (
                          <p className="text-[11px] text-error mt-0.5 font-medium">
                            Reason: {log.revertReason}
                          </p>
                        )}
                        <p className="text-[11px] opacity-50 mt-1">
                          {moment(log.createdAt).format("LLL")} • Month:{" "}
                          {log.monthKey}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end shrink-0">
                      {isReverted ? (
                        <span className="badge badge-error badge-soft font-bold text-xs py-3 px-3">
                          -{log.points} pts (Unchecked)
                        </span>
                      ) : (
                        <span className="badge badge-success badge-soft font-extrabold text-sm py-3 px-3">
                          +{log.points} pts
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          TAB 3: EXTRA / DAILY WORK SUBMISSION & MY SUBMISSIONS (Members Only)
      ===================================================================== */}
      {activeTab === "submit" && !isAdmin && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Submission Form */}
          <div className="lg:col-span-5 bg-base-100 p-5 rounded-2xl border border-base-200 shadow-xs">
            <h2 className="text-lg font-bold flex items-center gap-2 pb-3 border-b border-base-200">
              <LuFilePlus className="text-primary" /> Submit Extra / Daily Work
            </h2>
            <p className="text-xs opacity-60 mt-2">
              Did extra work outside assigned client orders? Submit it here.
              Once approved by Admin, points will be added to your profile and
              leaderboard!
            </p>

            <form onSubmit={handleExtraWorkSubmit} className="space-y-4 mt-4">
              <div>
                <label className="label py-1 text-xs font-bold uppercase opacity-75">
                  Work Title *
                </label>
                <input
                  type="text"
                  required
                  value={workTitle}
                  onChange={(e) => setWorkTitle(e.target.value)}
                  placeholder="e.g., Designed 3 promotional banners for social media"
                  className="input input-bordered w-full text-sm"
                />
              </div>

              <div>
                <label className="label py-1 text-xs font-bold uppercase opacity-75">
                  Work Date
                </label>
                <input
                  type="date"
                  value={workDate}
                  onChange={(e) => setWorkDate(e.target.value)}
                  className="input input-bordered w-full text-sm"
                />
              </div>

              <div>
                <label className="label py-1 text-xs font-bold uppercase opacity-75">
                  Proof / Live / Drive Link (Optional)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={proofLink}
                    onChange={(e) => setProofLink(e.target.value)}
                    placeholder="https://drive.google.com/... or GitHub/Live URL"
                    className="input input-bordered w-full text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="label py-1 text-xs font-bold uppercase opacity-75">
                  Work Details / Description
                </label>
                <textarea
                  rows={4}
                  value={workDesc}
                  onChange={(e) => setWorkDesc(e.target.value)}
                  placeholder="Briefly describe what you accomplished..."
                  className="textarea textarea-bordered w-full text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingWork || !workTitle.trim()}
                className="btn btn-primary btn-nexoro-primary w-full gap-2"
              >
                {isSubmittingWork ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <LuSend className="size-4" /> Submit for Admin Approval
                  </>
                )}
              </button>
            </form>
          </div>

          {/* My Submitted Extra Works Status List */}
          <div className="lg:col-span-7 bg-base-100 p-5 rounded-2xl border border-base-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <div>
                <h2 className="text-lg font-bold">My Submitted Extra Work</h2>
                <p className="text-xs opacity-60">
                  Track approval status and points awarded by Admin.
                </p>
              </div>
              <span className="badge badge-neutral badge-sm">
                {mySubmissionsData?.submissions?.length || 0} Total
              </span>
            </div>

            {mySubmissionsLoading ? (
              <div className="py-12 text-center">
                <span className="loading loading-spinner loading-md text-primary" />
              </div>
            ) : !mySubmissionsData?.submissions?.length ? (
              <div className="py-12 text-center opacity-60 text-sm">
                You haven&apos;t submitted any extra work yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                {mySubmissionsData.submissions.map((item) => {
                  const status = item.status || "Pending";
                  const isApproved = status === "Approved";
                  const isRejected = status === "Rejected";

                  return (
                    <div
                      key={item._id}
                      className="p-4 rounded-xl bg-base-200/50 border border-base-200 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-sm">{item.title}</h3>
                            <span
                              className={`badge badge-xs font-bold ${
                                isApproved
                                  ? "badge-success"
                                  : isRejected
                                    ? "badge-error"
                                    : "badge-warning"
                              }`}
                            >
                              {status}
                            </span>
                          </div>
                          <p className="text-[11px] opacity-50 mt-0.5">
                            Work Date: {moment(item.workDate).format("LL")} •
                            Submitted {moment(item.createdAt).fromNow()}
                          </p>
                        </div>

                        {isApproved && (
                          <span className="badge badge-success badge-soft font-extrabold text-xs py-2.5 px-2.5 shrink-0">
                            +{item.awardedPoints} pts
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-xs opacity-75 whitespace-pre-line">
                          {item.description}
                        </p>
                      )}

                      {item.proofLink && (
                        <div>
                          <a
                            href={item.proofLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                          >
                            <LuExternalLink className="size-3" /> View Proof /
                            Deliverable Link
                          </a>
                        </div>
                      )}

                      {item.adminNote && (
                        <div className="p-2 rounded-lg bg-base-100 border border-base-300 text-xs">
                          <span className="font-semibold opacity-70">
                            Admin Note:{" "}
                          </span>
                          <span>{item.adminNote}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* =====================================================================
          TAB 4: ADMIN PENDING APPROVALS & POINT ASSIGNMENT PANEL
      ===================================================================== */}
      {activeTab === "approvals" && isAdmin && (
        <section className="bg-base-100 p-5 rounded-2xl border border-base-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-base-200">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <LuCircleCheck className="text-primary" /> Extra Work Review &
                Point Approval
              </h2>
              <p className="text-xs opacity-60 mt-0.5">
                Review member submissions, assign custom points, and approve to
                immediately credit their profile.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                {
                  id: "pending",
                  label: `Pending (${adminSubmissionsData?.counts?.pending || 0})`,
                },
                {
                  id: "approved",
                  label: `Approved (${adminSubmissionsData?.counts?.approved || 0})`,
                },
                {
                  id: "rejected",
                  label: `Rejected (${adminSubmissionsData?.counts?.rejected || 0})`,
                },
                {
                  id: "all",
                  label: `All (${adminSubmissionsData?.counts?.all || 0})`,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSubmissionFilter(tab.id)}
                  className={`btn btn-xs rounded-lg ${
                    submissionFilter === tab.id
                      ? "btn-primary bg-main border-main text-white"
                      : "btn-soft"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {adminSubmissionsLoading ? (
            <div className="py-14 text-center">
              <span className="loading loading-spinner loading-md text-primary" />
            </div>
          ) : !adminSubmissionsData?.submissions?.length ? (
            <div className="py-14 text-center space-y-2">
              <LuCircleCheck className="size-10 mx-auto text-success opacity-40" />
              <h3 className="font-bold text-base">
                No {submissionFilter !== "all" ? submissionFilter : ""}{" "}
                submissions found
              </h3>
              <p className="text-xs opacity-60">
                All caught up! New member submissions will appear here in
                real-time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminSubmissionsData.submissions.map((sub) => {
                const isPending = sub.status === "Pending";
                const isApproved = sub.status === "Approved";
                const isRejected = sub.status === "Rejected";
                const isSelectedForReview = reviewingItem?._id === sub._id;

                return (
                  <div
                    key={sub._id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                      isPending
                        ? "bg-base-100 border-warning/40 shadow-xs"
                        : "bg-base-200/40 border-base-200"
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="badge badge-xs badge-primary badge-soft font-bold mb-1">
                            {sub.userName} ({sub.userEmail})
                          </span>
                          <h3 className="font-bold text-base leading-snug">
                            {sub.title}
                          </h3>
                        </div>
                        <span
                          className={`badge badge-sm font-bold shrink-0 ${
                            isApproved
                              ? "badge-success"
                              : isRejected
                                ? "badge-error"
                                : "badge-warning"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      {sub.description && (
                        <p className="text-xs opacity-80 bg-base-200/60 p-2.5 rounded-lg whitespace-pre-line">
                          {sub.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs opacity-65">
                        <span>
                          Work Date:{" "}
                          {moment(sub.workDate).format("MMM DD, YYYY")}
                        </span>
                        <span>Submitted {moment(sub.createdAt).fromNow()}</span>
                      </div>

                      {sub.proofLink && (
                        <div>
                          <a
                            href={sub.proofLink}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-xs btn-outline btn-primary gap-1.5"
                          >
                            <LuExternalLink className="size-3" /> Open Proof
                            Link
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Review Controls for Pending Submissions */}
                    {isPending ? (
                      <div className="pt-3 border-t border-base-200">
                        {isSelectedForReview ? (
                          <div className="space-y-3 bg-base-200/70 p-3 rounded-xl border border-primary/20">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div>
                                <label className="text-[11px] font-bold uppercase opacity-75 block mb-1">
                                  Award Points *
                                </label>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    min={1}
                                    value={reviewPoints}
                                    onChange={(e) =>
                                      setReviewPoints(e.target.value)
                                    }
                                    className="input input-sm input-bordered w-full font-bold"
                                    placeholder="e.g. 5"
                                  />
                                  {[3, 5, 10].map((preset) => (
                                    <button
                                      key={preset}
                                      type="button"
                                      onClick={() =>
                                        setReviewPoints(String(preset))
                                      }
                                      className="btn btn-xs btn-soft btn-primary"
                                    >
                                      +{preset}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="text-[11px] font-bold uppercase opacity-75 block mb-1">
                                  Admin Note (Optional)
                                </label>
                                <input
                                  type="text"
                                  value={reviewNote}
                                  onChange={(e) =>
                                    setReviewNote(e.target.value)
                                  }
                                  placeholder="Great job!"
                                  className="input input-sm input-bordered w-full"
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setReviewingItem(null)}
                                className="btn btn-xs btn-ghost"
                                disabled={isReviewing}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReviewAction("reject")}
                                disabled={isReviewing}
                                className="btn btn-xs btn-error btn-outline gap-1"
                              >
                                <LuX className="size-3.5" /> Reject
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReviewAction("approve")}
                                disabled={isReviewing}
                                className="btn btn-xs btn-success gap-1 font-bold"
                              >
                                <LuCheck className="size-3.5" /> Approve & Add +
                                {reviewPoints || 0} Pts
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs opacity-60">
                              Ready for review
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setReviewingItem(sub);
                                setReviewPoints("5");
                                setReviewNote("");
                              }}
                              className="btn btn-sm btn-primary btn-nexoro-primary gap-1.5"
                            >
                              <LuAward className="size-4" /> Review & Give
                              Points
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="pt-3 border-t border-base-200 flex items-center justify-between text-xs">
                        <span className="opacity-60">
                          Reviewed by {sub.reviewedBy || "Admin"}{" "}
                          {sub.reviewedAt
                            ? moment(sub.reviewedAt).fromNow()
                            : ""}
                        </span>
                        {isApproved && (
                          <span className="badge badge-success badge-soft font-bold">
                            +{sub.awardedPoints} pts awarded
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default function PointsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 flex flex-col items-center justify-center gap-3">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="text-sm opacity-60">Loading points & leaderboard...</p>
        </div>
      }
    >
      <PointsAndLeaderboardContent />
    </Suspense>
  );
}
