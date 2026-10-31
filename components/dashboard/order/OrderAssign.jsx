"use client";

import { assignOrder } from "@/api/fetchOrder";
import { useAuth } from "@/context/AuthProvider";
import { MyContext } from "@/context/MyProvider";
import { useForm } from "@tanstack/react-form-nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { LuAward, LuPlus, LuTrash2, LuUserCheck } from "react-icons/lu";
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
  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: {
      assignedTo: isMember ? currentUserId : "",
      rewardPoints: order?.rewardPoints ?? 5,
      tasks: [{ task: "" }],
    },
    onSubmit: ({ value }) => {
      const payload = {
        ...value,
        rewardPoints: isAdmin
          ? Math.max(0, Number(value.rewardPoints ?? 5))
          : 5,
        assignedTo: isMember ? currentUserId : value.assignedTo,
      };
      mutate({ orderId: order._id, value: payload });
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: assignOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["myPointsSummary"] });
      toast.success(
        isMember
          ? "Order assigned to yourself successfully"
          : "Order assigned successfully",
      );
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to assign order");
    },
  });

  return (
    <form
      className="fieldset mt-5"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit();
      }}
    >
      {isMember ? (
        <div className="p-3 mb-5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
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
        <Field name="assignedTo">
          {(field) => (
            <select
              className="select w-full mb-5"
              defaultValue=""
              name={field.name}
              onBlur={(e) => field.handleBlur(e.target.value)}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
            >
              <option value="" disabled={true}>
                Select Member or Admin
              </option>
              {assignableUsersLoading ? (
                <option value="">Loading users...</option>
              ) : assignableUsersError || !assignableUsers?.length ? (
                <option value="">No members or admins available</option>
              ) : (
                assignableUsers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name || member.email} ({member.role})
                  </option>
                ))
              )}
            </select>
          )}
        </Field>
      )}

      {/* Completion Points Input (Customizable by Admin, default 5) */}
      {isAdmin ? (
        <Field name="rewardPoints">
          {(field) => (
            <div className="mb-4 p-3 rounded-xl bg-base-200/70 border border-base-300">
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
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="input input-sm input-bordered w-full"
                placeholder="5"
              />
              <p className="text-[11px] opacity-60 mt-1">
                Points automatically awarded when all tasks are marked completed.
              </p>
            </div>
          )}
        </Field>
      ) : (
        <div className="mb-4 px-3 py-2 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-between text-xs">
          <span className="font-semibold flex items-center gap-1.5">
            <LuAward className="text-warning size-4" /> Completion Reward
          </span>
          <span className="badge badge-warning badge-sm font-bold">
            +{order?.rewardPoints ?? 5} Points
          </span>
        </div>
      )}

      <h2 className="font-bold text-sm">Add Tasks</h2>
      <Field name="tasks" mode="array">
        {(field) => (
          <>
            {field.state.value.map((_, i) => (
              <Field key={i} name={`tasks[${i}].task`}>
                {(subField) => (
                  <div className="flex gap-2 items-center mt-2">
                    <input
                      type="text"
                      value={subField.state.value}
                      onBlur={(e) => subField.handleBlur(e.target.value)}
                      onChange={(e) => subField.handleChange(e.target.value)}
                      placeholder="Make an ad account"
                      className="input w-full"
                    />
                    <button
                      className="btn btn-error btn-square"
                      type="button"
                      disabled={field.state.value.length <= 1}
                      onClick={() => field.removeValue(i)}
                    >
                      <LuTrash2 />
                    </button>
                  </div>
                )}
              </Field>
            ))}

            <button
              className="btn btn-sm btn-square btn-success my-2"
              type="button"
              onClick={() => field.pushValue({ task: "" })}
            >
              <LuPlus />
            </button>
          </>
        )}
      </Field>

      <Subscribe
        selector={(state) => [state.values.assignedTo, state.values.tasks]}
      >
        {([assignedTo, tasks]) => {
          const hasValidTask =
            tasks?.length > 0 && tasks.some((t) => t?.task?.trim());
          return (
            <button
              disabled={!assignedTo || !hasValidTask || isPending}
              type="submit"
              className="btn btn-success w-full"
            >
              {isPending ? (
                <>
                  <div className="loading loading-spinner"></div> Assigning...
                </>
              ) : isMember ? (
                "Assign to Myself"
              ) : (
                "Assign"
              )}
            </button>
          );
        }}
      </Subscribe>
    </form>
  );
};

export default OrderAssign;
