"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleBlockConversation } from "@/api/fetchConversation";
import { toast } from "react-toastify";
import {
  LuBan,
  LuCheck,
  LuLoader,
  LuShieldAlert,
  LuShieldCheck,
  LuX,
} from "react-icons/lu";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaGlobe } from "react-icons/fa6";

const BlockUserModal = ({ isOpen, onClose, conversation, onSuccess }) => {
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();

  const isBlocked = Boolean(conversation?.isBlocked);
  const roomId = conversation?.roomId;
  const platform =
    conversation?.platform ||
    (roomId?.startsWith("wa_")
      ? "whatsapp"
      : roomId?.startsWith("fb_")
        ? "facebook"
        : roomId?.startsWith("ig_")
          ? "instagram"
          : "web");

  const customerName =
    conversation?.customer?.userName ||
    conversation?.customer?.name ||
    conversation?.customer?.email ||
    "Customer";

  const { mutate, isPending } = useMutation({
    mutationFn: toggleBlockConversation,
    onSuccess: (data) => {
      const msg = data?.message || (isBlocked ? "Contact unblocked" : "Contact blocked");
      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["crmDetails", roomId] });
      if (onSuccess) onSuccess(data);
      onClose();
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
          "Failed to update block status. Please try again."
      );
    },
  });

  if (!isOpen || !conversation) return null;

  const handleConfirm = () => {
    mutate({
      roomId,
      reason: reason.trim(),
    });
  };

  const renderPlatformBadge = () => {
    switch (platform) {
      case "whatsapp":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <FaWhatsapp />
            <span>WhatsApp Business</span>
          </span>
        );
      case "facebook":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/10 text-blue-600 border border-blue-600/20 text-xs font-semibold">
            <FaFacebookF />
            <span>Facebook Messenger</span>
          </span>
        );
      case "instagram":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20 text-xs font-semibold">
            <FaInstagram />
            <span>Instagram Direct</span>
          </span>
        );
      case "web":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 text-xs font-semibold">
            <FaGlobe />
            <span>Web Live Chat</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-base-100 border border-base-300 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col scale-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-200 bg-base-200/50">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl ${
                isBlocked
                  ? "bg-success/10 text-success"
                  : "bg-error/10 text-error"
              }`}
            >
              {isBlocked ? (
                <LuShieldCheck className="size-5" />
              ) : (
                <LuShieldAlert className="size-5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-base text-base-content">
                {isBlocked ? "Unblock Contact" : "Block Contact"}
              </h3>
              <p className="text-xs text-base-content/60">
                Unified Inbox Access Control
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

        {/* Body */}
        <div className="p-5 space-y-4 text-sm">
          {/* Target Customer Info */}
          <div className="p-3.5 rounded-xl bg-base-200/70 border border-base-300/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wide block">
                Target User
              </span>
              <p className="font-bold text-base-content text-sm mt-0.5 truncate max-w-[220px]">
                {customerName}
              </p>
            </div>
            <div>{renderPlatformBadge()}</div>
          </div>

          {/* Description */}
          <div className="space-y-2 text-xs text-base-content/80 leading-relaxed">
            {isBlocked ? (
              <p>
                Unblocking will restore incoming messages from this user into your
                unified inbox and re-allow staff to send messages and replies.
              </p>
            ) : (
              <>
                <p>
                  Blocking this customer will immediately stop incoming messages
                  from cluttering your unified inbox and prevent staff from sending
                  messages.
                </p>
                {platform === "whatsapp" && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                    💡 WhatsApp Cloud API will also receive a block command for this phone number.
                  </p>
                )}
                {(platform === "facebook" || platform === "instagram") && (
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                    💡 Meta Moderate Conversations API will be triggered to block conversations on {platform === "facebook" ? "Facebook Messenger" : "Instagram Direct"}.
                  </p>
                )}
              </>
            )}
          </div>

          {/* Reason Input (only when blocking) */}
          {!isBlocked && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-base-content/70">
                Reason (Optional)
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Spam messages, abusive conduct, fake inquiries"
                className="input input-sm w-full bg-base-200 border-base-300 text-xs rounded-lg focus:outline-primary"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-base-200 bg-base-200/30">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="btn btn-sm btn-ghost rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className={`btn btn-sm rounded-lg gap-1.5 ${
              isBlocked ? "btn-success text-white" : "btn-error text-white"
            }`}
          >
            {isPending ? (
              <>
                <LuLoader className="size-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : isBlocked ? (
              <>
                <LuCheck className="size-4" />
                <span>Confirm Unblock</span>
              </>
            ) : (
              <>
                <LuBan className="size-4" />
                <span>Block User</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockUserModal;
