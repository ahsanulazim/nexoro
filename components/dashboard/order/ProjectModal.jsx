"use client";

import { useAuth } from "@/context/AuthProvider";
import { MyContext } from "@/context/MyProvider";
import { useContext } from "react";
import {
  LuAward,
  LuBanknote,
  LuCheck,
  LuPercent,
  LuPlus,
  LuSquarePen,
  LuTrash2,
  LuUserCheck,
  LuUsers,
  LuX,
} from "react-icons/lu";
import { toast } from "react-toastify";

const ProjectModal = ({
  ref,
  modalAssignedTo,
  setModalAssignedTo,
  modalAssignedMembers = [],
  setModalAssignedMembers,
  modalRewardPoints,
  setModalRewardPoints,
  modalTasks,
  setModalTasks,
  isPending,
  updateTasks,
  order,
}) => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.user?.role === "admin";
  const { assignableUsers, assignableUsersLoading } = useContext(MyContext);

  const orderPrice =
    Number(order?.price) ||
    Number(order?.servicePrice) ||
    Number(order?.amount) ||
    0;

  // Member row handlers for Admin
  const handleAddMemberRow = () => {
    if (!setModalAssignedMembers) return;
    setModalAssignedMembers((prev) => [
      ...(prev || []),
      { memberId: "", rateType: "percentage", rateValue: 0 },
    ]);
  };

  const handleRemoveMemberRow = (index) => {
    if (!setModalAssignedMembers || (modalAssignedMembers?.length || 0) <= 1)
      return;
    setModalAssignedMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index, field, value) => {
    if (!setModalAssignedMembers) return;
    setModalAssignedMembers((prev) => {
      const copy = [...(prev || [])];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Task list helpers
  const handleModalTaskChange = (index, value) => {
    const updated = [...modalTasks];
    updated[index].task = value;
    setModalTasks(updated);
  };

  const handleModalRemoveRow = (index) => {
    if (modalTasks.length <= 1) return;
    setModalTasks(modalTasks.filter((_, i) => i !== index));
  };

  const handleModalAddRow = () => {
    setModalTasks([...modalTasks, { task: "", isCompleted: false }]);
  };

  // Total allocated payout across members
  const totalAllocatedPayout = (modalAssignedMembers || []).reduce((acc, m) => {
    if (!m.memberId) return acc;
    const val = Math.max(0, Number(m.rateValue) || 0);
    const amount =
      m.rateType === "percentage" ? Math.round(orderPrice * (val / 100)) : val;
    return acc + amount;
  }, 0);

  const handleSaveModal = (e) => {
    e.preventDefault();
    const cleanedTasks = modalTasks
      .filter((t) => t.task && t.task.trim() !== "")
      .map((t) => ({
        task: t.task.trim(),
        isCompleted: Boolean(t.isCompleted),
      }));

    if (cleanedTasks.length === 0) {
      toast.error("Please provide at least one valid task");
      return;
    }

    const cleanedMembers = (modalAssignedMembers || [])
      .filter((m) => m.memberId && String(m.memberId).trim())
      .map((m) => ({
        memberId: m.memberId,
        rateType: m.rateType || "percentage",
        rateValue: Math.max(0, Number(m.rateValue) || 0),
      }));

    updateTasks({
      orderId: order._id,
      assignedTo: cleanedMembers[0]?.memberId || modalAssignedTo,
      assignedMembers: cleanedMembers.length > 0 ? cleanedMembers : undefined,
      ...(isAdmin && modalRewardPoints !== undefined
        ? { rewardPoints: Math.max(0, Number(modalRewardPoints)) }
        : {}),
      tasks: cleanedTasks,
    });
    toast.success("Tasks and assignment updated successfully");
  };

  return (
    <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-xl">
        <div className="flex items-center justify-between pb-3 border-b border-base-200">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <LuSquarePen className="text-primary" /> Manage Tasks & Assignment
          </h3>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <LuX />
          </button>
        </div>

        <form onSubmit={handleSaveModal} className="mt-4 space-y-4">
          {/* Order Value & Payout Overview */}
          <div className="p-3 rounded-xl bg-base-200/60 border border-base-300 flex items-center justify-between text-xs">
            <div>
              <span className="opacity-60 block text-[10px] uppercase font-bold">
                Order Value
              </span>
              <span className="font-bold text-sm text-primary">
                ৳{orderPrice.toLocaleString()}
              </span>
            </div>
            {isAdmin && totalAllocatedPayout > 0 && (
              <div className="text-right">
                <span className="opacity-60 block text-[10px] uppercase font-bold">
                  Total Member Payout
                </span>
                <span
                  className={`font-bold ${
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

          {/* Assigned Members Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label text-xs font-semibold uppercase opacity-70 p-0 flex items-center gap-1.5">
                <LuUsers className="size-4 text-primary" /> Assigned Member(s) &
                Rates
              </label>
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleAddMemberRow}
                  className="btn btn-xs btn-primary btn-soft gap-1"
                >
                  <LuPlus className="size-3" /> Add Member
                </button>
              )}
            </div>

            {isAdmin ? (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {(modalAssignedMembers || []).map((memberRow, index) => {
                  const rateVal = Math.max(0, Number(memberRow.rateValue) || 0);
                  const previewEarning =
                    memberRow.rateType === "percentage"
                      ? Math.round(orderPrice * (rateVal / 100))
                      : rateVal;

                  return (
                    <div
                      key={index}
                      className="p-2.5 rounded-xl bg-base-200/50 border border-base-300 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-base-content/60 uppercase">
                          Assignee #{index + 1}
                        </span>
                        {(modalAssignedMembers?.length || 0) > 1 && (
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
                        <div className="sm:col-span-6">
                          <select
                            className="select select-bordered select-xs w-full"
                            value={memberRow.memberId || ""}
                            onChange={(e) =>
                              handleMemberChange(
                                index,
                                "memberId",
                                e.target.value,
                              )
                            }
                          >
                            <option value="">Select Member</option>
                            {assignableUsersLoading ? (
                              <option value="" disabled>
                                Loading users...
                              </option>
                            ) : (
                              assignableUsers?.map((member) => (
                                <option key={member._id} value={member._id}>
                                  {member.name || member.email} ({member.role})
                                </option>
                              ))
                            )}
                          </select>
                        </div>

                        <div className="sm:col-span-3">
                          <select
                            className="select select-bordered select-xs w-full"
                            value={memberRow.rateType || "percentage"}
                            onChange={(e) =>
                              handleMemberChange(
                                index,
                                "rateType",
                                e.target.value,
                              )
                            }
                          >
                            <option value="percentage">% Percent</option>
                            <option value="flat">৳ Flat</option>
                          </select>
                        </div>

                        <div className="sm:col-span-3">
                          <div className="relative">
                            <input
                              type="number"
                              min={0}
                              placeholder={
                                memberRow.rateType === "percentage"
                                  ? "20"
                                  : "2000"
                              }
                              value={memberRow.rateValue || ""}
                              onChange={(e) =>
                                handleMemberChange(
                                  index,
                                  "rateValue",
                                  e.target.value,
                                )
                              }
                              className="input input-bordered input-xs w-full pr-5"
                            />
                            <span className="absolute right-1.5 top-1 text-[10px] opacity-50 font-bold">
                              {memberRow.rateType === "percentage" ? "%" : "৳"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {memberRow.memberId && (
                        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-base-200">
                          <span className="opacity-60 flex items-center gap-1">
                            {memberRow.rateType === "percentage" ? (
                              <LuPercent className="size-2.5 text-info" />
                            ) : (
                              <LuBanknote className="size-2.5 text-success" />
                            )}
                            Earning:
                          </span>
                          <span className="font-bold text-success">
                            ৳{previewEarning.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-base-200/70 border border-base-content/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LuUserCheck className="size-4 text-primary" />
                  <span className="text-sm font-semibold">
                    {order?.assignedMember ||
                      currentUser?.user?.name ||
                      "Assigned to you"}
                  </span>
                </div>
                <span className="badge badge-primary badge-sm font-semibold">
                  Assigned
                </span>
              </div>
            )}
          </div>

          {/* Completion Reward Points (Admin Customizable) */}
          {isAdmin && (
            <div className="p-3 rounded-xl bg-base-200/60 border border-base-300">
              <label className="label py-0 mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase opacity-70 flex items-center gap-1.5">
                  <LuAward className="text-warning size-4" /> Completion Reward
                  Points
                </span>
                <span className="badge badge-warning badge-xs font-semibold">
                  Default: 5 pts
                </span>
              </label>
              <input
                type="number"
                min={0}
                value={modalRewardPoints ?? 5}
                onChange={(e) =>
                  setModalRewardPoints && setModalRewardPoints(e.target.value)
                }
                className="input input-sm input-bordered w-full"
                placeholder="5"
              />
            </div>
          )}

          {/* Tasks List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label text-xs font-semibold uppercase opacity-70 p-0">
                Tasks List
              </label>
              <button
                type="button"
                onClick={handleModalAddRow}
                className="btn btn-xs btn-primary btn-soft gap-1"
              >
                <LuPlus className="size-3" /> Add Row
              </button>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {modalTasks.map((t, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(t.isCompleted)}
                    onChange={(e) => {
                      const updated = [...modalTasks];
                      updated[idx].isCompleted = e.target.checked;
                      setModalTasks(updated);
                    }}
                    className="checkbox checkbox-sm checkbox-success"
                    title="Completed?"
                  />
                  <input
                    type="text"
                    value={t.task}
                    onChange={(e) => handleModalTaskChange(idx, e.target.value)}
                    placeholder="Task description..."
                    className="input input-sm input-bordered w-full"
                  />
                  <button
                    type="button"
                    disabled={modalTasks.length <= 1}
                    onClick={() => handleModalRemoveRow(idx)}
                    className="btn btn-sm btn-square btn-error"
                  >
                    <LuTrash2 />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-action pt-3 border-t border-base-200">
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn btn-success"
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Saving...
                </>
              ) : (
                <>
                  <LuCheck /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ProjectModal;
