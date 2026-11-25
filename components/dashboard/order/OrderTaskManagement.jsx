"use client";

import { updateOrderTasks } from "@/api/fetchOrder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import {
  LuAward,
  LuCheck,
  LuPencil,
  LuPlus,
  LuSettings2,
  LuStickyNote,
  LuTrash2,
  LuUserCheck,
  LuX,
} from "react-icons/lu";
import { FaCircleCheck } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthProvider";
import OrderAssign from "./OrderAssign";
import ProjectModal from "./ProjectModal";

const OrderTaskManagement = ({ order }) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const isAdmin = currentUser?.user?.role === "admin";
  const isMember = currentUser?.user?.role === "member";
  const currentUserId = currentUser?.user?._id ? String(currentUser.user._id) : "";
  const currentUserEmail = currentUser?.user?.email?.toLowerCase() || "";
  const currentUserName = (
    currentUser?.user?.name ||
    currentUser?.user?.displayName ||
    ""
  ).toLowerCase();

  const isAssignedToMe = Boolean(
    currentUser?.user &&
      ((order?.assignedTo &&
        (String(order.assignedTo) === currentUserId ||
          String(order.assignedTo).toLowerCase() === currentUserEmail ||
          String(order.assignedTo).toLowerCase() === currentUserName)) ||
        (order?.assignedMemberEmail &&
          order.assignedMemberEmail.toLowerCase() === currentUserEmail) ||
        (Array.isArray(order?.assignedMembers) &&
          order.assignedMembers.some(
            (m) =>
              (m.memberId && String(m.memberId) === currentUserId) ||
              (m.memberEmail &&
                m.memberEmail.toLowerCase() === currentUserEmail) ||
              (m.memberName &&
                m.memberName.toLowerCase() === currentUserName),
          ))),
  );

  const isCreatedByMe = Boolean(
    currentUser?.user &&
      ((order?.createdById && String(order.createdById) === currentUserId) ||
        (order?.createdBy &&
          (order.createdBy.toLowerCase() === currentUserName ||
            order.createdBy.toLowerCase() === currentUserEmail))),
  );

  const canToggleTask = isAdmin || (isMember && isAssignedToMe);
  const canManage = isAdmin || (isMember && isCreatedByMe && isAssignedToMe);
  const canAssign = isAdmin || (isMember && isCreatedByMe);

  // State for quick inline task adding
  const [newTaskText, setNewTaskText] = useState("");

  // State for inline editing a specific task index
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");

  // State for full manage modal
  const modalRef = useRef(null);
  const [modalAssignedTo, setModalAssignedTo] = useState(
    order?.assignedTo || "",
  );
  const [modalAssignedMembers, setModalAssignedMembers] = useState([]);
  const [modalRewardPoints, setModalRewardPoints] = useState(
    order?.rewardPoints ?? 5,
  );
  const [modalTasks, setModalTasks] = useState([]);

  // Mutation for updating tasks
  const { mutate: updateTasks, isPending } = useMutation({
    mutationFn: updateOrderTasks,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["myPointsSummary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      if (modalRef.current?.open) {
        modalRef.current.close();
      }
      setEditingIndex(null);
      setEditingText("");
      setNewTaskText("");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update tasks");
    },
  });

  if (!order) return null;

  const hasAssigned =
    Boolean(order?.assignedTo) ||
    (Array.isArray(order?.assignedMembers) && order.assignedMembers.length > 0);

  // If not yet assigned, show the initial assignment component (admin or creator member can assign)
  if (!hasAssigned) {
    if (!canAssign) {
      return (
        <div className="p-4 text-center text-sm opacity-60 bg-base-200 rounded-xl">
          This order has not been assigned to any team member yet.
        </div>
      );
    }
    return (
      <div>
        <h1 className="font-semibold text-lg flex items-center gap-2">
          <LuUserCheck className="text-primary" />{" "}
          {isMember ? "Self-Assign Order" : "Assign Order"}
        </h1>
        <OrderAssign order={order} />
      </div>
    );
  }

  const tasks = Array.isArray(order.tasks) ? order.tasks : [];
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalCount = tasks.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const isCancelled = order?.status?.toLowerCase() === "cancelled";

  // Toggle single task completion
  const handleToggleTask = (index) => {
    if (isCancelled) {
      toast.warning("Cannot update tasks on a cancelled order");
      return;
    }
    if (!canToggleTask) {
      toast.warning(
        "Only the assigned member or an administrator can update task status",
      );
      return;
    }
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, isCompleted: !t.isCompleted } : t,
    );
    updateTasks({
      orderId: order._id,
      tasks: updatedTasks,
    });
  };

  // Start inline editing of a task (admin only)
  const handleStartEdit = (index, currentTaskText) => {
    if (!isAdmin) return;
    setEditingIndex(index);
    setEditingText(currentTaskText);
  };

  // Save inline edit (admin only)
  const handleSaveInlineEdit = (index) => {
    if (!isAdmin) return;
    const trimmed = editingText.trim();
    if (!trimmed) {
      toast.warning("Task description cannot be empty");
      return;
    }
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, task: trimmed } : t,
    );
    updateTasks({
      orderId: order._id,
      tasks: updatedTasks,
    });
    toast.success("Task updated");
  };

  // Delete single task
  const handleDeleteTask = (index) => {
    if (!canManage) return;
    const updatedTasks = tasks.filter((_, i) => i !== index);
    updateTasks({
      orderId: order._id,
      tasks: updatedTasks,
    });
    toast.success("Task deleted");
  };

  // Quick add new task
  const handleQuickAddTask = (e) => {
    if (e) e.preventDefault();
    if (!canManage) return;
    const trimmed = newTaskText.trim();
    if (!trimmed) return;

    const updatedTasks = [...tasks, { task: trimmed, isCompleted: false }];
    updateTasks({
      orderId: order._id,
      tasks: updatedTasks,
    });
    setNewTaskText("");
    toast.success("New task added");
  };

  // Open manage modal (admin only)
  const handleOpenManageModal = () => {
    if (!canManage) return;
    setModalAssignedTo(order.assignedTo || "");
    const initialMembers =
      Array.isArray(order.assignedMembers) && order.assignedMembers.length > 0
        ? order.assignedMembers.map((m) => ({ ...m }))
        : order.assignedTo
          ? [{ memberId: order.assignedTo, rateType: "percentage", rateValue: 0 }]
          : [{ memberId: "", rateType: "percentage", rateValue: 0 }];
    setModalAssignedMembers(initialMembers);
    setModalRewardPoints(order.rewardPoints ?? 5);
    setModalTasks(
      tasks.length > 0
        ? tasks.map((t) => ({ ...t }))
        : [{ task: "", isCompleted: false }],
    );
    modalRef.current?.showModal();
  };

  return (
    <div>
      {/* Header & Assigned Member(s) */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-base-200">
        <div>
          <span className="text-xs uppercase tracking-wider opacity-60 block">
            Assigned Member{Array.isArray(order.assignedMembers) && order.assignedMembers.length > 1 ? "s" : ""}
          </span>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {Array.isArray(order.assignedMembers) && order.assignedMembers.length > 0 ? (
              order.assignedMembers.map((m, idx) => (
                <div
                  key={idx}
                  className="badge badge-sm badge-primary badge-soft py-2 px-2.5 gap-1.5 font-semibold"
                >
                  <span>{m.memberName || "Member"}</span>
                  {isAdmin && (
                    <span className="opacity-70 text-[10px]">
                      ({m.rateType === "percentage" ? `${m.rateValue}%` : `৳${m.rateValue}`})
                    </span>
                  )}
                </div>
              ))
            ) : (
              <h2 className="font-bold text-base text-base-content">
                {order.assignedMember || "Assigned"}
              </h2>
            )}
            <span className="badge badge-success badge-sm">Active</span>
            <span className="badge badge-warning badge-soft badge-sm font-semibold gap-1">
              <LuAward className="size-3" /> +{order.rewardPoints ?? 5} pts
            </span>
          </div>

          {/* If member is assigned, show their personal share */}
          {!isAdmin && isAssignedToMe && (
            <div className="mt-1.5 text-xs text-success font-semibold flex items-center gap-1.5">
              <span>Your Share:</span>
              <span>
                {(() => {
                  const myMatch = Array.isArray(order.assignedMembers)
                    ? order.assignedMembers.find(
                        (m) =>
                          String(m.memberId) === currentUserId ||
                          (m.memberEmail &&
                            m.memberEmail.toLowerCase() === currentUserEmail),
                      )
                    : null;
                  if (!myMatch) return "Assigned";
                  const price =
                    Number(order.price) || Number(order.servicePrice) || 0;
                  const amt =
                    myMatch.amount ||
                    (myMatch.rateType === "percentage"
                      ? Math.round(price * (myMatch.rateValue / 100))
                      : myMatch.rateValue) ||
                    0;
                  return `৳${amt.toLocaleString()} (${myMatch.rateType === "percentage" ? `${myMatch.rateValue}%` : "Flat Rate"})`;
                })()}
              </span>
            </div>
          )}
        </div>
        {canManage && (
          <button
            type="button"
            onClick={handleOpenManageModal}
            className="btn btn-sm btn-ghost btn-outline gap-1.5"
            title="Manage tasks and member"
          >
            <LuSettings2 className="size-4" />
            <span className="hidden sm:inline text-xs">Manage</span>
          </button>
        )}
      </div>

      {/* Client Scope / Order Instructions Note */}
      {order?.orderNote && (
        <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 mb-1">
            <LuStickyNote className="size-3.5" />
            <span>Order Instructions / Scope:</span>
          </div>
          <p className="text-base-content/90 whitespace-pre-wrap leading-relaxed">
            {order.orderNote}
          </p>
        </div>
      )}

      {/* Progress Bar Section */}
      <div className="mt-4 bg-base-200/60 p-3 rounded-xl">
        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
          <span className="flex items-center gap-1.5 text-base-content/80">
            <FaCircleCheck className="text-success text-sm" />
            Task Progress
          </span>
          <span className="badge badge-sm badge-neutral">
            {completedCount} / {totalCount} Done ({progressPercent}%)
          </span>
        </div>
        <progress
          className="progress progress-success w-full h-2 rounded-full"
          value={completedCount}
          max={Math.max(totalCount, 1)}
        ></progress>
      </div>

      {/* Interactive Task List */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-wider font-bold opacity-70">
            Tasks ({totalCount})
          </h3>
          <span className="text-[11px] opacity-50">
            {canToggleTask
              ? "Click check to toggle"
              : "Read-only for other members"}
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="p-4 text-center text-sm opacity-50 bg-base-200 rounded-lg">
            No tasks found.
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task, i) => {
              const isItemEditing = editingIndex === i;

              return (
                <li
                  key={i}
                  className={`group flex items-center justify-between gap-2 p-2.5 rounded-lg border transition-colors ${
                    task.isCompleted
                      ? "bg-base-200/40 border-base-200"
                      : "bg-base-100 border-base-content/10 shadow-xs"
                  }`}
                >
                  {isItemEditing && canManage ? (
                    // Inline Edit Form (Admin or Creator Member)
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveInlineEdit(i);
                          if (e.key === "Escape") setEditingIndex(null);
                        }}
                        autoFocus
                        className="input input-sm input-bordered w-full"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveInlineEdit(i)}
                        disabled={isPending}
                        className="btn btn-sm btn-square btn-success"
                        title="Save task"
                      >
                        <LuCheck className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingIndex(null)}
                        className="btn btn-sm btn-square btn-ghost"
                        title="Cancel"
                      >
                        <LuX className="size-4" />
                      </button>
                    </div>
                  ) : (
                    // Regular Task Row
                    <>
                      <div
                        onClick={() => canToggleTask && handleToggleTask(i)}
                        className={`flex items-center gap-2.5 flex-1 select-none ${
                          canToggleTask ? "cursor-pointer" : "cursor-default"
                        }`}
                        title={
                          !canToggleTask
                            ? "Only the assigned member or admin can update task status"
                            : ""
                        }
                      >
                        <button
                          type="button"
                          disabled={!canToggleTask || isPending}
                          className="shrink-0 transition-transform active:scale-90"
                        >
                          <FaCircleCheck
                            className={`size-4.5 ${
                              task.isCompleted
                                ? "text-success"
                                : canToggleTask
                                  ? "text-base-content/30 hover:text-base-content/50"
                                  : "text-base-content/20 opacity-50"
                            }`}
                          />
                        </button>
                        <span
                          className={`text-sm wrap-break-word leading-snug ${
                            task.isCompleted
                              ? "line-through opacity-50"
                              : "text-base-content"
                          }`}
                        >
                          {task.task}
                        </span>
                      </div>

                      {/* Action buttons (visible to Admin or creator member) */}
                      {canManage && (
                        <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(i, task.task)}
                            disabled={isPending}
                            className="btn btn-ghost btn-square btn-xs hover:bg-base-300"
                            title="Edit task"
                          >
                            <LuPencil className="size-3.5 text-info" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(i)}
                            disabled={isPending}
                            className="btn btn-ghost btn-square btn-xs hover:bg-error/20"
                            title="Delete task"
                          >
                            <LuTrash2 className="size-3.5 text-error" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Quick Add Task Input (Admin or Creator Member) */}
        {canManage && (
          <form
            onSubmit={handleQuickAddTask}
            className="mt-3 flex gap-2 items-center"
          >
            <input
              type="text"
              placeholder="Add new task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              disabled={isPending}
              className="input input-bordered w-full"
            />
            <button
              type="submit"
              disabled={!newTaskText.trim() || isPending}
              className="btn btn-primary"
            >
              <LuPlus />
              <span className="max-sm:hidden">Add</span>
            </button>
          </form>
        )}
      </div>

      {/* Manage Tasks & Member Modal (Admin Only) */}
      {canManage && (
        <ProjectModal
          ref={modalRef}
          order={order}
          modalAssignedTo={modalAssignedTo}
          setModalAssignedTo={setModalAssignedTo}
          modalAssignedMembers={modalAssignedMembers}
          setModalAssignedMembers={setModalAssignedMembers}
          modalRewardPoints={modalRewardPoints}
          setModalRewardPoints={setModalRewardPoints}
          modalTasks={modalTasks}
          setModalTasks={setModalTasks}
          isPending={isPending}
          updateTasks={updateTasks}
        />
      )}
    </div>
  );
};

export default OrderTaskManagement;
