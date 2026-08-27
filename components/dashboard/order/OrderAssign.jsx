"use client";

import { assignOrder } from "@/api/fetchOrder";
import { MyContext } from "@/context/MyProvider";
import { useForm } from "@tanstack/react-form-nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { toast } from "react-toastify";

const OrderAssign = ({ order }) => {
  const { team, teamLoading, teamError } = useContext(MyContext);
  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: {
      assignedTo: "",
      tasks: [{ task: "" }],
    },
    onSubmit: ({ value }) => {
      mutate({ orderId: order._id, value });
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: assignOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
      toast.success("Order assigned successfully");
    },
    onError: () => {
      toast.error("Failed to assign order");
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
              Select Member
            </option>
            {teamLoading ? (
              <option value="">Loading...</option>
            ) : teamError ? (
              <option value="">No team members available</option>
            ) : (
              team.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.memberName} - {member.role}
                </option>
              ))
            )}
          </select>
        )}
      </Field>
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
        children={([assignedTo, tasks]) => {
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
              ) : (
                "Assign"
              )}
            </button>
          );
        }}
      />
    </form>
  );
};

export default OrderAssign;
