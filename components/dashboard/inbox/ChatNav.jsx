"use client";

import { useAuth } from "@/context/AuthProvider";
import { useSocket } from "@/context/SocketProvider";
import { useParams } from "next/navigation";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaGlobe,
} from "react-icons/fa6";
import { LuBadgeCheck, LuPackageCheck, LuUserCheck } from "react-icons/lu";
import { getInitials, getAvatarColor } from "@/utils/messageGrouping";
import ConfirmOrderModal from "./ConfirmOrderModal";

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

  const role = currentUser?.user?.role;
  const isStaff = role === "admin" || role === "member";

  const cleanRoom = (id) => String(id || "").replace(/^(fb_|ig_|wa_|room_)/, "");
  const currentConversation = conversations?.find(
    (c) =>
      c?.roomId === currentRoom ||
      (c?.roomId && cleanRoom(c.roomId) === cleanRoom(currentRoom)),
  );

  const customer = currentConversation?.customer;
  const customerId = customer?._id || customer?.id;
  const isOnline = customerId ? Boolean(onlineStatuses[customerId]) : false;
  const isClient = Boolean(
    currentConversation?.isClient ||
      currentConversation?.clientId ||
      customer?.clientId
  );
  const customerName =
    customer?.userName || customer?.name || customer?.email || "Customer Support";
  const platform = currentConversation?.platform || "web";

  const renderPlatformInfo = () => {
    switch (platform) {
      case "whatsapp":
        return {
          label: "WhatsApp",
          color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
          icon: FaWhatsapp,
          subtext: customer?.phone || currentRoom?.replace("wa_", "+") || "WhatsApp Contact",
        };
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
      <div className="navbar bg-base-300/80 backdrop-blur shadow-xs px-4 py-2.5 justify-between border-b border-base-200">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div
              className={`size-10 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs uppercase shadow-inner relative border ${getAvatarColor(
                customerName || currentRoom
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
              className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-base-300 ${
                isOnline ? "bg-success" : "bg-base-content/30"
              }`}
              title={isOnline ? "Online" : "Offline"}
            />
          </div>

          {/* Name and Platform Details */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm md:text-base leading-tight">
                {customerName}
              </h3>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${platformInfo.color}`}
              >
                <PlatformIcon className="text-xs" />
                <span>{platformInfo.label}</span>
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
            </div>
            <div className="flex items-center gap-2 text-xs text-base-content/60 mt-0.5">
              <span>{platformInfo.subtext}</span>
              <span>•</span>
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  isOnline ? "text-success" : "text-base-content/40"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    isOnline ? "bg-success" : "bg-base-content/40"
                  }`}
                />
                {isOnline ? "Active Now" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-base-content/40 font-mono hidden xl:inline px-2 py-1 bg-base-200 rounded">
            {currentRoom}
          </span>

          {isStaff && currentRoom && (
            <button
              type="button"
              onClick={() => setIsConfirmOrderOpen(true)}
              className="btn btn-xs sm:btn-sm btn-primary gap-1.5 rounded-lg shadow-xs"
              title="Confirm Order & Auto-Add Customer as Client"
            >
              <LuPackageCheck className="size-4" />
              <span className="hidden sm:inline font-medium">Confirm Order</span>
            </button>
          )}

          {isStaff && (
            <button
              type="button"
              onClick={() => setIsCrmOpen(!isCrmOpen)}
              className={`btn btn-xs sm:btn-sm gap-1.5 rounded-lg transition-all ${
                isCrmOpen
                  ? "btn-primary shadow-xs"
                  : "btn-outline border-base-300 hover:border-primary/50 text-base-content"
              }`}
              title="Toggle Customer CRM Profile"
            >
              <LuUserCheck className="size-4" />
              <span className="hidden sm:inline font-medium">CRM Profile</span>
            </button>
          )}
        </div>
      </div>

      {isStaff && currentRoom && <ConfirmOrderModal roomId={currentRoom} />}
    </>
  );
};

export default ChatNav;
