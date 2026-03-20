"use client";

import { updateOrderStatus } from "@/api/fetchCart";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const OrderAction = ({ order }) => {
  const mutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      toast.success("Status updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update status");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      status: order.status,
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
        defaultValue=""
        name="status"
        {...register("status", { required: false })}
      >
        <option value="" disabled={true}>
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
          disabled={mutation.isPending || order.status === "Cancelled"}
        >
          Cancel Order
        </button>
      </div>
    </form>
  );
};

export default OrderAction;
