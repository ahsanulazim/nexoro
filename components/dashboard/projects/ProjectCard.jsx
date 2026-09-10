"use client";

import { updateOrderTasks } from "@/api/fetchOrder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useRef, useState } from "react";
import { FaCircleCheck, FaStar } from "react-icons/fa6";
import {
  LuCalendar,
  LuChevronDown,
  LuChevronUp,
  LuExternalLink,
  LuListTodo,
  LuPartyPopper,
  LuPlus,
  LuReceipt,
  LuSparkles,
  LuTrendingUp,
} from "react-icons/lu";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "react-toastify";
import ProjectCostModal from "./ProjectCostModal";

const ProjectCard = ({
  project,
  isAssignedToMe = false,
  defaultTasksOpen = false,
}) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const isAdmin = currentUser?.user?.role === "admin";
  const canUpdateTasks = isAdmin || isAssignedToMe;
  const canViewCosts = isAdmin || isAssignedToMe;

  const costsModalRef = useRef(null);
  const [tasksOpen, setTasksOpen] = useState(
    defaultTasksOpen || isAssignedToMe,
  );
  const [newTaskText, setNewTaskText] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [activeTogglingIndex, setActiveTogglingIndex] = useState(null);

  const costs = Array.isArray(project?.costs) ? project.costs : [];
  const totalCost = Number(
    project?.totalCost ??
      costs.reduce((acc, c) => acc + (Number(c.amount) || 0), 0),
  );
  const servicePrice = Number(project?.servicePrice || project?.price || 0);
  const netRevenue = servicePrice - totalCost;

  const tasks = Array.isArray(project?.tasks) ? project.tasks : [];
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalCount = tasks.length;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;
  const hasSomeCompleted = completedCount > 0;

  const { mutate: updateTasks, isPending } = useMutation({
    mutationFn: updateOrderTasks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setActiveTogglingIndex(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update task");
      setActiveTogglingIndex(null);
    },
  });

  const handleToggleTask = (taskIndex) => {
    if (!canUpdateTasks) {
      toast.warning(
        "Only the assigned member or an administrator can update tasks for this project",
      );
      return;
    }
    setActiveTogglingIndex(taskIndex);
    const updatedTasks = tasks.map((t, idx) =>
      idx === taskIndex ? { ...t, isCompleted: !t.isCompleted } : t,
    );
    const willBeCompleted = !tasks[taskIndex]?.isCompleted;
    updateTasks(
      {
        orderId: project._id,
        tasks: updatedTasks,
      },
      {
        onSuccess: () => {
          toast.success(
            willBeCompleted ? "Task marked completed" : "Task marked pending",
          );
        },
      },
    );
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.warning("Only administrators can add tasks to projects");
      return;
    }
    const trimmed = newTaskText.trim();
    if (!trimmed) return;

    const updatedTasks = [...tasks, { task: trimmed, isCompleted: false }];
    updateTasks(
      {
        orderId: project._id,
        tasks: updatedTasks,
      },
      {
        onSuccess: () => {
          setNewTaskText("");
          setIsAddingTask(false);
          toast.success("Task added to project");
        },
      },
    );
  };

  return (
    <div
      className={`card bg-base-100 shadow-sm border transition-all duration-200 ${
        isAssignedToMe
          ? "border-main shadow-md ring-1 ring-primary/20 bg-linear-to-b from-primary/5 via-base-100 to-base-100"
          : "border-base-content/10"
      }`}
    >
      <div className="card-body p-5">
        {/* Header: Title & Action icons */}
        <div className="flex gap-3 items-start justify-between">
          <div>
            {isAssignedToMe && (
              <span className="badge badge-primary badge-sm bg-main border-main mb-1.5 font-semibold">
                <LuSparkles /> Assigned to You
              </span>
            )}
            <h2 className="card-title text-base sm:text-lg font-bold">
              {project.serviceName}
            </h2>
            {project.client && (
              <p className="text-xs opacity-60 mt-0.5">
                Client: <span className="font-medium">{project.client}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href={`/dashboard/orders/${project._id}`}
              className="btn btn-square btn-soft btn-primary btn-sm"
              title="View Order Details"
            >
              <LuExternalLink className="size-3.5" />
            </Link>
            <button
              type="button"
              className="btn btn-square btn-soft btn-warning btn-sm"
              title="Favorite"
            >
              <FaStar className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Plan and Price */}
        <p className="opacity-70 text-xs sm:text-sm font-medium">
          {project.planName} - ৳{project.servicePrice}
        </p>

        {/* Financial Badges & Cost Management */}
        {canViewCosts && (
          <div className="flex items-center justify-between gap-1.5 mt-2 pt-2 border-t border-base-200">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="badge badge-soft badge-error badge-xs py-2 px-2 gap-1 font-semibold text-[11px]">
                <LuReceipt className="size-3" /> Cost: ৳
                {totalCost.toLocaleString()}
              </span>
              <span
                className={`badge badge-soft badge-xs py-2 px-2 gap-1 font-semibold text-[11px] ${
                  netRevenue >= 0 ? "badge-success" : "badge-error"
                }`}
              >
                <LuTrendingUp className="size-3" /> Net: ৳
                {netRevenue.toLocaleString()}
              </span>
            </div>
            <button
              type="button"
              onClick={() => costsModalRef.current?.showModal()}
              className="btn btn-xs btn-ghost text-primary text-[11px] font-semibold px-1.5 h-6 min-h-0"
              title="Manage Project Costs"
            >
              Costs ({costs.length})
            </button>
          </div>
        )}

        {/* Task Status Overview */}
        <div className="mt-1">
          <div className="flex justify-between items-center text-xs font-semibold mb-1">
            <span className="opacity-80 flex items-center gap-1">
              {tasks.find((task) => !task.isCompleted)?.task ? (
                `Next: ${tasks.find((task) => !task.isCompleted)?.task}`
              ) : totalCount > 0 ? (
                <>
                  All tasks completed!{" "}
                  <LuPartyPopper className="size-4 text-primary inline-form" />
                </>
              ) : (
                "No tasks created"
              )}
            </span>
            <span className="badge badge-sm badge-ghost">
              {completedCount}/{totalCount}
            </span>
          </div>

          {/* Progress Bar */}
          <progress
            className={`progress ${
              isAllCompleted
                ? "progress-success"
                : hasSomeCompleted
                  ? "progress-warning"
                  : "progress-error"
            } w-full h-1.5 rounded-full`}
            value={completedCount}
            max={Math.max(totalCount, 1)}
          ></progress>
        </div>

        {/* Task Checklist Accordion / Interactive Section */}
        <div className="mt-2 pt-2 border-t border-base-200">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setTasksOpen(!tasksOpen)}
              className="btn btn-xs btn-ghost gap-1.5 px-1 text-xs font-semibold opacity-80 hover:opacity-100"
            >
              <LuListTodo className="size-3.5 text-primary" />
              <span>
                {tasksOpen ? "Hide Tasks" : "View & Update Tasks"} (
                {completedCount}/{totalCount})
              </span>
              {tasksOpen ? (
                <LuChevronUp className="size-3" />
              ) : (
                <LuChevronDown className="size-3" />
              )}
            </button>

            {tasksOpen && !isAddingTask && isAdmin && (
              <button
                type="button"
                onClick={() => setIsAddingTask(true)}
                className="btn btn-xs btn-ghost text-primary gap-1"
                title="Add task"
              >
                <LuPlus className="size-3" /> Add Task
              </button>
            )}
          </div>

          {tasksOpen && (
            <div className="mt-2 space-y-1.5 bg-base-200/50 p-2.5 rounded-lg">
              {tasks.length === 0 ? (
                <p className="text-xs opacity-50 py-1 text-center">
                  No tasks assigned yet.
                </p>
              ) : (
                <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {tasks.map((task, idx) => {
                    const isTogglingThis =
                      isPending && activeTogglingIndex === idx;

                    return (
                      <li
                        key={idx}
                        onClick={() =>
                          canUpdateTasks && !isPending && handleToggleTask(idx)
                        }
                        className={`flex items-center gap-2 p-1.5 rounded-md select-none transition-colors ${
                          canUpdateTasks
                            ? "cursor-pointer hover:bg-base-200"
                            : "cursor-default opacity-75"
                        } ${
                          task.isCompleted
                            ? "bg-base-100/50 opacity-60"
                            : "bg-base-100"
                        }`}
                        title={
                          !canUpdateTasks
                            ? `Assigned to ${project.assignedTo || "another member"}. Read-only.`
                            : ""
                        }
                      >
                        <button
                          type="button"
                          disabled={!canUpdateTasks || isPending}
                          className="shrink-0"
                        >
                          {isTogglingThis ? (
                            <span className="loading loading-spinner loading-xs text-primary"></span>
                          ) : (
                            <FaCircleCheck
                              className={`size-4 ${
                                task.isCompleted
                                  ? "text-success"
                                  : canUpdateTasks
                                    ? "text-base-content/30 hover:text-base-content/50"
                                    : "text-base-content/20 opacity-40"
                              }`}
                            />
                          )}
                        </button>
                        <span
                          className={`text-xs wrap-break-word leading-tight flex-1 ${
                            task.isCompleted ? "line-through" : "font-medium"
                          }`}
                        >
                          {task.task}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Inline Add Task Form (Admin Only) */}
              {isAddingTask && isAdmin && (
                <form
                  onSubmit={handleAddTask}
                  className="pt-1.5 flex items-center gap-1.5 border-t border-base-300"
                >
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="New task..."
                    autoFocus
                    disabled={isPending}
                    className="input input-xs input-bordered w-full rounded"
                  />
                  <button
                    type="submit"
                    disabled={!newTaskText.trim() || isPending}
                    className="btn btn-xs btn-primary shrink-0"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingTask(false);
                      setNewTaskText("");
                    }}
                    className="btn btn-xs btn-ghost shrink-0"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        <hr className="border-0.5 border-dashed my-1.5 border-base-content/20" />

        {/* Card Footer: Assignee & Date */}
        <div className="card-actions justify-between items-center text-xs">
          <div>
            <h3 className="opacity-60 text-[11px]">Assigned To</h3>
            <span
              className={`font-semibold ${
                isAssignedToMe ? "text-primary" : "text-base-content"
              }`}
            >
              {project?.assignedTo || "Unassigned"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 opacity-60">
            <LuCalendar className="size-3.5" />
            <span>{moment(project.createdAt).format("LL")}</span>
          </div>
        </div>
      </div>

      {/* Modal for Project Cost Management */}
      <ProjectCostModal project={project} ref={costsModalRef} />
    </div>
  );
};

export default ProjectCard;
