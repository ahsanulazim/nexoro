"use client";

import { useState } from "react";
import {
  LuBuilding2,
  LuCalendar,
  LuCheck,
  LuCopy,
  LuMail,
  LuMessageSquare,
  LuPhone,
  LuPlus,
  LuSend,
  LuStar,
  LuTrash2,
  LuUser,
  LuX,
} from "react-icons/lu";

export default function QueryDetailModal({
  query,
  isOpen,
  onClose,
  onUpdateStatus,
  onToggleStar,
  onAddNote,
  onDeleteNote,
  isUpdating = false,
}) {
  const [noteText, setNoteText] = useState("");
  const [copiedField, setCopiedField] = useState(null);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  if (!isOpen || !query) return null;

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!noteText.trim() || isSubmittingNote) return;
    setIsSubmittingNote(true);
    try {
      await onAddNote(query._id, noteText.trim());
      setNoteText("");
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "unread":
        return <span className="badge badge-warning badge-sm font-semibold">Unread</span>;
      case "contacted":
        return <span className="badge badge-info badge-sm font-semibold">Contacted</span>;
      case "resolved":
        return <span className="badge badge-success badge-sm font-semibold">Resolved</span>;
      default:
        return <span className="badge badge-neutral badge-sm font-semibold">Read</span>;
    }
  };

  const formattedDate = new Date(query.createdAt || query.added).toLocaleString("en-BD", {
    timeZone: "Asia/Dhaka",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-base-100 rounded-3xl border border-base-300 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
              {query.name ? query.name.charAt(0).toUpperCase() : "Q"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base-content text-lg truncate">
                  {query.name}
                </h3>
                {getStatusBadge(query.status)}
              </div>
              <p className="text-xs text-base-content/60 flex items-center gap-1.5 mt-0.5">
                <LuCalendar className="size-3.5" />
                Submitted on {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleStar(query._id)}
              disabled={isUpdating}
              className={`btn btn-sm btn-circle ${
                query.isStarred
                  ? "btn-warning text-warning-content"
                  : "btn-ghost text-base-content/50 hover:text-warning"
              }`}
              title={query.isStarred ? "Starred" : "Star this query"}
            >
              <LuStar className={`size-4 ${query.isStarred ? "fill-current" : ""}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost text-base-content/60"
            >
              <LuX className="size-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Contact & Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Email */}
            <div className="p-3 rounded-2xl bg-base-200/60 border border-base-300/50 flex flex-col justify-between">
              <span className="text-[11px] text-base-content/60 font-medium flex items-center gap-1.5 mb-1">
                <LuMail className="size-3.5 text-primary" /> Email
              </span>
              <a
                href={`mailto:${query.email}`}
                className="text-xs font-semibold text-primary hover:underline break-all"
              >
                {query.email}
              </a>
              <div className="mt-2 flex items-center justify-between pt-1 border-t border-base-300/40">
                <button
                  type="button"
                  onClick={() => handleCopy(query.email, "email")}
                  className="text-[11px] text-base-content/60 hover:text-base-content flex items-center gap-1"
                >
                  {copiedField === "email" ? (
                    <>
                      <LuCheck className="size-3 text-success" /> Copied
                    </>
                  ) : (
                    <>
                      <LuCopy className="size-3" /> Copy
                    </>
                  )}
                </button>
                <a
                  href={`mailto:${query.email}`}
                  className="text-[11px] text-primary font-medium hover:underline"
                >
                  Send Email →
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="p-3 rounded-2xl bg-base-200/60 border border-base-300/50 flex flex-col justify-between">
              <span className="text-[11px] text-base-content/60 font-medium flex items-center gap-1.5 mb-1">
                <LuPhone className="size-3.5 text-info" /> Phone
              </span>
              <span className="text-xs font-semibold text-base-content">
                {query.phone || "Not provided"}
              </span>
              {query.phone ? (
                <div className="mt-2 flex items-center justify-between pt-1 border-t border-base-300/40">
                  <button
                    type="button"
                    onClick={() => handleCopy(query.phone, "phone")}
                    className="text-[11px] text-base-content/60 hover:text-base-content flex items-center gap-1"
                  >
                    {copiedField === "phone" ? (
                      <>
                        <LuCheck className="size-3 text-success" /> Copied
                      </>
                    ) : (
                      <>
                        <LuCopy className="size-3" /> Copy
                      </>
                    )}
                  </button>
                  <a
                    href={`tel:${query.phone}`}
                    className="text-[11px] text-info font-medium hover:underline"
                  >
                    Call →
                  </a>
                </div>
              ) : (
                <div className="mt-2 pt-1 border-t border-base-300/40 text-[11px] text-base-content/40">
                  No direct call
                </div>
              )}
            </div>

            {/* Company */}
            <div className="p-3 rounded-2xl bg-base-200/60 border border-base-300/50 flex flex-col justify-between">
              <span className="text-[11px] text-base-content/60 font-medium flex items-center gap-1.5 mb-1">
                <LuBuilding2 className="size-3.5 text-warning" /> Company
              </span>
              <span className="text-xs font-semibold text-base-content truncate">
                {query.company || "Individual / Not specified"}
              </span>
              <div className="mt-2 pt-1 border-t border-base-300/40 text-[11px] text-base-content/60">
                Source: Website Contact Form
              </div>
            </div>
          </div>

          {/* Status Change Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-base-200/40 rounded-2xl border border-base-300/60">
            <span className="text-xs font-medium text-base-content/70">
              Query Lifecycle Status:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: "unread", label: "Mark Unread", color: "btn-warning" },
                { id: "read", label: "Mark Read", color: "btn-neutral" },
                { id: "contacted", label: "Contacted", color: "btn-info" },
                { id: "resolved", label: "Resolved", color: "btn-success" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  disabled={isUpdating}
                  onClick={() => onUpdateStatus(query._id, s.id)}
                  className={`btn btn-xs rounded-lg transition-all ${
                    query.status === s.id
                      ? `${s.color} font-bold shadow-xs`
                      : "btn-ghost text-base-content/60 hover:text-base-content"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-base-content/80 uppercase tracking-wider flex items-center gap-1.5">
                <LuMessageSquare className="size-3.5 text-primary" /> Submitted Message
              </label>
              <button
                type="button"
                onClick={() => handleCopy(query.message, "message")}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                {copiedField === "message" ? (
                  <>
                    <LuCheck className="size-3 text-success" /> Copied Text
                  </>
                ) : (
                  <>
                    <LuCopy className="size-3" /> Copy Message
                  </>
                )}
              </button>
            </div>
            <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300/70 text-sm text-base-content leading-relaxed whitespace-pre-wrap select-text">
              {query.message}
            </div>
          </div>

          {/* Internal Team Notes */}
          <div className="space-y-3 pt-3 border-t border-base-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-base-content/80 uppercase tracking-wider">
                Internal Team Notes ({query.notes?.length || 0})
              </label>
              <span className="text-[11px] text-base-content/50">
                Visible only to admins & team members
              </span>
            </div>

            {/* Note Input */}
            <form onSubmit={handleNoteSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Add internal note (e.g. called client, proposal sent)..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="input input-sm input-bordered flex-1 rounded-xl bg-base-100 text-xs"
              />
              <button
                type="submit"
                disabled={!noteText.trim() || isSubmittingNote}
                className="btn btn-sm btn-primary rounded-xl shrink-0"
              >
                {isSubmittingNote ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <LuSend className="size-3.5" />
                )}
                Add Note
              </button>
            </form>

            {/* Notes List */}
            {query.notes && query.notes.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {query.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl bg-base-200/40 border border-base-300/50 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base-content">
                          {note.author || "Team Member"}
                        </span>
                        <span className="text-[10px] text-base-content/50">
                          {new Date(note.createdAt).toLocaleString("en-BD", {
                            timeZone: "Asia/Dhaka",
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                      <p className="text-base-content/80 whitespace-pre-wrap">
                        {note.text}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteNote(query._id, note.id)}
                      className="btn btn-ghost btn-xs btn-circle text-error/60 hover:text-error shrink-0"
                      title="Delete note"
                    >
                      <LuTrash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-base-content/40 italic py-1">
                No internal notes yet. Add follow-up remarks above.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-base-200/50 border-t border-base-200">
          <div className="flex items-center gap-2">
            <a
              href={`mailto:${query.email}`}
              className="btn btn-sm btn-primary rounded-xl"
            >
              <LuMail className="size-3.5" /> Email Client
            </a>
            {query.phone && (
              <a
                href={`tel:${query.phone}`}
                className="btn btn-sm btn-outline rounded-xl"
              >
                <LuPhone className="size-3.5" /> Call
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
