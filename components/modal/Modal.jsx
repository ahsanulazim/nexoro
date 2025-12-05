"use client";

import { deleteUser } from "@/api/fetchUsers";
import auth from "@/firebase/firebase.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaTriangleExclamation } from "react-icons/fa6";
import { toast } from "react-toastify";

export default function Modal({ ref, remove }) {
  const [user] = useAuthState(auth);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteUser(remove),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("User removed successfully");
        queryClient.invalidateQueries({ queryKey: ["users", user?.uid] });
      } else {
        toast.error(data.message || "Failed to remove user");
      }
      ref.current.close();
    },
    onError: () => {
      toast.error("Something went wrong while deleting");
      ref.current.close();
    },
  })

  return (
    <>
      <dialog ref={ref} id="my_modal_1" className="modal">
        <div className="modal-box">
          <div className="avatar avatar-placeholder flex justify-center">
            <div className="bg-error text-error-content w-20 rounded-full">
              <span className="text-3xl">
                <FaTriangleExclamation />
              </span>
            </div>
          </div>

          <p className="py-4 text-center text-balance">
            You are going to remove him. Are you sure?
          </p>
          <div className="modal-action justify-center gap-x-8">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-success rounded-md">
                No, Keep Him
              </button>
            </form>

            <button
              type="submit"
              onClick={() => mutate()}
              className="btn btn-error rounded-md"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner"></span>
                  loading
                </>
              ) : (
                <>Yes, Remove Him</>
              )}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
