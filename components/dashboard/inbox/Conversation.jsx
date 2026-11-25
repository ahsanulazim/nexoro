"use client";
import api from "@/axios/axiosInstance";
import { useAuth } from "@/context/AuthProvider";
import { useSocket } from "@/context/SocketProvider";
import { auth } from "@/firebase/firebase.config";
import Link from "next/link";
import { memo, useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from "react-icons/io5";
import {
  LuArrowDown,
  LuArrowUp,
  LuBookmarkCheck,
  LuCircleAlert,
  LuClock,
  LuCloudUpload,
  LuCornerUpLeft,
  LuFile,
  LuInfo,
  LuPaperclip,
  LuSend,
  LuX,
  LuZap,
  LuBan,
  LuShieldCheck,
  LuCreditCard,
  LuExternalLink,
} from "react-icons/lu";
import { toast } from "react-toastify";
import CRMPanel from "./CRMPanel";
import CannedResponsesModal from "./CannedResponsesModal";
import BlockUserModal from "./BlockUserModal";
import FollowUpModal from "./FollowUpModal";
import { toggleFollowUpConversation } from "@/api/fetchConversation";
import moment from "moment";
import MessageAttachments from "./attachments/MessageAttachments";
import AttachmentComposerPreview from "./attachments/AttachmentComposerPreview";
import {
  groupMessages,
  getInitials,
  getAvatarColor,
  formatMessageTime,
  formatFullDateTime,
} from "@/utils/messageGrouping";
import {
  validateFileBatch,
  categorizeAttachment,
} from "@/utils/attachmentHelper";

const QUICK_SLASH_HINTS = [
  {
    shortcut: "/greeting",
    label: "Greeting",
    text: "Hello! Thank you for reaching out to Nexoro Solutions. How can we assist you today?",
  },
  {
    shortcut: "/services",
    label: "Services",
    text: "We provide Web Development, Mobile Apps, UI/UX Design, and Digital Marketing. Let us know your requirements or check our portfolio for details!",
  },
  {
    shortcut: "/pricing",
    label: "Pricing",
    text: "Our service pricing is tailored based on project scope. Please let us know your requirements, or view our plans on our website.",
  },
  {
    shortcut: "/call",
    label: "Call",
    text: "Would you like to schedule a quick 10-minute consultation call? Please let us know what time works best for you.",
  },
  {
    shortcut: "/hours",
    label: "Hours",
    text: "Our team is available Saturday to Thursday, 10:00 AM - 7:00 PM. We will get back to you shortly.",
  },
  {
    shortcut: "/payment",
    label: "Payment",
    text: "We accept payments via bKash, Nagad, Bank Transfer, and Credit/Debit cards. You can also pay directly through our client dashboard.",
  },
];

const cleanRoomId = (r) => {
  if (!r) return "";
  const decoded = decodeURIComponent(String(r)).trim();
  const stripped = decoded.replace(/^(fb_|ig_|wa_|room_)/, "");
  const digits = stripped.replace(/[^0-9]/g, "");
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return stripped.toLowerCase();
};

/**
 * Helper: Extract payment URL from message text or deal object
 */
const extractPaymentUrl = (msg) => {
  if (msg?.deal?.paymentUrl) return msg.deal.paymentUrl;
  if (!msg?.text) return null;
  const match = msg.text.match(
    /(https?:\/\/[^\s<>'"]+\/pay\/[^\s<>'"]+|\/pay\/[^\s<>'"]+)/i,
  );
  return match ? match[0] : null;
};

/**
 * Helper: Autolink all URLs inside message text
 */
const renderFormattedMessageText = (text, isMe) => {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s<>'"]+|www\.[^\s<>'"]+)/gi;
  const parts = text.split(urlRegex);

  return (
    <p className="whitespace-pre-wrap leading-relaxed select-text">
      {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          const href = part.startsWith("http") ? part : `https://${part}`;
          const isPayLink = part.includes("/pay/");

          return (
            <a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`underline font-bold break-all transition-all inline-flex items-center gap-0.5 cursor-pointer select-text ${
                isPayLink
                  ? isMe
                    ? "text-yellow-300 hover:text-white bg-black/25 px-1 py-0.5 rounded"
                    : "text-primary hover:underline bg-primary/10 px-1 py-0.5 rounded"
                  : isMe
                    ? "text-primary-content hover:underline"
                    : "text-primary hover:underline"
              }`}
            >
              <span>{part}</span>
              <LuExternalLink className="size-3 shrink-0 inline-block ml-0.5" />
            </a>
          );
        }
        return part;
      })}
    </p>
  );
};

/**
 * Memoized Timeline Item so typing in the composer never re-renders message bubbles.
 */
