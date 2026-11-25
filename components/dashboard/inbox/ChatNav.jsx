"use client";

import { useAuth } from "@/context/AuthProvider";
import { useSocket } from "@/context/SocketProvider";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaGlobe } from "react-icons/fa6";
import {
  LuBadgeCheck,
  LuBookmark,
  LuBookmarkCheck,
  LuPackageCheck,
  LuUserCheck,
  LuArrowLeft,
  LuBan,
  LuShieldCheck,
  LuPhone,
  LuMegaphone,
} from "react-icons/lu";
import { getInitials, getAvatarColor } from "@/utils/messageGrouping";
import { useWhatsAppCall } from "@/context/WhatsAppCallContext";
import ConfirmOrderModal from "./ConfirmOrderModal";
import BlockUserModal from "./BlockUserModal";
import FollowUpModal from "./FollowUpModal";

const ChatNav = () => {
  const { message: currentRoom } = useParams();
  const { currentUser } = useAuth();
  const {
    onlineStatuses,
    conversations,
    isCrmOpen,
    setIsCrmOpen,
    setIsConfirmOrderOpen,
  } = useSocket();
  const { startCall } = useWhatsAppCall();

  const role = currentUser?.user?.role;
  const isStaff = role === "admin" || role === "member";

  const cleanRoom = (id) => {
    if (!id) return "";
    const decoded = decodeURIComponent(String(id)).trim();
    const stripped = decoded.replace(/^(fb_|ig_|wa_|room_)/, "");
    const digits = stripped.replace(/[^0-9]/g, "");
    if (digits.length >= 10) {
      return digits.slice(-10);
    }
    return stripped.toLowerCase();
  };
  const currentConversation = conversations?.find(
    (c) =>
      c?.roomId === currentRoom ||
      (c?.roomId && cleanRoom(c.roomId) === cleanRoom(currentRoom)),
  );

  const customer = currentConversation?.customer;
  const customerId = customer?._id || customer?.id;
  const platform = currentConversation?.platform || "web";
  const isBlocked = Boolean(currentConversation?.isBlocked);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

  // Calculate active status & WhatsApp 24h window
  const activeStatusInfo = useMemo(() => {
    if (platform === "whatsapp") {
      const lastActivity =
        currentConversation?.lastCustomerMessageAt ||
        currentConversation?.updatedAt;
      if (!lastActivity) {
        return {
          isOnline: false,
          label: "Offline",
          dotColor: "bg-base-content/40",
          textColor: "text-base-content/40",
          sessionBadge: null,
        };
      }

      const diffMs = Date.now() - new Date(lastActivity).getTime();
      const isWithin5Mins = diffMs <= 5 * 60 * 1000;
      const isWithin24Hours = diffMs <= 24 * 60 * 60 * 1000;
      const hoursLeft = Math.max(
        0,
        Math.floor((24 * 3600 * 1000 - diffMs) / (3600 * 1000)),
      );

      if (isWithin5Mins) {
        return {
          isOnline: true,
          label: "Active Now",
          dotColor: "bg-success",
          textColor: "text-success",
          sessionBadge: {
            text: `24h (${hoursLeft}h left)`,
            style:
              "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
          },
        };
      }

      if (isWithin24Hours) {
        return {
          isOnline: true,
          label: hoursLeft > 0 ? `Active ${hoursLeft}h ago` : "Active today",
          dotColor: "bg-emerald-500",
          textColor: "text-emerald-500",
          sessionBadge: {
            text: `24h (${hoursLeft}h left)`,
            style: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
          },
        };
      }

      return {
        isOnline: false,
        label: "24h Window Expired",
        dotColor: "bg-amber-500/60",
        textColor: "text-amber-600 dark:text-amber-400",
        sessionBadge: {
          text: "Templates Only (Window Expired)",
          style:
            "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25",
        },
      };
    }

    // Web / Other platform check
    const isOnline = customerId ? Boolean(onlineStatuses[customerId]) : false;
    return {
      isOnline,
      label: isOnline ? "Active Now" : "Offline",
      dotColor: isOnline ? "bg-success" : "bg-base-content/40",
      textColor: isOnline ? "text-success" : "text-base-content/40",
      sessionBadge: null,
    };
  }, [platform, currentConversation, customerId, onlineStatuses]);

  const isClient = Boolean(
    currentConversation?.isClient ||
    currentConversation?.clientId ||
    customer?.clientId,
  );
  const customerName =
    customer?.userName ||
    customer?.name ||
    customer?.email ||
    "Customer Support";

  const renderPlatformInfo = () => {
    switch (platform) {
      case "whatsapp": {
        const rawClean = cleanRoom(currentRoom);
        const isPurePhone = /^\+?[0-9]+$/.test(rawClean);
        let waSubtext = "WhatsApp Contact";
        if (customer?.phone) {
          waSubtext = customer.phone;
        } else if (
          customer?.userName &&
          customer.userName !== "WhatsApp User"
        ) {
          waSubtext = customer.userName.startsWith("@")
            ? customer.userName
            : `@${customer.userName}`;
        } else if (isPurePhone) {
          waSubtext = `+${rawClean.replace(/[^0-9]/g, "")}`;
        }

        return {
          label: "WhatsApp",
          color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
          icon: FaWhatsapp,
          subtext: waSubtext,
        };
      }
      case "facebook":
        return {
          label: "Facebook Messenger",
          color: "bg-blue-600/10 text-blue-600 border-blue-600/20",
          icon: FaFacebookF,
          subtext: "Meta Messenger",
        };
      case "instagram":
        return {
          label: "Instagram DM",
          color: "bg-pink-500/10 text-pink-500 border-pink-500/20",
          icon: FaInstagram,
          subtext: "Instagram Direct",
        };
      case "web":
      default:
        return {
          label: "Web Chat",
          color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
          icon: FaGlobe,
          subtext: customer?.email || "Website Client",
        };
    }
  };

  const platformInfo = renderPlatformInfo();
  const PlatformIcon = platformInfo.icon;

  return (
    <>
      <div className="navbar bg-base-300/80 backdrop-blur shadow-xs px-2.5 sm:px-4 py-2 justify-between border-b border-base-200">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Back to List Button */}
          <Link
            href="/dashboard/inbox"
            className="btn btn-ghost btn-circle btn-sm lg:hidden -ml-1 text-base-content shrink-0"
            title="Back to inbox"
          >
            <LuArrowLeft className="size-5" />
          </Link>

          {/* Avatar */}
          <div className="relative">
            <div
              className={`size-10 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs uppercase shadow-inner relative border ${getAvatarColor(
                customerName || currentRoom,
              )}`}
            >
              <span className="pointer-events-none select-none">
                {getInitials(customerName)}
              </span>
              {customer?.avatar && (
                <img
                  src={customer.avatar}
                  alt={customerName}
                  className="absolute inset-0 size-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>
            <span
              className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-base-300 ${activeStatusInfo.dotColor}`}
              title={activeStatusInfo.label}
            />
          </div>

          {/* Name and Platform Details */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm md:text-base leading-tight line-clamp-1">
                {customerName}
              </h3>
              <span className={`${platformInfo.color}`}>
                <PlatformIcon className="text-xs" />
              </span>
              {isClient && (
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/25"
                  title="Verified Client in Clients Directory"
                >
                  <LuBadgeCheck className="size-3" />
                  <span>Client</span>
                </span>
              )}
              {isBlocked && (
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-error/15 text-error border border-error/25"
                  title="Blocked Contact"
                >
                  <LuBan className="size-3" />
                  <span>Blocked</span>
                </span>
              )}
              {currentConversation?.isFollowUp && (
                <button
                  type="button"
                  onClick={() => setIsFollowUpModalOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 hover:bg-amber-500/25 transition-colors cursor-pointer"
                  title={`Follow-Up: ${currentConversation.followUpReason || "Important"}${
                    currentConversation.followUpDueDate
                      ? ` (Due: ${new Date(currentConversation.followUpDueDate).toLocaleString()})`
                      : ""
                  } - Click to edit`}
                >
                  <LuBookmarkCheck className="size-3 text-amber-500" />
                  <span>Follow-Up</span>
                  {currentConversation.followUpPriority &&
                    currentConversation.followUpPriority !== "medium" && (
                      <span className="uppercase text-[9px] font-bold opacity-80">
                        ({currentConversation.followUpPriority})
                      </span>
                    )}
                </button>
              )}
              {currentConversation?.referral && (
                <button
                  type="button"
                  onClick={() => setIsCrmOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 hover:bg-amber-500/25 transition-colors cursor-pointer"
                  title={`Meta Ad Campaign: ${currentConversation.referral.headline || "Sponsored Ad"} (Click to view in CRM)`}
                >
                  <LuMegaphone className="size-3" />
                  <span>Meta Ad Lead</span>
                </button>
              )}
              {/* {activeStatusInfo.sessionBadge && (
                <span
                  className={`badge badge-xs ${activeStatusInfo.sessionBadge.style}`}
                  title="WhatsApp 24-Hour Customer Care Window"
                >
                  {activeStatusInfo.sessionBadge.text}
                </span>
              )} */}
            </div>
            <div className="flex items-center gap-2 text-xs text-base-content/60 mt-0.5">
              {/* <span>{platformInfo.subtext}</span>
              <span>•</span> */}
              {activeStatusInfo.sessionBadge && (
                <span
                  className={`badge badge-xs ${activeStatusInfo.sessionBadge.style}`}
                  title="WhatsApp 24-Hour Customer Care Window"
                >
                  {activeStatusInfo.sessionBadge.text}
                </span>
              )}
              <span>-</span>
              <span
                className={`inline-flex items-center max-xs:text-[8px] text-xs font-medium ${activeStatusInfo.textColor}`}
              >
                {activeStatusInfo.label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-base-content/40 font-mono hidden xl:inline px-2 py-1 bg-base-200 rounded">
            {currentRoom}
          </span>

          {isStaff && platform === "whatsapp" && (
            <button
              type="button"
              onClick={() => {
                const targetNumber =
                  customer?.phone ||
                  (currentConversation?.platformId &&
                  /^\d+$/.test(currentConversation.platformId)
                    ? currentConversation.platformId
                    : currentRoom?.replace(/^(wa_|fb_|ig_)/, ""));
                startCall({
                  phoneNumber: targetNumber,
                  customerName,
                  roomId: currentRoom,
                });
              }}
              className="btn max-sm:btn-square btn-sm btn-outline btn-success rounded-box gap-1.5"
              title="Call Customer via WhatsApp Voice"
            >
              <LuPhone className="size-4" />
              <span className="max-sm:hidden">WhatsApp Call</span>
            </button>
          )}

          {isStaff && currentRoom && (
            <button
              type="button"
              onClick={() => setIsFollowUpModalOpen(true)}
              className={`btn max-sm:btn-square btn-sm rounded-box gap-1.5 ${
                currentConversation?.isFollowUp
                  ? "btn-warning text-warning-content shadow-xs"
                  : "btn-outline btn-warning hover:bg-warning hover:text-warning-content"
              }`}
              title={
                currentConversation?.isFollowUp
                  ? "Edit Follow-Up details"
                  : "Mark this chat for follow-up"
              }
            >
              <LuBookmarkCheck className="size-4" />
              <span className="max-sm:hidden">
                {currentConversation?.isFollowUp ? "Follow-Up" : "Follow Up"}
              </span>
            </button>
          )}

          {isStaff && currentRoom && (
            <button
              type="button"
              onClick={() => setIsConfirmOrderOpen(true)}
              className="btn max-sm:btn-square btn-sm btn-primary rounded-box"
              title="Confirm Order & Auto-Add Customer as Client"
            >
              <LuPackageCheck />
              <span className="max-sm:hidden">Confirm Order</span>
            </button>
          )}

          {isStaff && (
            <button
              type="button"
              onClick={() => setIsCrmOpen(!isCrmOpen)}
              className={`btn max-sm:btn-square btn-sm rounded-box xl:hidden ${
                isCrmOpen ? "btn-primary" : "btn-outline btn-primary"
              }`}
              title="Toggle Customer CRM Profile"
            >
              <LuUserCheck />
              <span className="max-sm:hidden">CRM Profile</span>
            </button>
          )}

          {/* {isStaff && currentRoom && (
            <button
              type="button"
              onClick={() => setIsBlockModalOpen(true)}
              className={`btn max-sm:btn-square btn-sm rounded-box ${
                isBlocked
                  ? "btn-outline btn-success"
                  : "btn-outline btn-error hover:bg-error hover:text-white"
              }`}
              title={isBlocked ? "Unblock this contact" : "Block this contact"}
            >
              {isBlocked ? (
                <LuShieldCheck className="size-4" />
              ) : (
                <LuBan className="size-4" />
              )}
              <span className="max-sm:hidden">
                {isBlocked ? "Unblock" : "Block"}
              </span>
            </button>
          )} */}
        </div>
      </div>

      {isStaff && currentRoom && <ConfirmOrderModal roomId={currentRoom} />}

      {isStaff && currentRoom && (
        <BlockUserModal
          isOpen={isBlockModalOpen}
          onClose={() => setIsBlockModalOpen(false)}
          conversation={
            currentConversation || { roomId: currentRoom, platform, isBlocked }
          }
        />
      )}

      {isStaff && currentRoom && (
        <FollowUpModal
          isOpen={isFollowUpModalOpen}
          onClose={() => setIsFollowUpModalOpen(false)}
          conversation={
            currentConversation || { roomId: currentRoom, platform }
          }
        />
      )}
    </>
  );
};

export default ChatNav;
