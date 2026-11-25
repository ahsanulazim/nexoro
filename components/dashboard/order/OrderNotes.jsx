"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrderNote, deleteOrderNote } from "@/api/fetchOrder";
import { toast } from "react-toastify";
import moment from "moment";
import { LuPlus, LuStickyNote, LuTrash2, LuLock } from "react-icons/lu";
import { useAuth } from "@/context/AuthProvider";

const OrderNotes = ({ order }) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [noteText, setNoteText] = useState("");

  const role = currentUser?.user?.role;
  const isStaff = role === "admin" || role === "member";
  const currentUserEmail = currentUser?.user?.email?.toLowerCase() || "";
  const isAdmin = role === "admin";

  const orderId = order?._id || order?.orderId;
  const notes = Array.isArray(order?.internalNotes) ? order.internalNotes : [];
  const orderNote = order?.orderNote;

  const addMutation = useMutation({
    mutationFn: addOrderNote,
    onSuccess: () => {
      setNoteText("");
      queryClient.invalidateQueries({ queryKey: ["order"] });
      toast.success("Internal note added");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add note");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrderNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
      toast.success("Note deleted");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete note");
    },
  });

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim() || !orderId) return;
    addMutation.mutate({ orderId, text: noteText.trim() });
  };

  if (!isStaff) return null;

  return (
    <div className="bg-base-100 rounded-box p-5 border border-base-200/80 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-base-200">
        <div className="flex items-center gap-2">
          <LuStickyNote className="text-amber-500 size-5" />
          <h2 className="font-bold text-base text-base-content">
            Internal Staff Notes
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-warning badge-soft badge-sm gap-1 font-medium">
            <LuLock className="size-3" /> Staff Only
          </span>
          <span className="text-xs opacity-60">
            {notes.length + (orderNote ? 1 : 0)} {notes.length + (orderNote ? 1 : 0) === 1 ? "note" : "notes"}
          </span>
        </div>
      </div>

      {/* Initial Order Requirement / Deal Note (if available) */}
      {orderNote && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span className="flex items-center gap-1.5">
              <span>📌 Order Requirements / Scope</span>
            </span>
            <span className="text-[10px] opacity-75 font-normal">On Order Creation</span>
          </div>
          <p className="text-xs text-base-content/90 whitespace-pre-wrap leading-relaxed pt-1">
            {orderNote}
          </p>
        </div>
      )}

      {/* Add Note Form */}
      <form onSubmit={handleAddNote} className="space-y-2">
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Add an internal note or instructions for the team (visible only to staff)..."
          className="textarea textarea-bordered textarea-sm w-full bg-base-200/50 focus:bg-base-100 focus:outline-hidden rounded-xl resize-none text-xs leading-relaxed"
          rows={2}
          disabled={addMutation.isPending}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={addMutation.isPending || !noteText.trim()}
            className="btn btn-primary btn-xs rounded-lg gap-1.5"
          >
            {addMutation.isPending ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <>
                <LuPlus className="size-3.5" />
                <span>Add Note</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Notes List */}
      {notes.length === 0 && !orderNote ? (
        <div className="py-4 text-center text-xs opacity-50 bg-base-200/40 rounded-xl">
          No internal notes added yet.
        </div>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {notes.map((note) => {
            const isAuthor =
              note.authorEmail &&
              note.authorEmail.toLowerCase() === currentUserEmail;
            const canDelete = isAdmin || isAuthor;

            return (
              <li
                key={note._id}
                className="p-3 rounded-xl bg-base-200/50 hover:bg-base-200 border border-base-content/5 text-xs space-y-1.5 relative group transition-colors"
              >
                <p className="text-base-content/90 whitespace-pre-wrap leading-relaxed">
                  {note.text}
                </p>
                <div className="flex items-center justify-between text-[11px] opacity-60 pt-1.5 border-t border-base-content/5">
                  <span className="font-semibold text-amber-500">
                    {note.author || "Staff"}
                  </span>
                  <span>{moment(note.createdAt).fromNow()}</span>
                </div>
                {canDelete && (
                  <button
                    type="button"
                    onClick={() =>
                      deleteMutation.mutate({ orderId, noteId: note._id })
                    }
                    disabled={deleteMutation.isPending}
                    className="btn btn-ghost btn-circle btn-xs text-error absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete note"
                  >
                    <LuTrash2 className="size-3.5" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default OrderNotes;
