"use client";

import { deleteExpense } from "@/api/fetchExpense";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const ExpenseDeleteModal = ({ ref, id }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense deleted successfully");
      ref.current.close();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const handleDelete = async () => {
    mutation.mutate(id);
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          Are you sure you want to delete this expense?
        </h3>
        <p className="py-4">You won't be able to revert this action!</p>
        <div className="modal-action">
          <form method="dialog" className="space-x-5">
            {/* if there is a button in form, it will close the modal */}
            <button type="submit" className="btn btn-soft">
              Close
            </button>
            <button
              onClick={handleDelete}
              type="button"
              className="btn btn-error"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Deleting
                </>
              ) : (
                "Delete Expense"
              )}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ExpenseDeleteModal;
