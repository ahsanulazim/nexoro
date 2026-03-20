"use client";

import { deleteOrder } from "@/api/fetchCart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const OrderModal = ({ ref, orderId }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => deleteOrder(id),
    onMutate: async (newOrderId) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
      const previousOrders = queryClient.getQueryData(["orders"]);
      queryClient.setQueryData(["orders"], (oldOrders) =>
        oldOrders
          ? oldOrders.filter((order) => order.orderId !== newOrderId)
          : [],
      );
      return { previousOrders };
    },
    onSuccess: () => {
      toast.success("Order deleted successfully");
      ref.current.close();
    },
    onSettled: () => {
      // Always refetch to keep UI in sync
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error, newOrderId, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(["orders"], context.previousOrders);
      }
      toast.error("Failed to delete order");
    },
  });
  const handleDelete = () => {
    mutation.mutate(orderId);
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          Are you Sure you want to delete this order?
        </h3>
        <p className="py-4">You won't be able to revert this action!</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              onClick={handleDelete}
              type="button"
              className="btn btn-error mr-3"
            >
              Delete Order
            </button>
            <button type="submit" className="btn btn-warning">
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default OrderModal;
