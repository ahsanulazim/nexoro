"use client";

import { useEffect } from "react";
import Link from "next/link";
import moment from "moment";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLeaderboard, fetchMyPointsSummary } from "@/api/fetchPoints";
import { useAuth } from "@/context/AuthProvider";
import { useSocket } from "@/context/SocketProvider";
import {
  LuAward,
  LuCrown,
  LuFilePlus,
  LuFlame,
  LuTrophy,
} from "react-icons/lu";

const LiveLeaderboardWidget = () => {
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const isAdmin = currentUser?.user?.role === "admin";
  const currentUserEmail = currentUser?.user?.email?.toLowerCase() || "";
  const currentUserId = currentUser?.user?._id
    ? String(currentUser.user._id)
    : "";

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ["leaderboard", {}],
    queryFn: fetchLeaderboard,
  });

  const { data: mySummaryData } = useQuery({
    queryKey: ["myPointsSummary"],
    queryFn: fetchMyPointsSummary,
  });

  useEffect(() => {
    if (!socket) return;
    const handlePointsUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["myPointsSummary"] });
    };
    socket.on("pointsUpdated", handlePointsUpdated);
    return () => {
      socket.off("pointsUpdated", handlePointsUpdated);
    };
  }, [socket, queryClient]);

  const leaderboard = leaderboardData?.leaderboard || [];
  const topMembers = leaderboard.slice(0, 5);
  const currentMonthKey =
    leaderboardData?.currentMonthKey || moment().format("YYYY-MM");
  const monthName = moment(currentMonthKey, "YYYY-MM").format("MMMM YYYY");
  const summary = mySummaryData?.summary || {};
  const adminPendingCount = summary.adminPendingTotal || 0;

  return (
    <div className="bg-base-100 rounded-box p-5 border border-base-200 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-base-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="uppercase text-sm font-bold tracking-wider flex items-center gap-2">
              <LuTrophy className="text-warning size-4" /> Monthly Leaderboard (
              {monthName})
            </h3>
            <span className="badge badge-success badge-xs font-bold gap-1">
              <span className="size-1.5 rounded-full bg-current animate-ping" />
              Live
            </span>
          </div>
          <p className="text-xs opacity-60 mt-0.5">
            Top performing members this month • Resets automatically on the 1st
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAdmin ? (
            <Link href="/dashboard/points?tab=approvals">
              <button className="btn btn-xs btn-warning font-bold gap-1">
                Pending Approvals ({adminPendingCount})
              </button>
            </Link>
          ) : (
            <Link href="/dashboard/points?tab=submit">
              <button className="btn btn-xs btn-outline btn-primary gap-1">
                <LuFilePlus className="size-3.5" /> Submit Extra Work
              </button>
            </Link>
          )}
          <Link href="/dashboard/points">
            <button className="btn btn-xs btn-soft btn-accent">
              Full Leaderboard
            </button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
      ) : topMembers.length === 0 ? (
        <div className="text-center py-6 text-xs opacity-60">
          No points recorded for this month yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {topMembers.map((member) => {
            const isMe =
              (currentUserEmail && member.userEmail === currentUserEmail) ||
              (currentUserId && String(member.userId) === currentUserId);
            const isFirst = member.rank === 1;

            return (
              <div
                key={member.userId || member.userEmail}
                className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 transition-all ${
                  isFirst
                    ? "bg-linear-to-b from-warning/15 to-base-100 border-warning/40 shadow-xs"
                    : isMe
                      ? "bg-primary/5 border-primary/30"
                      : "bg-base-200/50 border-base-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`badge badge-xs font-extrabold gap-1 ${
                      member.rank === 1
                        ? "badge-warning"
                        : member.rank === 2
                          ? "badge-neutral"
                          : member.rank === 3
                            ? "badge-accent"
                            : "badge-ghost"
                    }`}
                  >
                    #{member.rank}
                    {member.rank === 1 && <LuTrophy className="size-3" />}
                  </span>
                  <span className="text-xs font-extrabold text-primary flex items-center gap-0.5">
                    <LuFlame className="size-3.5 text-warning" />
                    {member.totalPoints} pts
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="avatar">
                    <div className="size-8 rounded-full bg-base-300 flex items-center justify-center overflow-hidden">
                      {member.profilePic ? (
                        <img src={member.profilePic} alt={member.userName} />
                      ) : (
                        <span className="text-xs font-bold uppercase flex items-center justify-center size-full">
                          {(member.userName || "M").charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs truncate">
                      {member.userName} {isMe && "(You)"}
                    </h4>
                    <p className="text-[10px] opacity-60 truncate">
                      {member.completedProjectsCount} tasks •{" "}
                      {member.extraWorksCount} extra
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LiveLeaderboardWidget;

