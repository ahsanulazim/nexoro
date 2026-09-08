"use client";

import { updateOrderStatus } from "@/api/fetchCart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const OrderAction = ({ order }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      status: order?.status || "",
    },
  });

  useEffect(() => {
    if (order?.status) {
      reset({ status: order.status });
    }
  }, [order?.status, reset]);

  const mutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (data, variables) => {
      toast.success("Status updated successfully");
      reset({ status: variables.status });
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update status");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({ orderId: order._id, status: data.status });
  };

  const onCancel = () => {
    mutation.mutate({ orderId: order._id, status: "Cancelled" });
  };

  return (
    <form className="fieldset mt-5" onSubmit={handleSubmit(onSubmit)}>
      <select
        className="select w-full mb-5"
        {...register("status", { required: true })}
      >
        <option value="" disabled>
          Select Status
        </option>
        <option value="Pending">Pending</option>
        <option value="Processing">Processing</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <div className="flex gap-5">
        <button
          type="submit"
          className="btn btn-success flex-1"
          disabled={!isDirty || mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <div className="loading loading-spinner"></div> Updating...
            </>
          ) : (
            "Update Status"
          )}
        </button>
        <button
          onClick={onCancel}
          type="button"
          className="btn btn-error flex-1"
          disabled={mutation.isPending || order?.status === "Cancelled"}
        >
          Cancel Order
        </button>
      </div>
    </form>
  );
};

export default OrderAction;
