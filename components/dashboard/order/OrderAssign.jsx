"use client";

import { assignOrder } from "@/api/fetchOrder";
import { useAuth } from "@/context/AuthProvider";
import { MyContext } from "@/context/MyProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import {
  LuAward,
  LuBanknote,
  LuPercent,
  LuPlus,
  LuTrash2,
  LuUserCheck,
  LuUsers,
} from "react-icons/lu";
import { toast } from "react-toastify";

const OrderAssign = ({ order }) => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.user?.role === "admin";
  const isMember = currentUser?.user?.role === "member";
  const currentUserId = currentUser?.user?._id
    ? String(currentUser.user._id)
    : "";

  const { assignableUsers, assignableUsersLoading, assignableUsersError } =
    useContext(MyContext);

  const orderPrice =
    Number(order?.price) ||
    Number(order?.servicePrice) ||
    Number(order?.amount) ||
    0;

  // State for multiple assigned members with split rates
  const [assignedMembers, setAssignedMembers] = useState(
    isMember
      ? [
          {
            memberId: currentUserId,
            rateType: "percentage",
            rateValue: 100,
          },
        ]
      : [
          {
            memberId: "",
            rateType: "percentage",
            rateValue: 0,
          },
        ],
  );

  const [rewardPoints, setRewardPoints] = useState(order?.rewardPoints ?? 5);
  const [tasks, setTasks] = useState([{ task: "", isCompleted: false }]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: assignOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["myPointsSummary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      toast.success(
        isMember
          ? "Order assigned to yourself successfully"
          : "Order assigned successfully with member split rates!",
      );
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to assign order");
    },
  });

  // Helper for Member row actions
  const handleAddMemberRow = () => {
    setAssignedMembers((prev) => [
      ...prev,
      { memberId: "", rateType: "percentage", rateValue: 0 },
    ]);
  };

  const handleRemoveMemberRow = (index) => {
    if (assignedMembers.length <= 1) return;
    setAssignedMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index, field, value) => {
    setAssignedMembers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Helper for Task row actions
  const handleAddTaskRow = () => {
    setTasks((prev) => [...prev, { task: "", isCompleted: false }]);
  };

  const handleRemoveTaskRow = (index) => {
    if (tasks.length <= 1) return;
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTaskTextChange = (index, value) => {
    setTasks((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], task: value };
      return copy;
    });
  };

  // Calculate total allocated payout across all assigned members
  const totalAllocatedPayout = assignedMembers.reduce((acc, m) => {
    if (!m.memberId) return acc;
    const val = Math.max(0, Number(m.rateValue) || 0);
    const amount =
      m.rateType === "percentage" ? Math.round(orderPrice * (val / 100)) : val;
    return acc + amount;
  }, 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validMembers = isMember
      ? [
          {
            memberId: currentUserId,
            rateType: "percentage",
            rateValue: 100,
          },
        ]
      : assignedMembers.filter((m) => m.memberId && String(m.memberId).trim());

    if (validMembers.length === 0) {
      toast.error("Please select at least one member to assign");
      return;
    }

    const validTasks = tasks
      .filter((t) => t.task && String(t.task).trim())
      .map((t) => ({
        task: String(t.task).trim(),
        isCompleted: Boolean(t.isCompleted),
      }));

    if (validTasks.length === 0) {
      toast.error("Please provide at least one valid task");
      return;
    }

    const payload = {
      assignedTo: validMembers[0].memberId,
      assignedMembers: validMembers.map((m) => ({
        memberId: m.memberId,
        rateType: m.rateType || "percentage",
        rateValue: Math.max(0, Number(m.rateValue) || 0),
      })),
      rewardPoints: isAdmin ? Math.max(0, Number(rewardPoints ?? 5)) : 5,
      tasks: validTasks,
    };

    mutate({ orderId: order._id, value: payload });
  };

  const hasValidTask = tasks.some((t) => t?.task?.trim());
  const hasValidMember = isMember
    ? true
    : assignedMembers.some((m) => m.memberId && String(m.memberId).trim());

  return (
    <form className="fieldset mt-5 space-y-4" onSubmit={handleSubmit}>
      {/* Order Value Header */}
      <div className="p-3.5 rounded-xl bg-base-200/70 border border-base-300 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">
            Order Value
          </span>
          <span className="text-base font-bold text-primary">
            ৳{orderPrice.toLocaleString()}
          </span>
        </div>
        {isAdmin && totalAllocatedPayout > 0 && (
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">
              Total Assigned Payout
            </span>
            <span
              className={`text-sm font-bold ${
                totalAllocatedPayout > orderPrice
                  ? "text-error"
                  : "text-success"
              }`}
            >
              ৳{totalAllocatedPayout.toLocaleString()} (
              {orderPrice > 0
                ? `${Math.round((totalAllocatedPayout / orderPrice) * 100)}%`
                : "0%"}
              )
            </span>
          </div>
        )}
      </div>

      {/* Member Assignment Section */}
      {isMember ? (
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
              <LuUserCheck className="size-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">
                Assignee (Self-Assign)
              </span>
              <span className="text-xs font-semibold text-base-content">
                {currentUser?.user?.name ||
                  currentUser?.user?.displayName ||
                  currentUser?.user?.email}{" "}
                (You)
              </span>
            </div>
          </div>
          <span className="badge badge-primary badge-sm font-semibold">
            Creator
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
              <LuUsers className="size-4 text-primary" /> Assign Team Members & Payout Rates
            </label>
            <button
              type="button"
              onClick={handleAddMemberRow}
              className="btn btn-xs btn-primary btn-soft gap-1"
            >
              <LuPlus className="size-3" /> Add Member
            </button>
          </div>

          <div className="space-y-2.5">
            {assignedMembers.map((memberRow, index) => {
              const rateVal = Math.max(0, Number(memberRow.rateValue) || 0);
              const previewEarning =
                memberRow.rateType === "percentage"
                  ? Math.round(orderPrice * (rateVal / 100))
                  : rateVal;

              return (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-base-200/50 border border-base-300 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-base-content/70">
                      Member #{index + 1}
                    </span>
                    {assignedMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMemberRow(index)}
                        className="btn btn-xs btn-ghost text-error btn-circle"
                        title="Remove member"
                      >
                        <LuTrash2 className="size-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    {/* Member Select */}
                    <div className="sm:col-span-6">
                      <select
                        className="select select-bordered select-sm w-full"
                        value={memberRow.memberId}
                        onChange={(e) =>
                          handleMemberChange(index, "memberId", e.target.value)
                        }
                      >
                        <option value="">Select Member / Admin</option>
                        {assignableUsersLoading ? (
                          <option value="" disabled>
                            Loading users...
                          </option>
                        ) : assignableUsersError || !assignableUsers?.length ? (
                          <option value="" disabled>
                            No members available
                          </option>
                        ) : (
                          assignableUsers.map((u) => (
                            <option key={u._id} value={u._id}>
                              {u.name || u.email} ({u.role})
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    {/* Rate Type (Percentage vs Flat) */}
                    <div className="sm:col-span-3">
                      <select
                        className="select select-bordered select-sm w-full"
                        value={memberRow.rateType}
                        onChange={(e) =>
                          handleMemberChange(index, "rateType", e.target.value)
                        }
                      >
                        <option value="percentage">% Percentage</option>
                        <option value="flat">৳ Flat Rate</option>
                      </select>
                    </div>

                    {/* Rate Value Input */}
                    <div className="sm:col-span-3">
                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          placeholder={
                            memberRow.rateType === "percentage" ? "20" : "2000"
                          }
                          value={memberRow.rateValue || ""}
                          onChange={(e) =>
                            handleMemberChange(
                              index,
                              "rateValue",
                              e.target.value,
                            )
                          }
                          className="input input-bordered input-sm w-full pr-7"
                        />
                        <span className="absolute right-2 top-1.5 text-xs opacity-50 font-bold">
                          {memberRow.rateType === "percentage" ? "%" : "৳"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Calculated Payout Preview */}
                  {memberRow.memberId && (
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-base-200">
                      <span className="opacity-60 flex items-center gap-1">
                        {memberRow.rateType === "percentage" ? (
                          <LuPercent className="size-3 text-info" />
                        ) : (
                          <LuBanknote className="size-3 text-success" />
                        )}
                        Calculated Member Earning:
                      </span>
                      <span className="font-bold text-success">
                        ৳{previewEarning.toLocaleString()}
                        {memberRow.rateType === "percentage" && (
                          <span className="text-[10px] opacity-70 font-normal ml-1">
                            ({rateVal}% of ৳{orderPrice.toLocaleString()})
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completion Points Input (Customizable by Admin, default 5) */}
      {isAdmin ? (
        <div className="p-3 rounded-xl bg-base-200/70 border border-base-300">
          <label className="label py-0 mb-1.5 flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <LuAward className="text-warning size-4" /> Completion Reward Points
            </span>
            <span className="badge badge-warning badge-xs font-semibold">
              Default: 5 pts
            </span>
          </label>
          <input
            type="number"
            min={0}
            value={rewardPoints}
            onChange={(e) => setRewardPoints(e.target.value)}
            className="input input-sm input-bordered w-full"
            placeholder="5"
          />
          <p className="text-[11px] opacity-60 mt-1">
            Points automatically awarded when all tasks are marked completed.
          </p>
        </div>
      ) : (
        <div className="px-3 py-2 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-between text-xs">
          <span className="font-semibold flex items-center gap-1.5">
            <LuAward className="text-warning size-4" /> Completion Reward
          </span>
          <span className="badge badge-warning badge-sm font-bold">
            +{order?.rewardPoints ?? 5} Points
          </span>
        </div>
      )}

      {/* Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-xs uppercase tracking-wider opacity-70">
            Project Tasks
          </h2>
          <button
            type="button"
            onClick={handleAddTaskRow}
            className="btn btn-xs btn-ghost text-primary gap-1"
          >
            <LuPlus className="size-3" /> Add Task
          </button>
        </div>

        <div className="space-y-2">
          {tasks.map((taskRow, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={taskRow.task}
                onChange={(e) => handleTaskTextChange(i, e.target.value)}
                placeholder="e.g. Design hero section, API integration..."
                className="input input-bordered input-sm w-full"
              />
              <button
                className="btn btn-error btn-square btn-sm"
                type="button"
                disabled={tasks.length <= 1}
                onClick={() => handleRemoveTaskRow(i)}
                title="Remove task"
              >
                <LuTrash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        disabled={!hasValidMember || !hasValidTask || isPending}
        type="submit"
        className="btn btn-success w-full mt-2"
      >
        {isPending ? (
          <>
            <div className="loading loading-spinner loading-sm"></div> Assigning...
          </>
        ) : isMember ? (
          "Assign to Myself"
        ) : (
          `Assign (${assignedMembers.filter((m) => m.memberId).length} Member${
            assignedMembers.filter((m) => m.memberId).length > 1 ? "s" : ""
          })`
        )}
      </button>
    </form>
  );
};

export default OrderAssign;