const TimelineItemView = memo(function TimelineItemView({
  item,
  customerName,
  customerAvatar,
  onReply,
}) {
  if (item.type === "date-separator") {
    return (
      <div className="flex items-center justify-center my-4">
        <span className="text-[11px] font-semibold text-base-content/60 bg-base-200/90 border border-base-300/40 px-3 py-1 rounded-full shadow-2xs select-none">
          {item.label}
        </span>
      </div>
    );
  }

  if (item.type === "system-message") {
    return (
      <div className="flex justify-center my-3">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-medium max-w-md text-center shadow-2xs">
          <LuInfo className="size-3.5 shrink-0" />
          <span>{item.message.text || "System Event"}</span>
        </div>
      </div>
    );
  }

  const isMe = item.isMe;
  const lastMsgTime =
    item.lastMessage?.formattedTime ||
    formatMessageTime(item.lastMessage?.createdAt);

  return (
    <div
      className={`flex flex-col mb-3.5 [content-visibility:auto] [contain-intrinsic-size:0_64px] ${
        isMe ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`flex flex-col space-y-1 w-full ${
          isMe ? "items-end" : "items-start"
        }`}
      >
        {item.messages.map((msg) => {
          const timeLabel =
            msg.formattedTime || formatMessageTime(msg.createdAt);
          const fullDateLabel =
            msg.formattedFullDate || formatFullDateTime(msg.createdAt);

          return (
            <div
              key={msg._id || msg.metaMessageId}
              className={`flex items-start gap-2 max-w-[85%] md:max-w-[75%] group/msg ${
                isMe ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar only at beginning of incoming group, placeholder otherwise */}
              {!isMe && (
                <div className="shrink-0 size-8 mt-0.5">
                  {msg.showAvatar ? (
                    <div
                      className={`size-8 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs uppercase shadow-2xs select-none relative border shrink-0 ${getAvatarColor(
                        customerName || msg.senderName || item.senderId,
                      )}`}
                    >
                      <span className="pointer-events-none select-none">
                        {getInitials(customerName || msg.senderName)}
                      </span>
                      {(customerAvatar || msg.senderAvatar) && (
                        <img
                          src={customerAvatar || msg.senderAvatar}
                          alt={customerName || msg.senderName || "Customer"}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 size-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="size-8" aria-hidden="true" />
                  )}
                </div>
              )}

              {/* Bubble and Actions */}
              <div className="relative group max-w-full">
                <div
                  className={`relative p-2.5 sm:p-3 text-sm shadow-2xs transition-all wrap-break-word ${
                    isMe
                      ? "bg-primary text-primary-content"
                      : "bg-base-200 text-base-content border border-base-300/60"
                  } ${msg.bubbleCornerClass}`}
                  title={fullDateLabel}
                >
                  {/* Reply preview */}
                  {msg.replyTo && (
                    <div
                      className={`border-l-3 rounded-sm border-l-info text-xs p-2 pointer-events-none mb-1.5 opacity-80 ${
                        isMe
                          ? "bg-black/20 text-primary-content"
                          : "bg-base-100 text-base-content"
                      }`}
                    >
                      <p className="truncate flex items-center gap-1">
                        {msg.replyTo.text ? (
                          msg.replyTo.text
                        ) : (
                          <>
                            <LuFile className="inline size-3 shrink-0" />
                            <span>Attachment</span>
                          </>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <MessageAttachments
                      attachments={msg.attachments}
                      isMe={isMe}
                    />
                  )}

                  {/* Text with clickable URLs */}
                  {msg.text && renderFormattedMessageText(msg.text, isMe)}

                  {/* Deal / Invoice Card (Shown if msg.deal exists or if any /pay/ URL is detected in text) */}
                  {(() => {
                    const payUrl = extractPaymentUrl(msg);
                    if (!msg.deal && !payUrl) return null;

                    const title =
                      msg.deal?.serviceName || "Custom Deal Invoice";
                    const amount = msg.deal?.amount;
                    const status = msg.deal?.status || "Pending";

                    return (
                      <div
                        className={`mt-2.5 p-3 rounded-xl border text-xs space-y-2.5 ${
                          isMe
                            ? "bg-black/30 border-white/20 text-white"
                            : "bg-base-100 border-base-300 text-base-content"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold flex items-center gap-1.5 truncate">
                            <LuCreditCard className="size-4 text-primary shrink-0" />
                            <span className="truncate">{title}</span>
                          </span>
                          <span
                            className={`badge badge-xs font-semibold shrink-0 ${
                              status === "Paid"
                                ? "badge-success text-success-content"
                                : "badge-warning"
                            }`}
                          >
                            {status}
                          </span>
                        </div>

                        {amount !== undefined && amount !== null && (
                          <div className="text-sm font-black text-primary">
                            BDT {Number(amount).toLocaleString()}
                          </div>
                        )}

                        {payUrl && (
                          <a
                            href={payUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="btn btn-xs btn-primary w-full gap-1.5 font-bold shadow-xs cursor-pointer select-none"
                          >
                            <span>Open Payment / Invoice Page</span>
                            <LuExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Hover Reply Button */}
                <button
                  type="button"
                  onClick={() =>
                    onReply({
                      messageId: msg._id,
                      senderId: msg.senderId,
                      text: msg.text,
                      attachments: msg.attachments,
                    })
                  }
                  className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover/msg:opacity-100 btn btn-circle btn-xs btn-neutral border border-base-300 transition-opacity z-10 ${
                    isMe ? "-left-8" : "-right-8"
                  }`}
                  title="Reply"
                >
                  <LuCornerUpLeft className="size-3" />
                </button>
              </div>

              {/* Exact time on hover next to bubble */}
              <span className="opacity-0 group-hover/msg:opacity-100 transition-opacity text-[10px] text-base-content/50 select-none self-center shrink-0 px-1">
                {timeLabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* Group Footer: subtle timestamp and delivery/read receipt for outgoing only */}
      <div
        className={`flex items-center gap-1.5 text-[10px] text-base-content/50 mt-1 select-none ${
          isMe ? "pr-1" : "pl-10"
        }`}
      >
        <span>{lastMsgTime}</span>
        {isMe && (
          <span>
            {item.lastMessage.deliveryStatus === "failed" ? (
              <span
                className="text-error inline-flex items-center gap-0.5"
                title={item.lastMessage.failureReason || "Failed to deliver"}
              >
                <LuCircleAlert className="size-3 inline" />
                <span className="text-[9px]">Failed</span>
              </span>
            ) : item.lastMessage.deliveryStatus === "read" ||
              Boolean(item.lastMessage.readAt) ? (
              <IoCheckmarkDoneSharp
                className="text-info text-xs inline"
                title="Seen"
              />
            ) : item.lastMessage.deliveryStatus === "delivered" ? (
              <IoCheckmarkDoneSharp
                className="text-xs inline opacity-70"
                title="Delivered"
              />
            ) : item.lastMessage.deliveryStatus === "sent" ? (
              <IoCheckmarkSharp
                className="text-xs inline opacity-60"
                title="Sent"
              />
            ) : item.lastMessage.deliveryStatus === "pending" ? (
              <LuClock
                className="size-2.5 inline opacity-50 animate-pulse"
                title="Sending..."
              />
            ) : (
              <IoCheckmarkSharp
                className="text-xs inline opacity-60"
                title="Sent"
              />
            )}
          </span>
        )}
      </div>
    </div>
  );
});

const Conversation = ({ currentRoom }) => {
  const { socket, conversations } = useSocket();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const chatBottomRef = useRef(null);
  const chatContentRef = useRef(null);
  const cannedRef = useRef(null);
  const fileInputRef = useRef(null);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [stagedFiles, setStagedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isConversationDeleted, setIsConversationDeleted] = useState(false);
  const [showSlashHints, setShowSlashHints] = useState(false);
  const [showNewMessagesPill, setShowNewMessagesPill] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleCompleteFollowUp = useCallback(async () => {
    try {
      await toggleFollowUpConversation({
        roomId: currentRoom,
        isFollowUp: false,
      });
      toast.success("Follow-up marked as completed");
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["crmDetails", currentRoom] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update follow-up");
    }
  }, [currentRoom, queryClient]);
  const isNearBottomRef = useRef(true);
  const messagesCountRef = useRef(0);
  const role = currentUser?.user?.role;
  const isStaff = role === "admin" || role === "member";

  const { data: cannedResponses = [] } = useQuery({
    queryKey: ["cannedResponses"],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get("/conversations/cannedResponses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.success ? res.data.data : [];
    },
    enabled: role === "admin" || role === "member",
  });

  useEffect(() => {
    messagesCountRef.current = messages.length;
  }, [messages.length]);

  // Check if user is scrolled near bottom of chat
  const checkIfNearBottom = useCallback(() => {
    const el = chatEndRef.current;
    if (!el) return true;
    const threshold = 120;
    const isNear =
      el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
    isNearBottomRef.current = isNear;
    if (isNear) {
      setShowNewMessagesPill(false);
    }
    return isNear;
  }, []);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    chatBottomRef.current?.scrollIntoView({ behavior });
    setShowNewMessagesPill(false);
    isNearBottomRef.current = true;
  }, []);

  // Keep scroll anchored to bottom on content changes (images/media loading, container resizing)
  useEffect(() => {
    const scrollContainer = chatEndRef.current;
    const contentEl = chatContentRef.current;
    if (!scrollContainer || !contentEl) return;

    let rafId;
    const ro = new ResizeObserver(() => {
      if (isNearBottomRef.current) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          if (scrollContainer && isNearBottomRef.current) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
          }
        });
      }
    });

    ro.observe(contentEl);
    ro.observe(scrollContainer);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [currentRoom]);

  const handleLoadMore = async () => {
    if (loading || !hasMore || !currentRoom) return;

    const scrollContainer = chatEndRef.current;
    const prevScrollHeight = scrollContainer ? scrollContainer.scrollHeight : 0;
    const prevScrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const cursorParam =
        nextCursor || (messages.length > 0 ? messages[0]?.createdAt : null);

      const res = await api.get("/conversations/getMessages", {
        params: {
          roomId: currentRoom,
          page: page + 1,
          limit: 25,
          ...(cursorParam ? { before: cursorParam } : {}),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = res.data;
      if (result.success && result.data?.length > 0) {
        // Prepend older messages
        setMessages((prev) => [...result.data, ...prev]);
        setPage((prev) => prev + 1);
        setHasMore(result.pagination?.hasMore ?? false);
        setNextCursor(
          result.pagination?.nextCursor || result.data[0]?.createdAt || null,
        );

        // Preserve scroll position so reading isn't interrupted
        requestAnimationFrame(() => {
          if (scrollContainer) {
            const newScrollHeight = scrollContainer.scrollHeight;
            scrollContainer.scrollTop =
              newScrollHeight - prevScrollHeight + prevScrollTop;
          }
        });
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.log("Error loading more messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // ১. রুম চেঞ্জ হলে মেসেজ হিস্ট্রি ফেচ করা
  useEffect(() => {
    if (!currentRoom || !currentUser || !socket) return;

    const joinRoom = () => {
      socket.emit("joinRoom", { roomId: currentRoom });
      socket.emit("markAsRead", { roomId: currentRoom });
    };

    if (socket.connected) {
      joinRoom();
    }

    socket.on("connect", joinRoom);

    const fetchMessages = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();

        const res = await api.get("/conversations/getMessages", {
          params: {
            roomId: currentRoom,
            page: 1,
            limit: 25,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = res.data;
        if (result.success) {
          setMessages(result.data);
          setPage(1);
          setHasMore(result.pagination?.hasMore ?? false);
          setNextCursor(
            result.pagination?.nextCursor ||
              result.data?.[0]?.createdAt ||
              null,
          );
          setShowNewMessagesPill(false);
          isNearBottomRef.current = true;
          // Initial message load scroll down
          setTimeout(
            () =>
              chatBottomRef.current?.scrollIntoView({ behavior: "instant" }),
            50,
          );
        }
      } catch (err) {
        console.log("Error fetching messages:", err);
      }
    };

    fetchMessages();

    return () => {
      socket.off("connect", joinRoom);
      socket.emit("leaveRoom", { roomId: currentRoom });
    };
  }, [currentRoom, currentUser, socket]);

  // ২. রিয়েলটাইম মেসেজ রিসিভ ও সিঙ্ক লিসেনার (messages.length ডিপেন্ডেন্সি ছাড়া, যাতে প্রতি মেসেজে লিসেনার রি-বাইন্ড না হয়)
  useEffect(() => {
    if (!socket || !currentRoom) return;

    const handleReceiveMessage = (newMsg) => {
      const isMatch =
        newMsg.roomId === currentRoom ||
        cleanRoomId(newMsg.roomId) === cleanRoomId(currentRoom);

      if (isMatch) {
        setMessages((prev) => {
          // 1. If this message matches an optimistic pending message, swap it in-place
          const tempIdx = prev.findIndex(
            (m) =>
              m._id &&
              String(m._id).startsWith("temp_") &&
              m.text === newMsg.text &&
              (m.senderId === newMsg.senderId ||
                m.senderRole === newMsg.senderRole),
          );

          if (tempIdx !== -1) {
            const next = [...prev];
            next[tempIdx] = newMsg;
            return next;
          }

          // 2. Check for duplicate messages by ID or content window
          const exists = prev.some(
            (m) =>
              (m._id && newMsg._id && String(m._id) === String(newMsg._id)) ||
              (m.metaMessageId &&
                newMsg.metaMessageId &&
                m.metaMessageId === newMsg.metaMessageId) ||
              (m.externalMetaId &&
                newMsg.metaMessageId &&
                m.externalMetaId === newMsg.metaMessageId),
          );
          if (exists) return prev;
          return [...prev, newMsg];
        });

        const isMe =
          newMsg.senderId === currentUser?.user?._id ||
          (["admin", "member"].includes(role) &&
            ["admin", "member"].includes(newMsg.senderRole));

        // Auto-scroll if user is sending or already near bottom, else show pill
        if (isMe || isNearBottomRef.current) {
          setTimeout(
            () => chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }),
            50,
          );
          setShowNewMessagesPill(false);
        } else {
          setShowNewMessagesPill(true);
        }

        // যদি অন্য কেউ মেসেজ পাঠায় তবে লাইভ markAsRead ট্রিগার হবে
        if (
          (role === "customer" &&
            ["admin", "member"].includes(newMsg.senderRole)) ||
          (["admin", "member"].includes(role) &&
            newMsg.senderRole === "customer")
        ) {
          socket.emit("markAsRead", { roomId: currentRoom });
        }
      }
    };

    const handleConversationSynced = async (data) => {
      const targetRoom = data?.roomId;
      if (!targetRoom) return;
      const isMatch =
        targetRoom === currentRoom ||
        cleanRoomId(targetRoom) === cleanRoomId(currentRoom);

      if (!isMatch) return;

      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await api.get("/conversations/getMessages", {
          params: {
            roomId: currentRoom,
            page: 1,
            limit: Math.min(Math.max(messagesCountRef.current, 25), 100),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = res.data;
        if (result.success && Array.isArray(result.data)) {
          setMessages(result.data);
          if (isNearBottomRef.current) {
            setTimeout(
              () =>
                chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }),
              50,
            );
          }
        }
      } catch (err) {
        console.log("Error silently refreshing messages:", err);
      }
    };

    const handleMessagesRead = ({ roomId }) => {
      if (
        roomId === currentRoom ||
        cleanRoomId(roomId) === cleanRoomId(currentRoom)
      ) {
        setMessages((prev) =>
          prev.map((m) => {
            const isOutgoing =
              m.senderId === currentUser?.user?._id ||
              (["admin", "member"].includes(role) &&
                ["admin", "member"].includes(m.senderRole));

            if (isOutgoing) {
              // Outgoing messages only become "read" when the recipient reads it
              return m;
            }
            return m.isRead ? m : { ...m, isRead: true };
          }),
        );
      }
    };

    const handleConversationDeleted = ({ roomId }) => {
      if (
        roomId === currentRoom ||
        cleanRoomId(roomId) === cleanRoomId(currentRoom)
      ) {
        setIsConversationDeleted(true);
      }
    };

    const handleDeliveryFailed = ({ roomId, message }) => {
      if (
        roomId === currentRoom ||
        cleanRoomId(roomId) === cleanRoomId(currentRoom)
      ) {
        toast.error(message || "Message delivery to external channel failed.");
        setMessages((prev) => {
          const lastPendingIdx = [...prev]
            .reverse()
            .findIndex(
              (m) =>
                m._id?.startsWith("temp_") || m.deliveryStatus === "pending",
            );
          if (lastPendingIdx === -1) return prev;
          const realIdx = prev.length - 1 - lastPendingIdx;
          const next = [...prev];
          next[realIdx] = {
            ...next[realIdx],
            deliveryStatus: "failed",
            failureReason: message || "Failed to deliver",
          };
          return next;
        });
      }
    };

    const handleMessageStatusUpdate = ({
      messageId,
      metaMessageId,
      status,
      roomId: statusRoom,
      failureReason,
    }) => {
      if (
        statusRoom === currentRoom ||
        cleanRoomId(statusRoom) === cleanRoomId(currentRoom)
      ) {
        setMessages((prev) =>
          prev.map((msg) => {
            const isMatch =
              (messageId && msg._id && String(msg._id) === String(messageId)) ||
              (metaMessageId &&
                msg.metaMessageId &&
                msg.metaMessageId === metaMessageId) ||
              (metaMessageId &&
                msg.externalMetaId &&
                msg.externalMetaId === metaMessageId);

            if (!isMatch) return msg;

            return {
              ...msg,
              deliveryStatus: status,
              isRead: status === "read" ? true : msg.isRead,
              failureReason: failureReason || msg.failureReason,
            };
          }),
        );
      }
    };

    const handleBlockStatusUpdated = ({ roomId }) => {
      if (!roomId) return;
      if (
        roomId === currentRoom ||
        cleanRoomId(roomId) === cleanRoomId(currentRoom)
      ) {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("conversationMessagesSynced", handleConversationSynced);
    socket.on("messagesRead", handleMessagesRead);
    socket.on("conversationDeleted", handleConversationDeleted);
    socket.on("messageDeliveryFailed", handleDeliveryFailed);
    socket.on("messageStatusUpdate", handleMessageStatusUpdate);
    socket.on("conversationBlockStatusUpdated", handleBlockStatusUpdated);

    const handleLocalMessage = (e) => {
      if (e?.detail) {
        handleReceiveMessage(e.detail);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("localMessageSent", handleLocalMessage);
    }

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("conversationMessagesSynced", handleConversationSynced);
      socket.off("messagesRead", handleMessagesRead);
      socket.off("conversationDeleted", handleConversationDeleted);
      socket.off("messageDeliveryFailed", handleDeliveryFailed);
      socket.off("messageStatusUpdate", handleMessageStatusUpdate);
      socket.off("conversationBlockStatusUpdated", handleBlockStatusUpdated);
      if (typeof window !== "undefined") {
        window.removeEventListener("localMessageSent", handleLocalMessage);
      }
    };
  }, [socket, currentRoom, role, currentUser?.user?._id, queryClient]);

  // Determine active platform from currentRoom or conversation
  const currentConversation = useMemo(() => {
    return conversations?.find(
      (c) =>
        c?.roomId === currentRoom ||
        (c?.roomId && cleanRoomId(c.roomId) === cleanRoomId(currentRoom)),
    );
  }, [conversations, currentRoom]);

  const activePlatform = useMemo(() => {
    if (!currentRoom) return "web";
    if (currentRoom.startsWith("fb_")) return "facebook";
    if (currentRoom.startsWith("ig_")) return "instagram";
    if (currentRoom.startsWith("wa_")) return "whatsapp";
    if (currentConversation?.platform) return currentConversation.platform;
    return "web";
  }, [currentRoom, currentConversation]);

  const isBlocked = Boolean(currentConversation?.isBlocked);

  const isWhatsAppSessionExpired = useMemo(() => {
    if (activePlatform !== "whatsapp") return false;
    const lastAct =
      currentConversation?.lastCustomerMessageAt ||
      currentConversation?.updatedAt;
    if (!lastAct) return false;
    return Date.now() - new Date(lastAct).getTime() > 24 * 60 * 60 * 1000;
  }, [activePlatform, currentConversation]);

  // ৩. One-time sync when opening a Facebook conversation (webhooks handle live messages)
  useEffect(() => {
    if (!currentRoom || activePlatform !== "facebook") return;

    let isMounted = true;
    const initialTimer = setTimeout(async () => {
      if (!isMounted) return;
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;
        await api.post(
          `/facebook/sync?roomId=${currentRoom}&limit=10`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } catch (e) {
        // Silent catch for background sync
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
    };
  }, [currentRoom, activePlatform]);

  // Clean up staged local preview URLs on unmount or room change
  useEffect(() => {
    return () => {
      stagedFiles.forEach((it) => {
        if (it.localPreviewUrl) URL.revokeObjectURL(it.localPreviewUrl);
      });
    };
  }, [currentRoom]);

  // Upload individual staged item to server
  const uploadStagedItem = async (item) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const formData = new FormData();
      formData.append("files", item.file);
      formData.append("platform", activePlatform);
      formData.append("folder", "chat_attachments");

      const res = await api.post("/conversations/uploadAttachments", formData, {
        signal: item.abortController.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || item.size;
          const percent = Math.min(
            99,
            Math.round((progressEvent.loaded * 100) / total),
          );
          setStagedFiles((prev) =>
            prev.map((it) =>
              it.id === item.id ? { ...it, progress: percent } : it,
            ),
          );
        },
      });

      if (res.data?.success && res.data?.data?.length > 0) {
        const uploaded = res.data.data[0];
        setStagedFiles((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? {
                  ...it,
                  status: "ready",
                  progress: 100,
                  uploadedAttachment: uploaded,
                }
              : it,
          ),
        );
      } else {
        throw new Error(res.data?.message || "Upload failed");
      }
    } catch (err) {
      if (err.name === "CanceledError" || err.message === "canceled") {
        return; // User cancelled
      }
      console.error("Upload error for file:", item.name, err);
      const errMsg =
        err.response?.data?.message || err.message || "Upload failed";
      setStagedFiles((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? { ...it, status: "error", errorMessage: errMsg }
            : it,
        ),
      );
      toast.error(`Upload failed: ${item.name} (${errMsg})`);
    }
  };

  // Stage files from picker, drag & drop, or clipboard paste
  const handleStageFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);

    const batchRes = validateFileBatch(
      files,
      stagedFiles.length,
      activePlatform,
    );
    if (!batchRes.valid) {
      return toast.error(batchRes.error);
    }

    const newItems = files.map((f) => {
      const category = categorizeAttachment(f.type, f.name);
      const localPreviewUrl =
        category === "image" ? URL.createObjectURL(f) : null;
      return {
        id: `staged_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        file: f,
        name: f.name,
        size: f.size,
        category,
        status: "uploading",
        progress: 0,
        localPreviewUrl,
        uploadedAttachment: null,
        errorMessage: null,
        abortController: new AbortController(),
      };
    });

    setStagedFiles((prev) => [...prev, ...newItems]);

    // Launch upload for each item
    for (const item of newItems) {
      uploadStagedItem(item);
    }
  };

  const handleRetryUpload = useCallback(
    (itemId) => {
      const target = stagedFiles.find((it) => it.id === itemId);
      if (!target) return;

      const updated = {
        ...target,
        status: "uploading",
        progress: 0,
        errorMessage: null,
        abortController: new AbortController(),
      };

      setStagedFiles((prev) =>
        prev.map((it) => (it.id === itemId ? updated : it)),
      );
      uploadStagedItem(updated);
    },
    [stagedFiles],
  );

  const handleRemoveStaged = useCallback((itemId) => {
    setStagedFiles((prev) => {
      const target = prev.find((it) => it.id === itemId);
      if (target) {
        if (target.abortController) {
          target.abortController.abort();
        }
        if (target.localPreviewUrl) {
          URL.revokeObjectURL(target.localPreviewUrl);
        }
      }
      return prev.filter((it) => it.id !== itemId);
    });
  }, []);

  // Clipboard paste listener
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const pastedFiles = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file") {
        const file = items[i].getAsFile();
        if (file) pastedFiles.push(file);
      }
    }
    if (pastedFiles.length > 0) {
      e.preventDefault();
      handleStageFiles(pastedFiles);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingOver) setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer?.files?.length > 0) {
      handleStageFiles(e.dataTransfer.files);
    }
  };

  // ৩. মেসেজ সাবমিট হ্যান্ডলার (FormData vs Socket.io)
  const handleSend = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedText = text.trim();
    const hasText = trimmedText !== "";
    const hasAttachments = stagedFiles.length > 0;

    if (!hasText && !hasAttachments) return;

    // Check if any items are actively uploading
    const isStillUploading = stagedFiles.some(
      (it) => it.status === "uploading",
    );
    if (isStillUploading) {
      return toast.info(
        "Please wait for your attachments to finish uploading.",
      );
    }

    // Check if any items failed
    const failedItems = stagedFiles.filter((it) => it.status === "error");
    if (failedItems.length > 0) {
      return toast.error(
        "Please remove or retry attachments that failed before sending.",
      );
    }

    setIsSubmitting(true);

    let receiverId = "admin";
    if (role === "admin" || role === "member") {
      if (currentConversation?.customer?._id) {
        receiverId = currentConversation.customer._id;
      } else if (currentConversation?.customer?.id) {
        receiverId = currentConversation.customer.id;
      } else if (currentConversation?.platformId) {
        receiverId = currentConversation.platformId;
      } else {
        const customerMsg = messages.find((m) => m.senderRole === "customer");
        if (customerMsg) receiverId = customerMsg.senderId;
        else receiverId = currentRoom.replace(/^(fb_|ig_|wa_|room_)/, "");
      }
    }

    const readyAttachments = stagedFiles
      .filter((it) => it.status === "ready" && it.uploadedAttachment)
      .map((it) => it.uploadedAttachment);

    const optimisticId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();
    const optimisticMsg = {
      _id: optimisticId,
      roomId: currentRoom,
      platform: activePlatform,
      senderId: currentUser?.user?._id,
      senderRole: role || "admin",
      receiverId,
      text: trimmedText,
      attachments: readyAttachments,
      isRead: false,
      deliveryStatus: "pending",
      replyTo: replyTo ? { ...replyTo } : null,
      createdAt: now,
    };

    // Show message immediately in UI without waiting for network roundtrip
    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(
      () => chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      30,
    );

    try {
      if (readyAttachments.length > 0) {
        // HTTP POST with JSON attachments & text
        const token = await auth.currentUser?.getIdToken();
        const payload = {
          text: trimmedText,
          receiverId,
          roomId: currentRoom,
          replyTo: replyTo ? JSON.stringify(replyTo) : null,
          attachments: JSON.stringify(readyAttachments),
        };

        await api.post("/conversations/sendMessage", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        // Fast socket emit for text-only messages
        const payload = {
          text: trimmedText,
          receiverId,
          roomId: currentRoom,
          replyTo: replyTo
            ? {
                messageId: replyTo.messageId,
                senderId: replyTo.senderId,
                text: replyTo.text,
                attachments: replyTo.attachments,
              }
            : null,
        };

        socket.emit("sendMessage", payload);
      }

      // Cleanup local preview URLs
      stagedFiles.forEach((it) => {
        if (it.localPreviewUrl) URL.revokeObjectURL(it.localPreviewUrl);
      });

      // Clear composer
      setText("");
      setReplyTo(null);
      setStagedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m._id === optimisticId
            ? {
                ...m,
                deliveryStatus: "failed",
                failureReason:
                  err.response?.data?.message || "Failed to send message",
              }
            : m,
        ),
      );
      toast.error(
        err.response?.data?.message || "Failed to send message. Please retry.",
      );
      // Draft text & attachments preserved on failure
    } finally {
      setIsSubmitting(false);
    }
  };

  const customer = currentConversation?.customer;
  const customerAvatar = customer?.avatar;
  const customerName =
    customer?.userName || customer?.name || customer?.email || "Customer";

  const groupedTimeline = useMemo(() => {
    return groupMessages(messages, {
      thresholdMs: 5 * 60 * 1000,
      isMeFn: (msg) =>
        msg.senderId === currentUser?.user?._id ||
        (["admin", "member"].includes(role) &&
          ["admin", "member"].includes(msg.senderRole)),
    });
  }, [messages, currentUser?.user?._id, role]);

  const handleSelectReply = useCallback((replyPayload) => {
    setReplyTo(replyPayload);
  }, []);

  if (!currentRoom) {
    return (
      <div className="h-[calc(100dvh-240px)] grid place-items-center text-base-content/50 bg-base-100">
        Select a conversation to start chatting.
      </div>
    );
  }

  return (
    <div className="bg-base-100 flex flex-1 overflow-hidden relative">
      {/* Main Chat Column */}
      <div className="flex-1 flex-col min-w-0 relative">
        {/* Follow-Up Reminder Banner */}
        {isStaff && currentConversation?.isFollowUp && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-3.5 py-2 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 shrink-0 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="p-1 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                <LuBookmarkCheck className="size-4" />
              </span>
              <div className="min-w-0 truncate">
                <span className="font-bold">Follow-Up Marked:</span>{" "}
                <span className="font-medium">
                  {currentConversation.followUpReason || "Important conversation"}
                </span>
                {currentConversation.followUpDueDate && (
                  <span className="ml-2 inline-flex items-center gap-1 font-mono text-[11px] opacity-80 bg-amber-500/15 px-1.5 py-0.5 rounded">
                    <LuClock className="size-3" />
                    Due {moment(currentConversation.followUpDueDate).format("MMM D, h:mm A")}
                  </span>
                )}
                {currentConversation.followUpPriority &&
                  currentConversation.followUpPriority !== "medium" && (
                    <span className="ml-1.5 badge badge-xs font-bold uppercase bg-amber-500/25 text-amber-800 dark:text-amber-300 border-none">
                      {currentConversation.followUpPriority}
                    </span>
                  )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsFollowUpModalOpen(true)}
                className="btn btn-xs btn-ghost text-amber-800 dark:text-amber-300 hover:bg-amber-500/20"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleCompleteFollowUp}
                className="btn btn-xs btn-warning text-warning-content font-bold shadow-xs"
              >
                Mark Done
              </button>
            </div>
          </div>
        )}

        <div
          ref={chatEndRef}
          onScroll={checkIfNearBottom}
          className={`flex-1 p-3 md:p-5 overflow-y-auto ${replyTo ? "h-[calc(100dvh-254px)]" : stagedFiles.length > 0 ? "h-[calc(100dvh-290px)]" : showSlashHints ? "h-[calc(100dvh-266px)]" : "h-[calc(100dvh-225px)]"}`}
        >
          <div ref={chatContentRef}>
            {hasMore && (
              <div className="flex justify-center py-4">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="btn btn-sm rounded-full"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <LuArrowUp />
                      Load more
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Grouped Message Timeline (Memoized items) */}
            {groupedTimeline.map((item) => (
              <TimelineItemView
                key={item.id}
                item={item}
                customerName={customerName}
                customerAvatar={customerAvatar}
                onReply={handleSelectReply}
              />
            ))}

            {/* Conversation Deleted Badge & Button */}
            {isConversationDeleted && (
              <div className="flex flex-col items-center justify-center my-8 gap-4">
                <span className="badge badge-error">Conversation Ended</span>
                <Link
                  href="/dashboard/support"
                  className="btn btn-nexoro-primary"
                >
                  Back to support page
                </Link>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>
        </div>

        {/* Drag and Drop Visual Overlay */}
        {isDraggingOver && (
          <div
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="absolute inset-0 z-30 bg-primary/15 backdrop-blur-xs border-2 border-dashed border-primary flex flex-col items-center justify-center gap-3 p-6 select-none transition-all"
          >
            <div className="size-16 rounded-full bg-primary/20 text-primary flex items-center justify-center animate-bounce">
              <LuCloudUpload className="size-8" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-base text-primary">
                Drop files here to attach
              </p>
              <p className="text-xs text-base-content/70 mt-1">
                Images, videos, audio, or documents
              </p>
            </div>
          </div>
        )}

        {/* Floating New Messages Indicator */}
        {showNewMessagesPill && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
            <button
              type="button"
              onClick={() => scrollToBottom("smooth")}
              className="btn btn-xs sm:btn-sm btn-primary rounded-full shadow-xl gap-1.5 animate-bounce text-xs font-semibold px-4 border border-primary-content/20"
            >
              <LuArrowDown className="text-sm" />
              <span>New messages</span>
            </button>
          </div>
        )}

        {/* Canned Responses Modal for staff */}
        {(role === "admin" || role === "member") && (
          <CannedResponsesModal
            ref={cannedRef}
            onSelectResponse={(selectedText) => {
              setText(selectedText);
              setShowSlashHints(false);
            }}
          />
        )}

        {/* Input Area */}
        {!isConversationDeleted && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="p-3 md:p-4 bg-base-300 border-t border-base-200 space-y-2 relative"
          >
            {/* WhatsApp 24-Hour Policy Window Notice */}
            {isWhatsAppSessionExpired && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs">
                <LuCircleAlert className="size-4 shrink-0 text-amber-500" />
                <span className="flex-1 leading-snug">
                  <strong>WhatsApp 24-hour response window expired:</strong>{" "}
                  Meta policy requires customers to message first before you can
                  send free-form replies. Messages sent now may fail without
                  pre-approved templates.
                </span>
              </div>
            )}

            {/* Active Reply Bar */}
            {replyTo && (
              <div className="flex items-center justify-between bg-base-200 border-l-4 border-l-info px-3 py-1.5 rounded-md text-xs mb-2">
                <span className="truncate flex-1">
                  Replying to: {replyTo.text || "Attachment"}
                </span>
                <button
                  onClick={() => setReplyTo(null)}
                  className="btn btn-circle btn-ghost btn-xs text-error"
                >
                  <LuX />
                </button>
              </div>
            )}

            {/* Staged Attachments Preview Bar */}
            <AttachmentComposerPreview
              stagedFiles={stagedFiles}
              onRemove={handleRemoveStaged}
              onRetry={handleRetryUpload}
            />

            {/* Quick Slash Suggestions Bar (Triggered by /) */}
            {(role === "admin" || role === "member") && showSlashHints && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[10px] text-base-content/50 uppercase font-semibold shrink-0 inline-flex items-center gap-1">
                  <LuZap className="size-3 text-amber-500" />
                  <span>Quick Replies:</span>
                </span>
                {(cannedResponses.length > 0
                  ? cannedResponses
                  : QUICK_SLASH_HINTS
                ).map((item, idx) => (
                  <button
                    key={item._id || `${item.shortcut}-${idx}`}
                    type="button"
                    onClick={() => {
                      setText(item.text);
                      setShowSlashHints(false);
                    }}
                    className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 font-medium shrink-0 border border-amber-500/20 text-xs transition-colors"
                  >
                    {item.shortcut}
                  </button>
                ))}
              </div>
            )}

            {isBlocked ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-error/10 border border-error/20 text-error">
                <div className="flex items-center gap-2.5">
                  <LuBan className="size-5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-xs md:text-sm">
                      This contact is currently blocked
                    </h4>
                    <p className="text-[11px] md:text-xs text-base-content/70">
                      Incoming messages are dropped. Unblock to reply to this
                      customer.
                    </p>
                  </div>
                </div>
                {(role === "admin" || role === "member") && (
                  <button
                    type="button"
                    onClick={() => setIsBlockModalOpen(true)}
                    className="btn btn-xs sm:btn-sm btn-outline btn-success rounded-lg shrink-0 gap-1.5"
                  >
                    <LuShieldCheck className="size-4" />
                    <span>Unblock Contact</span>
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleSend} className="flex items-end gap-2">
                {/* Quick Canned Responses Button (for staff) */}
                {(role === "admin" || role === "member") && (
                  <button
                    type="button"
                    onClick={() => cannedRef.current?.showModal()}
                    className="btn btn-circle btn-ghost btn-sm text-amber-500 hover:bg-amber-500/10 text-lg shrink-0"
                    title="Quick Canned Replies (or type / in chat)"
                  >
                    <LuZap />
                  </button>
                )}

                <div className="input w-full flex items-center gap-2 bg-base-100 border border-base-300 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 rounded-xl transition-all">
                  <input
                    value={text}
                    onPaste={handlePaste}
                    onChange={(e) => {
                      const val = e.target.value;
                      setText(val);
                      if (val.startsWith("/") && val.length < 15) {
                        setShowSlashHints(true);
                      } else {
                        setShowSlashHints(false);
                      }
                    }}
                    type="text"
                    placeholder={
                      role === "admin" || role === "member"
                        ? "Write a message, paste image, or type / for quick replies..."
                        : "Write a message or paste image..."
                    }
                    className="grow bg-transparent focus:outline-none text-xs md:text-sm"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => handleStageFiles(e.target.files)}
                    id="chat-file"
                    hidden
                  />
                  <label
                    htmlFor="chat-file"
                    className="btn btn-ghost btn-circle btn-sm text-lg cursor-pointer"
                    title="Attach files (Images, video, audio, documents)"
                  >
                    <LuPaperclip />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-circle btn-primary shrink-0"
                  title="Send Message"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <LuSend />
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* CRM Side Panel (Visible for staff when toggled) */}
      {(role === "admin" || role === "member") && (
        <CRMPanel roomId={currentRoom} />
      )}

      {/* Block User Modal */}
      {(role === "admin" || role === "member") && (
        <BlockUserModal
          isOpen={isBlockModalOpen}
          onClose={() => setIsBlockModalOpen(false)}
          conversation={
            currentConversation || {
              roomId: currentRoom,
              platform: activePlatform,
              isBlocked,
              customer,
            }
          }
        />
      )}

      {/* Follow Up Modal */}
      {isStaff && (
        <FollowUpModal
          isOpen={isFollowUpModalOpen}
          onClose={() => setIsFollowUpModalOpen(false)}
          conversation={
            currentConversation || {
              roomId: currentRoom,
              platform: activePlatform,
              customer,
            }
          }
        />
      )}
    </div>
  );
};

export default Conversation;
