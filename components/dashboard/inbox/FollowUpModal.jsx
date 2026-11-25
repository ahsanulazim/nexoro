"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFollowUpConversation } from "@/api/fetchConversation";
import { toast } from "react-toastify";
import moment from "moment";
import {
  LuBookmarkCheck,
  LuCalendar,
  LuClock,
  LuFlag,
  LuSparkles,
  LuTrash2,
  LuX,
  LuCheck,
} from "react-icons/lu";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaGlobe } from "react-icons/fa6";

const PRESET_REASONS = [
  "Pricing & Quotation",
  "Pending Client Decision",
  "Call / Meeting Follow-up",
  "Payment Follow-up",
  "Requirements Clarification",
  "Urgent VIP Inquiry",
];

const FollowUpModalDialog = ({ conversation, onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  const roomId = conversation?.roomId;
  const isCurrentlyMarked = Boolean(conversation?.isFollowUp);

  const [reason, setReason] = useState(conversation?.followUpReason || "");
  const [priority, setPriority] = useState(
    conversation?.followUpPriority || "medium"
  );
  const [dueDate, setDueDate] = useState(() => {
    if (conversation?.followUpDueDate) {
      return moment(conversation.followUpDueDate).format("YYYY-MM-DDTHH:mm");
    }
    return "";
  });

  const customerName =
    conversation?.customer?.userName ||
    conversation?.customer?.name ||
    conversation?.customer?.email ||
    "Customer";

  const platform =
    conversation?.platform ||
    (roomId?.startsWith("wa_")
      ? "whatsapp"
      : roomId?.startsWith("fb_")
        ? "facebook"
        : roomId?.startsWith("ig_")
          ? "instagram"
          : "web");

  const { mutate, isPending } = useMutation({
    mutationFn: toggleFollowUpConversation,
    onSuccess: (data) => {
      const msg =
        data?.message ||
        (data?.isFollowUp
          ? "Conversation marked for follow-up"
          : "Follow-up mark removed");
      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (roomId) {
        queryClient.invalidateQueries({ queryKey: ["crmDetails", roomId] });
      }
      if (onSuccess) onSuccess(data);
      onClose();
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
          "Failed to update follow-up status. Please try again."
      );
    },
  });

  const handleSave = (e) => {
    e?.preventDefault();
    mutate({
      roomId,
      isFollowUp: true,
      reason: reason.trim() || "Important follow-up",
      dueDate: dueDate || null,
      priority,
    });
  };

  const handleRemoveFollowUp = () => {
    mutate({
      roomId,
      isFollowUp: false,
    });
  };

  const setQuickTime = (type) => {
    const now = moment();
    let target;
    if (type === "2hours") {
      target = now.add(2, "hours");
    } else if (type === "tomorrow") {
      target = now.add(1, "day").hour(11).minute(0);
    } else if (type === "3days") {
      target = now.add(3, "days").hour(11).minute(0);
    } else if (type === "nextweek") {
      target = now.add(7, "days").hour(11).minute(0);
    }
    if (target) {
      setDueDate(target.format("YYYY-MM-DDTHH:mm"));
    }
  };

  const renderPlatformBadge = () => {
    switch (platform) {
      case "whatsapp":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <FaWhatsapp /> <span>WhatsApp</span>
          </span>
        );
      case "facebook":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-600 border border-blue-600/20 text-xs font-semibold">
            <FaFacebookF /> <span>Messenger</span>
          </span>
        );
      case "instagram":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20 text-xs font-semibold">
            <FaInstagram /> <span>Instagram</span>
          </span>
        );
      case "web":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 text-xs font-semibold">
            <FaGlobe /> <span>Web</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-base-100 rounded-2xl shadow-2xl border border-base-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-base-200 bg-base-200/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-xs">
              <LuBookmarkCheck className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {isCurrentlyMarked ? "Edit Follow-Up" : "Mark Chat for Follow-Up"}
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                Pin and track important conversations needing your attention
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content"
          >
            <LuX className="size-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Target Customer Info */}
          <div className="p-3 rounded-xl bg-base-200/40 border border-base-200 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs text-base-content/50 uppercase tracking-wider font-semibold">
                Customer Chat
              </p>
              <h4 className="font-bold text-sm truncate text-base-content">
                {customerName}
              </h4>
            </div>
            {renderPlatformBadge()}
          </div>

          {/* Quick preset suggestions */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-base-content/70 flex items-center gap-1.5">
              <LuSparkles className="size-3.5 text-amber-500" />
              <span>Quick Presets</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_REASONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setReason(preset)}
                  className={`btn btn-xs rounded-lg transition-colors font-medium ${
                    reason === preset
                      ? "btn-warning text-warning-content shadow-xs"
                      : "btn-ghost bg-base-200/80 hover:bg-base-300 text-base-content/80"
                  }`}
                >
                  {reason === preset && <LuCheck className="size-3" />}
                  <span>{preset}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reason / Note input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-base-content/70">
              Follow-Up Reason or Note <span className="text-error">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Client requested custom quotation for 10-page e-commerce app..."
              rows={2}
              className="textarea textarea-bordered w-full text-xs rounded-xl focus:textarea-warning leading-relaxed"
              required
            />
          </div>

          {/* Priority selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-base-content/70 flex items-center gap-1.5">
              <LuFlag className="size-3.5" />
              <span>Priority Level</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "low", label: "Low", color: "text-base-content/70 border-base-300 hover:border-base-content/40", active: "bg-base-300 font-bold border-base-content/40" },
                { id: "medium", label: "Normal", color: "text-blue-600 border-blue-500/20 hover:border-blue-500", active: "bg-blue-500/15 text-blue-600 border-blue-500 font-bold" },
                { id: "high", label: "High", color: "text-amber-600 border-amber-500/20 hover:border-amber-500", active: "bg-amber-500/15 text-amber-600 border-amber-500 font-bold" },
                { id: "urgent", label: "Urgent", color: "text-error border-error/20 hover:border-error", active: "bg-error/15 text-error border-error font-bold" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  className={`btn btn-sm text-xs rounded-xl border transition-all ${
                    priority === p.id ? p.active : `btn-ghost bg-base-100 ${p.color}`
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-base-content/70 flex items-center gap-1.5">
                <LuClock className="size-3.5" />
                <span>Due Date & Reminder (Optional)</span>
              </label>
              {dueDate && (
                <button
                  type="button"
                  onClick={() => setDueDate("")}
                  className="text-[11px] text-error hover:underline cursor-pointer"
                >
                  Clear Date
                </button>
              )}
            </div>

            {/* Quick date shortcuts */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "2hours", label: "In 2 Hours" },
                { id: "tomorrow", label: "Tomorrow 11 AM" },
                { id: "3days", label: "In 3 Days" },
                { id: "nextweek", label: "Next Week" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setQuickTime(btn.id)}
                  className="btn btn-xs btn-outline rounded-lg text-[11px] font-normal"
                >
                  <LuCalendar className="size-3" />
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>

            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input input-bordered input-sm w-full text-xs rounded-xl focus:input-warning"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-base-200 flex items-center justify-between gap-2">
            {isCurrentlyMarked ? (
              <button
                type="button"
                onClick={handleRemoveFollowUp}
                disabled={isPending}
                className="btn btn-sm btn-outline btn-error gap-1.5 rounded-xl text-xs"
              >
                <LuTrash2 className="size-3.5" />
                <span>Remove Follow-Up</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="btn btn-sm btn-ghost rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || !reason.trim()}
                className="btn btn-sm btn-warning gap-1.5 rounded-xl text-xs font-bold text-warning-content shadow-xs"
              >
                {isPending ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <LuBookmarkCheck className="size-4" />
                )}
                <span>{isCurrentlyMarked ? "Update Follow-Up" : "Save Follow-Up"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const FollowUpModal = ({ isOpen, onClose, conversation, onSuccess }) => {
  if (!isOpen || !conversation) return null;

  return (
    <FollowUpModalDialog
      key={`${conversation?.roomId || "modal"}-${conversation?.isFollowUp ? "marked" : "unmarked"}`}
      conversation={conversation}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
};

export default FollowUpModal;
