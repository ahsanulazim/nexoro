"use client";

import { updateOrderStatus } from "@/api/fetchCart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useRef } from "react";
import {
  LuBan,
  LuCircleCheck,
  LuCircleX,
  LuClock,
  LuInfo,
  LuLoader,
} from "react-icons/lu";
import { toast } from "react-toastify";

const OrderAction = ({ order }) => {
  const queryClient = useQueryClient();
  const cancelModalRef = useRef(null);

  const mutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      toast.success("Order cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      cancelModalRef.current?.close();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to cancel order",
      );
    },
  });

  const currentStatus = order?.status || "Pending";
  const isCancelled = currentStatus === "Cancelled";
  const isCompleted = currentStatus === "Completed";
  const isProcessing = currentStatus === "Processing";
  const isPending = currentStatus === "Pending";

  const handleConfirmCancel = () => {
    mutation.mutate({ orderId: order._id, status: "Cancelled" });
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* Current Dynamic Status Card */}
      <div
        className={`p-4 rounded-xl border transition-all ${
          isCompleted
            ? "bg-success/10 border-success/30 text-success"
            : isProcessing
              ? "bg-warning/10 border-warning/30 text-warning"
              : isCancelled
                ? "bg-error/10 border-error/30 text-error"
                : "bg-info/10 border-info/30 text-info"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
            Current Status
          </span>
          <span
            className={`badge font-bold gap-1 text-xs py-2.5 px-3 ${
              isCompleted
                ? "badge-success text-success-content"
                : isProcessing
                  ? "badge-warning text-warning-content"
                  : isCancelled
                    ? "badge-error text-error-content"
                    : "badge-info text-info-content"
            }`}
          >
            {isCompleted && <LuCircleCheck className="size-3.5" />}
            {isProcessing && <LuLoader className="size-3.5 animate-spin" />}
            {isCancelled && <LuCircleX className="size-3.5" />}
            {isPending && <LuClock className="size-3.5" />}
            {currentStatus}
          </span>
        </div>

        <p className="text-xs text-base-content/80 mt-2">
          {isCompleted &&
            "All project tasks are finished. This order is marked as completed."}
          {isProcessing &&
            "Tasks are actively in progress by the assigned team member."}
          {isCancelled &&
            "This order was cancelled by a team administrator or member."}
          {isPending &&
            "Order is pending initial task creation and member assignment."}
        </p>
      </div>

      {/* Project Deadline Card */}
      {order?.deadline && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-2 ${
            moment(order.deadline).isBefore(moment(), "day") && !isCompleted
              ? "bg-error/10 border-error/30 text-error"
              : "bg-base-200/60 border-base-content/10"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg ${
                moment(order.deadline).isBefore(moment(), "day") && !isCompleted
                  ? "bg-error/20 text-error"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <LuClock className="size-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">
                Project Deadline
              </span>
              <span className="text-xs font-semibold">
                {moment(order.deadline).format("LL")}
              </span>
            </div>
          </div>
          <span
            className={`badge badge-sm font-semibold ${
              moment(order.deadline).isBefore(moment(), "day") && !isCompleted
                ? "badge-error text-error-content"
                : "badge-primary badge-soft text-primary"
            }`}
          >
            {moment(order.deadline).fromNow()}
          </span>
        </div>
      )}

      {/* Dynamic Workflow Info */}
      <div className="bg-base-200/60 border border-base-content/10 p-3.5 rounded-xl text-xs flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-semibold text-base-content/80">
          <LuInfo className="size-3.5 text-primary shrink-0" />
          <span>Automated Status Lifecycle</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-center mt-1">
          <div
            className={`p-1.5 rounded-lg border text-[11px] font-medium transition-all ${
              isPending
                ? "bg-primary/15 border-primary text-primary font-bold shadow-xs"
                : "bg-base-100 border-base-content/10 opacity-70"
            }`}
          >
            1. Pending
          </div>
          <div
            className={`p-1.5 rounded-lg border text-[11px] font-medium transition-all ${
              isProcessing
                ? "bg-warning/15 border-warning text-warning font-bold shadow-xs"
                : "bg-base-100 border-base-content/10 opacity-70"
            }`}
          >
            2. Processing
          </div>
          <div
            className={`p-1.5 rounded-lg border text-[11px] font-medium transition-all ${
              isCompleted
                ? "bg-success/15 border-success text-success font-bold shadow-xs"
                : "bg-base-100 border-base-content/10 opacity-70"
            }`}
          >
            3. Completed
          </div>
        </div>
        <span className="text-[10px] text-base-content/60 leading-tight">
          Status updates automatically when tasks are assigned and completed.
        </span>
      </div>

      {/* Cancel Action */}
      {!isCancelled ? (
        <div>
          <button
            onClick={() => cancelModalRef.current?.showModal()}
            type="button"
            className="btn btn-error btn-outline w-full gap-2 font-medium"
            disabled={mutation.isPending}
          >
            <LuBan className="size-4" />
            Cancel Order
          </button>
        </div>
      ) : (
        <div className="alert alert-error text-xs py-2 px-3 shadow-xs">
          <LuCircleX className="size-4 shrink-0" />
          <span>This order has been cancelled and is inactive.</span>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <dialog ref={cancelModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg flex items-center gap-2 text-error">
            <LuBan className="size-5" /> Cancel Order
          </h3>
          <p className="py-4 text-sm text-base-content/80">
            Are you sure you want to cancel order{" "}
            <span className="font-semibold text-base-content">
              #{order?.orderId || order?._id}
            </span>
            ? This will set its status to <strong>Cancelled</strong>.
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => cancelModalRef.current?.close()}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="btn btn-error btn-sm"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Cancelling...
                  </>
                ) : (
                  "Confirm Cancel"
                )}
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default OrderAction;
