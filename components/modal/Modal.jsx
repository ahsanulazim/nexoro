"use client";

import { MyContext } from "@/context/MyProvider";
import auth from "@/firebase/firebase.config";
import { useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaTriangleExclamation } from "react-icons/fa6";
import { toast } from "react-toastify";

export default function Modal({ ref, remove }) {
  //Loader Button State
  const [loading, setLoading] = useState(false);
  const { serverUrl } = useContext(MyContext);
  const [user] = useAuthState(auth);

  const handleRemove = async () => {
    setLoading(true);
    try {
      const token = await user?.getIdToken();
      console.log(token);

      const response = await fetch(`${serverUrl}/users/${remove}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 403) {
        setLoading(false);
        toast.error("You do not have permission to delete users.");
        return;
      }

      const result = await response.json();

      if (result.success) {
        setLoading(false);
        toast.success("User deleted successfully");
        ref.current.close();
        // Optionally redirect or refresh
      } else {
        setLoading(false);
        toast.error(result.message || "Deletion failed");
        ref.current.close();
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong while deleting");
      ref.current.close();
    } finally {
      setLoading(false);
      ref.current.close();
    }
  };

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
              onClick={handleRemove}
              className="btn btn-error rounded-md"
              disabled={loading ? true : false}
            >
              {loading ? (
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
