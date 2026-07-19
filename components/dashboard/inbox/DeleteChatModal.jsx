import { deleteConversation } from "@/api/fetchConversation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FaTriangleExclamation } from "react-icons/fa6";
import { toast } from "react-toastify";

const DeleteChatModal = ({ ref, chat }) => {
  const navigate = useRouter();

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteConversation,
    onSuccess: () => {
      toast.success("Chat deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      ref.current.close();
      navigate.push("/dashboard/inbox");
    },
    onError: () => {
      toast.error("Something went wrong while deleting");
      ref.current.close();
    },
  });
  return (
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
          You are going to Delete this conversation. Are you sure?
        </p>
        <div className="modal-action justify-center gap-x-8">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-success rounded-md">No, Keep it</button>
          </form>

          <button
            type="submit"
            className="btn btn-error rounded-md"
            disabled={isPending}
            onClick={() => mutate(chat?.roomId)}
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner"></span>
                loading
              </>
            ) : (
              <>Yes, Remove It</>
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteChatModal;
