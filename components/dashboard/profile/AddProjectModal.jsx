"use client";

import { createProject } from "@/api/fetchProject";
import { useAuth } from "@/context/AuthProvider";
import { MyContext } from "@/context/MyProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  LuAward,
  LuBanknote,
  LuBriefcase,
  LuCalendar,
  LuCheck,
  LuCoins,
  LuFolderPlus,
  LuListTodo,
  LuPercent,
  LuPlus,
  LuTrash2,
  LuUserCheck,
  LuUsers,
  LuX,
} from "react-icons/lu";
import { toast } from "react-toastify";

const AddProjectModal = ({ ref }) => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.user?.role === "admin";
  const queryClient = useQueryClient();

  const {
    clientData,
    clientDataLoading,
    services,
    servicesLoading,
    assignableUsers,
    assignableUsersLoading,
  } = useContext(MyContext);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      assignedTo: "",
      assignedMembers: [
        {
          memberId: "",
          rateType: "percentage",
          rateValue: 0,
        },
      ],
      clientId: "",
      slug: "custom",
      planId: "",
      serviceName: "",
      planName: "Custom Plan",
      servicePrice: 0,
      discount: 0,
      payment: "Pending",
      paymentMethod: "",
      amount: 0,
      deadline: "",
      rewardPoints: 5,
      tasks: [{ task: "", isCompleted: false }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });

  const {
    fields: memberFields,
    append: appendMember,
    remove: removeMember,
  } = useFieldArray({
    control,
    name: "assignedMembers",
  });

  const selectedSlug = watch("slug");
  const selectedPayment = watch("payment");
  const watchedPrice = Number(watch("servicePrice")) || 0;
  const watchedAssignedMembers = watch("assignedMembers") || [];

  const selectedService = services?.find((s) => s.slug === selectedSlug);
  const servicePlans = selectedService?.plans || [];

  const { mutate, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["recent-projects"] });
      queryClient.invalidateQueries({ queryKey: ["member-profile-stats"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      toast.success(res?.message || "Project created and assigned successfully!");
      reset();
      ref?.current?.close();
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to create project",
      );
    },
  });

  const handleClose = () => {
    ref?.current?.close();
    reset();
  };

  const onSubmit = (data) => {
    if (!isAdmin) {
      toast.error("Only administrators can add projects");
      return;
    }

    const validMembers = (data.assignedMembers || [])
      .filter((m) => m.memberId && String(m.memberId).trim() !== "")
      .map((m) => ({
        memberId: m.memberId,
        rateType: m.rateType || "percentage",
        rateValue: Math.max(0, Number(m.rateValue) || 0),
      }));

    if (validMembers.length === 0) {
      toast.error("Please select at least one member to assign this project");
      return;
    }

    const validTasks = (data.tasks || [])
      .filter((t) => t?.task && String(t.task).trim() !== "")
      .map((t) => ({
        task: String(t.task).trim(),
        isCompleted: Boolean(t.isCompleted),
      }));

    if (validTasks.length === 0) {
      toast.error("Please add at least one valid task");
      return;
    }

    mutate({
      ...data,
      assignedTo: validMembers[0].memberId,
      assignedMembers: validMembers,
      servicePrice: Number(data.servicePrice) || 0,
      discount: Number(data.discount) || 0,
      amount:
        data.payment === "Success"
          ? Math.max(
              0,
              (Number(data.servicePrice) || 0) - (Number(data.discount) || 0),
            )
          : Number(data.amount) || 0,
      rewardPoints:
        data.rewardPoints !== "" && data.rewardPoints !== undefined
          ? Math.max(0, Number(data.rewardPoints))
          : 5,
      tasks: validTasks,
    });
  };

  if (!isAdmin) return null;

  return (
    <dialog
      ref={ref}
      className="modal modal-bottom sm:modal-middle"
      data-lenis-ignore
    >
      <div className="modal-box max-w-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-base-200/60 border-b border-base-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <LuFolderPlus className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-base-content">
                Add New Project
              </h3>
              <p className="text-xs text-base-content/60">
                Create a standalone project and assign tasks to a team member
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <LuX className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          {/* 1. Assignment & Client */}
          <div className="space-y-4">
            {/* Client Selection (Optional) */}
            <div className="fieldset">
              <label className="label text-xs font-semibold uppercase opacity-75 flex items-center gap-1.5">
                <LuUsers className="size-3.5 text-primary" />
                Client <span className="text-[11px] opacity-60">(Optional)</span>
              </label>
              <select
                className="select select-bordered w-full"
                {...register("clientId")}
              >
                <option value="">Internal / No Specific Client</option>
                {clientDataLoading ? (
                  <option value="" disabled>
                    Loading clients...
                  </option>
                ) : (
                  clientData?.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                      {client.company ? ` (${client.company})` : ""}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Multiple Assigned Members with Split Rates */}
            <div className="p-4 rounded-xl bg-base-200/50 border border-base-300 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
                  <LuUserCheck className="size-4 text-primary" />
                  Assign Team Member(s) & Rates <span className="text-error">*</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    appendMember({
                      memberId: "",
                      rateType: "percentage",
                      rateValue: 0,
                    })
                  }
                  className="btn btn-xs btn-primary btn-soft gap-1"
                >
                  <LuPlus className="size-3" /> Add Member
                </button>
              </div>

              <div className="space-y-2.5">
                {memberFields.map((fieldItem, index) => {
                  const mData = watchedAssignedMembers[index] || {};
                  const rateVal = Math.max(0, Number(mData.rateValue) || 0);
                  const previewEarning =
                    mData.rateType === "percentage"
                      ? Math.round(watchedPrice * (rateVal / 100))
                      : rateVal;

                  return (
                    <div
                      key={fieldItem.id}
                      className="p-3 rounded-lg bg-base-100 border border-base-200 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold opacity-60 uppercase">
                          Assignee #{index + 1}
                        </span>
                        {memberFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMember(index)}
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
                            {...register(
                              `assignedMembers.${index}.memberId`,
                              {
                                required: index === 0 ? "Assignee is required" : false,
                              },
                            )}
                          >
                            <option value="">Select Member / Admin</option>
                            {assignableUsersLoading ? (
                              <option value="" disabled>
                                Loading members...
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

                        {/* Rate Type */}
                        <div className="sm:col-span-3">
                          <select
                            className="select select-bordered select-sm w-full"
                            {...register(`assignedMembers.${index}.rateType`)}
                          >
                            <option value="percentage">% Percentage</option>
                            <option value="flat">৳ Flat Rate</option>
                          </select>
                        </div>

                        {/* Rate Value */}
                        <div className="sm:col-span-3">
                          <div className="relative">
                            <input
                              type="number"
                              min={0}
                              placeholder={
                                mData.rateType === "percentage" ? "20" : "2000"
                              }
                              className="input input-bordered input-sm w-full pr-6"
                              {...register(
                                `assignedMembers.${index}.rateValue`,
                              )}
                            />
                            <span className="absolute right-2 top-1.5 text-xs opacity-50 font-bold">
                              {mData.rateType === "percentage" ? "%" : "৳"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {mData.memberId && watchedPrice > 0 && (
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-base-200">
                          <span className="opacity-60 flex items-center gap-1">
                            {mData.rateType === "percentage" ? (
                              <LuPercent className="size-3 text-info" />
                            ) : (
                              <LuBanknote className="size-3 text-success" />
                            )}
                            Member Earning:
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
            </div>
          </div>

          {/* 2. Project / Service Details */}
          <div className="p-4 rounded-xl bg-base-200/50 border border-base-300 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-75">
              <LuBriefcase className="size-4 text-primary" />
              <span>Project & Service Info</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Service Category / Custom */}
              <div className="fieldset">
                <label className="label text-xs font-semibold">
                  Project Type / Service <span className="text-error">*</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  {...register("slug", { required: "Project type is required" })}
                >
                  <option value="custom">Custom Project</option>
                  {!servicesLoading &&
                    services?.map((srv) => (
                      <option key={srv.slug} value={srv.slug}>
                        {srv.title}
                      </option>
                    ))}
                </select>
              </div>

              {selectedSlug === "custom" ? (
                <div className="fieldset">
                  <label className="label text-xs font-semibold">
                    Category / Plan Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Custom Plan, Internal, Retainer"
                    className="input input-bordered w-full"
                    {...register("planName")}
                  />
                </div>
              ) : (
                <div className="fieldset">
                  <label className="label text-xs font-semibold">
                    Select Plan <span className="text-error">*</span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${
                      errors.planId ? "select-error" : ""
                    }`}
                    {...register("planId", {
                      required:
                        selectedSlug !== "custom"
                          ? "Please select a plan"
                          : false,
                    })}
                  >
                    <option value="">Select Plan</option>
                    {servicePlans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.planName} (${plan.price})
                      </option>
                    ))}
                  </select>
                  {errors.planId && (
                    <p className="text-error text-xs mt-1">
                      {errors.planId.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {selectedSlug === "custom" && (
              <div className="fieldset">
                <label className="label text-xs font-semibold">
                  Project Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Brand Website Redesign, Meta Ads Campaign..."
                  className={`input input-bordered w-full ${
                    errors.serviceName ? "input-error" : ""
                  }`}
                  {...register("serviceName", {
                    required:
                      selectedSlug === "custom"
                        ? "Project title is required"
                        : false,
                    minLength: {
                      value: 2,
                      message: "Title must be at least 2 characters",
                    },
                  })}
                />
                {errors.serviceName && (
                  <p className="text-error text-xs mt-1">
                    {errors.serviceName.message}
                  </p>
                )}
              </div>
            )}

            {/* Deadline & Reward Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="fieldset">
                <label className="label text-xs font-semibold flex items-center gap-1.5">
                  <LuCalendar className="size-3.5 text-primary" />
                  Deadline <span className="text-[11px] opacity-60">(Optional)</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  {...register("deadline")}
                />
              </div>

              <div className="fieldset">
                <label className="label text-xs font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <LuAward className="size-3.5 text-warning" />
                    Completion Reward Points
                  </span>
                  <span className="badge badge-warning badge-xs font-semibold">
                    Default: 5 pts
                  </span>
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="5"
                  className="input input-bordered w-full"
                  {...register("rewardPoints", {
                    min: { value: 0, message: "Points cannot be negative" },
                    valueAsNumber: true,
                  })}
                />
                {errors.rewardPoints && (
                  <p className="text-error text-xs mt-1">
                    {errors.rewardPoints.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 3. Financials & Payment Details */}
          <div className="p-4 rounded-xl bg-base-200/50 border border-base-300 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-75">
                <LuCoins className="size-4 text-emerald-600" />
                <span>Financials & Payment Details</span>
              </div>
              <span className="text-[11px] opacity-60">
                Amounts in BDT (৳)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedSlug === "custom" && (
                <div className="fieldset">
                  <label className="label text-xs font-semibold">
                    Project Budget / Price (৳)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    className="input input-bordered w-full"
                    {...register("servicePrice", {
                      min: { value: 0, message: "Price cannot be negative" },
                      valueAsNumber: true,
                    })}
                  />
                  {errors.servicePrice && (
                    <p className="text-error text-xs mt-1">
                      {errors.servicePrice.message}
                    </p>
                  )}
                </div>
              )}

              <div className="fieldset">
                <label className="label text-xs font-semibold">
                  Discount (৳)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  className="input input-bordered w-full"
                  {...register("discount", {
                    min: { value: 0, message: "Discount cannot be negative" },
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div className="fieldset">
                <label className="label text-xs font-semibold">
                  Payment Status
                </label>
                <select
                  className="select select-bordered w-full"
                  {...register("payment")}
                >
                  <option value="Pending">Pending / Unpaid</option>
                  <option value="Partial">Partial</option>
                  <option value="Success">Paid (Full)</option>
                </select>
              </div>

              {selectedPayment !== "Pending" && (
                <div className="fieldset">
                  <label className="label text-xs font-semibold">
                    Payment Method
                  </label>
                  <select
                    className="select select-bordered w-full"
                    {...register("paymentMethod")}
                  >
                    <option value="">Select Method</option>
                    <option value="Bank">Bank</option>
                    <option value="EPS">EPS</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              )}

              {selectedPayment === "Partial" && (
                <div className="fieldset sm:col-span-2">
                  <label className="label text-xs font-semibold">
                    Collected / Paid Amount (৳)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    className="input input-bordered w-full"
                    {...register("amount", {
                      min: { value: 0, message: "Amount cannot be negative" },
                      valueAsNumber: true,
                    })}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 4. Project Tasks Checklist */}
          <div className="p-4 rounded-xl bg-base-200/50 border border-base-300 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-75">
                  <LuListTodo className="size-4 text-primary" />
                  <span>
                    Project Tasks Checklist <span className="text-error">*</span>
                  </span>
                </div>
                <p className="text-[11px] opacity-60 mt-0.5">
                  Add milestones or actionable tasks for the assigned member
                </p>
              </div>
              <button
                type="button"
                onClick={() => append({ task: "", isCompleted: false })}
                className="btn btn-xs btn-primary gap-1"
              >
                <LuPlus className="size-3.5" /> Add Task
              </button>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-success shrink-0"
                      title="Mark completed"
                      {...register(`tasks.${index}.isCompleted`)}
                    />
                    <input
                      type="text"
                      placeholder={`Task #${index + 1} (e.g. Design initial mockups)`}
                      className={`input input-sm input-bordered w-full ${
                        errors?.tasks?.[index]?.task ? "input-error" : ""
                      }`}
                      {...register(`tasks.${index}.task`, {
                        required: "Task description cannot be empty",
                      })}
                    />
                    <button
                      type="button"
                      disabled={fields.length <= 1}
                      onClick={() => remove(index)}
                      className="btn btn-sm btn-square btn-ghost text-error hover:bg-error/10 shrink-0"
                      title="Remove task"
                    >
                      <LuTrash2 className="size-4" />
                    </button>
                  </div>
                  {errors?.tasks?.[index]?.task && (
                    <p className="text-error text-[11px] pl-7">
                      {errors.tasks[index].task.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="modal-action pt-3 border-t border-base-200 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`btn ${isPending ? "" : "btn-nexoro-primary"} gap-2`}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating Project...
                </>
              ) : (
                <>
                  <LuCheck className="size-4" /> Create & Assign Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
};

export default AddProjectModal;
