"use client";

import { assignOrder } from "@/api/fetchOrder";
import { MyContext } from "@/context/MyProvider";
import { useForm } from "@tanstack/react-form-nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "react-toastify";

const OrderAssign = ({ order }) => {
  const { team, teamLoading, teamError } = useContext(MyContext);
  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: {
      assignedTo: "",
    },
    onSubmit: ({ value }) => {
      mutate({ orderId: order._id, value });
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: assignOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
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
      <Subscribe
        selector={(state) => state.values.assignedTo}
        children={(assignedTo) => (
          <button
            disabled={!assignedTo || isPending}
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
        )}
      />
    </form>
  );
};

export default OrderAssign;
