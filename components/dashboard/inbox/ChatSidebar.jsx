"use client";

import {
  LuBadgeCheck,
  LuBan,
  LuBookmarkCheck,
  LuDownload,
  LuEllipsis,
  LuEllipsisVertical,
  LuLoader,
  LuMessageCircle,
  LuRefreshCw,
  LuTrash2,
  LuMegaphone,
} from "react-icons/lu";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaGlobe } from "react-icons/fa6";
import SearchChat from "./SearchChat";
import { useSocket } from "@/context/SocketProvider";
import {
  memo,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { auth } from "@/firebase/firebase.config";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import DeleteChatModal from "./DeleteChatModal";
import FollowUpModal from "./FollowUpModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/axios/axiosInstance";
import ConversationTabs from "./ConversationTabs";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "react-toastify";
import {
  getInitials,
  getAvatarColor,
  formatRelativeShort,
} from "@/utils/messageGrouping";

const cleanRoomId = (id) => {
  if (!id) return "";
  const decoded = decodeURIComponent(String(id)).trim();
  const stripped = decoded.replace(/^(fb_|ig_|wa_|room_)/, "");
  const digits = stripped.replace(/[^0-9]/g, "");
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return stripped.toLowerCase();
};

const renderPlatformBadge = (convPlatform, isSelected = false) => {
  if (isSelected) {
    let icon = <FaGlobe className="text-[9px]" />;
    let label = "Web";
    if (convPlatform === "whatsapp") {
      icon = <FaWhatsapp className="text-[10px]" />;
      label = "WA";
    } else if (convPlatform === "facebook") {
      icon = <FaFacebookF className="text-[9px]" />;
      label = "FB";
    } else if (convPlatform === "instagram") {
      icon = <FaInstagram className="text-[10px]" />;
      label = "IG";
    }

    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-primary-content/20 text-primary-content border border-primary-content/30">
        {icon}
        <span>{label}</span>
      </span>
    );
  }

  switch (convPlatform) {
    case "whatsapp":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <FaWhatsapp className="text-[10px]" />
          <span>WA</span>
        </span>
      );
    case "facebook":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-blue-600/10 text-blue-600 border border-blue-600/20">
          <FaFacebookF className="text-[9px]" />
          <span>FB</span>
        </span>
      );
    case "instagram":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20">
          <FaInstagram className="text-[10px]" />
          <span>IG</span>
        </span>
      );
    case "web":
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
          <FaGlobe className="text-[9px]" />
          <span>Web</span>
        </span>
      );
  }
};

const SidebarConversationItem = memo(function SidebarConversationItem({
  conversation,
  platform,
  isSelected,
  isOnline,
  unread,
  onDeleteChat,
  onManageFollowUp,
}) {
  const customerName =
    conversation?.customer?.userName ||
    conversation?.customer?.name ||
    conversation?.customer?.email ||
    "Customer";
  const customerAvatar = conversation?.customer?.avatar;
  const href =
    platform === "inbox"
      ? `/dashboard/inbox/${conversation?.roomId}`
      : `/dashboard/inbox/${platform}/${conversation?.roomId}`;

  return (
    <li className="relative group h-16 [content-visibility:auto] [contain-intrinsic-size:auto_64px]">
      <Link
        href={href}
        prefetch={false}
        className={`flex items-center gap-3 p-3 h-full rounded-xl cursor-pointer transition-colors ${
          isSelected
            ? "bg-primary text-primary-content shadow-sm"
            : "hover:bg-base-300/70 text-base-content"
        }`}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className={`size-10 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs uppercase shadow-inner relative border ${getAvatarColor(
              customerName || conversation?.roomId
            )}`}
          >
            <span className="pointer-events-none select-none">
              {getInitials(customerName)}
            </span>
            {customerAvatar && (
              <img
                src={customerAvatar}
                alt={customerName}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
          {/* Online status indicator */}
          <span
            className={`absolute bottom-0 right-0 size-3 rounded-full border-2 ${
              isSelected ? "border-primary" : "border-base-200"
            } ${isOnline ? "bg-success" : "bg-base-content/30"}`}
            title={isOnline ? "Online" : "Offline"}
          />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 truncate">
              <span
                className={`text-xs font-semibold truncate ${
                  isSelected ? "text-primary-content" : "text-base-content"
                }`}
              >
                {customerName}
              </span>
              {renderPlatformBadge(conversation?.platform, isSelected)}
              {conversation?.referral && (
                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.2 rounded-full shrink-0 border ${
                    isSelected
                      ? "bg-amber-400/25 text-amber-200 border-amber-300/40"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  }`}
                  title={`Meta Ad: ${conversation.referral.headline || "Sponsored Ad Campaign"}`}
                >
                  <LuMegaphone className="text-[9px]" />
                  <span>Ad</span>
                </span>
              )}
              {(conversation?.isClient ||
                conversation?.clientId ||
                conversation?.customer?.clientId) && (
                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.2 rounded-full shrink-0 border ${
                    isSelected
                      ? "bg-primary-content/20 text-primary-content border-primary-content/30"
                      : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  }`}
                  title="Confirmed Client"
                >
                  <LuBadgeCheck className="text-[10px]" />
                  <span>Client</span>
                </span>
              )}
              {conversation?.isBlocked && (
                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.2 rounded-full shrink-0 border ${
                    isSelected
                      ? "bg-red-500/30 text-white border-red-300/40"
                      : "bg-error/15 text-error border-error/25"
                  }`}
                  title="Blocked Contact"
                >
                  <LuBan className="text-[10px]" />
                  <span>Blocked</span>
                </span>
              )}
              {conversation?.isFollowUp && (
                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.2 rounded-full shrink-0 border ${
                    isSelected
                      ? "bg-amber-400/30 text-amber-100 border-amber-300/40"
                      : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25"
                  }`}
                  title={`Follow-Up: ${conversation.followUpReason || "Important"}${
                    conversation.followUpDueDate
                      ? ` (Due: ${formatRelativeShort(conversation.followUpDueDate)})`
                      : ""
                  }`}
                >
                  <LuBookmarkCheck className="text-[10px]" />
                  <span>Follow-up</span>
                </span>
              )}
            </div>
            {conversation?.updatedAt && (
              <span
                className={`text-[10px] shrink-0 ${
                  isSelected
                    ? "text-primary-content/70"
                    : "text-base-content/40"
                }`}
              >
                {formatRelativeShort(conversation.updatedAt)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-1">
            <p
              className={`text-xs truncate ${
                isSelected
                  ? "text-primary-content/80 font-normal"
                  : unread > 0
                    ? "font-semibold text-base-content"
                    : "text-base-content/60"
              }`}
            >
              {conversation?.lastMessage || "No messages yet"}
            </p>
            {unread > 0 && (
              <span className="badge badge-xs badge-error font-bold px-1.5 shrink-0">
                {unread}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Context Actions */}
      <div className="dropdown dropdown-end absolute top-1/2 right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div
          tabIndex={0}
          role="button"
          className={`btn btn-ghost btn-circle btn-xs ${
            isSelected
              ? "text-primary-content hover:bg-primary-content/20"
              : "text-base-content/60 hover:text-base-content"
          }`}
        >
          <LuEllipsis />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-50 w-40 p-1.5 shadow-lg border border-base-200 text-xs space-y-1"
        >
          <li>
            <button
              onClick={() => onManageFollowUp && onManageFollowUp(conversation)}
              className="text-amber-600 dark:text-amber-400 flex items-center gap-2 font-medium"
            >
              <LuBookmarkCheck className="size-3.5" />
              <span>{conversation?.isFollowUp ? "Edit Follow-Up" : "Mark Follow-Up"}</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onDeleteChat(conversation)}
              className="text-error flex items-center gap-2"
            >
              <LuTrash2 /> Delete Chat
            </button>
          </li>
        </ul>
      </div>
    </li>
  );
});

const ChatSidebar = () => {
  const { message: currentRoom } = useParams();
  const { socket, onlineStatuses, unreadCounts, setConversations } =
    useSocket();
  const queryClient = useQueryClient();
  const [chat, setChat] = useState(null);
  const [subFilter, setSubFilter] = useState("all"); // 'all' | 'followup' | 'unread'
  const [followUpModalChat, setFollowUpModalChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSyncingFB, setIsSyncingFB] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [isLoadingMoreDB, setIsLoadingMoreDB] = useState(false);
  const [dbNextCursor, setDbNextCursor] = useState(null);
  const [hasMoreDB, setHasMoreDB] = useState(false);

  const [fbCursor, setFbCursor] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("fb_next_cursor") || null;
    }
    return null;
  });
  const [hasMoreFB, setHasMoreFB] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fb_has_more");
      if (saved !== null) return saved === "true";
    }
    return true;
  });
  const { currentUser } = useAuth();
  const deleteRef = useRef();
  const listContainerRef = useRef(null);
  const bottomSentinelRef = useRef(null);
  const isSyncingFBRef = useRef(false);
  const hasMoreFBRef = useRef(true);
  const fbCursorRef = useRef(null);
  const handleSyncFacebookRef = useRef();

  // Debounce search input (250ms) so typing never blocks the main thread
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    isSyncingFBRef.current = isSyncingFB;
  }, [isSyncingFB]);

  useEffect(() => {
    hasMoreFBRef.current = hasMoreFB;
  }, [hasMoreFB]);

  useEffect(() => {
    fbCursorRef.current = fbCursor;
  }, [fbCursor]);

  const pathName = usePathname();
  const pathParts = pathName.split("/").filter(Boolean);
  let platform = "inbox";
  if (pathParts.length > 2) {
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart === currentRoom) {
      platform = pathParts[pathParts.length - 2];
    } else {
      platform = lastPart;
    }
  }

  const {
    data: conversations,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["conversations", platform],
    staleTime: 30000,
    queryFn: async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const headers = { Authorization: `Bearer ${token}` };

        const params = { limit: 60 };
        if (platform !== "inbox") {
          params.platform = platform;
        }

        const res = await api.get("/conversations/getSidebarConversations", {
          params,
          headers,
        });
        const data = res.data?.success ? res.data.data : [];
        setHasMoreDB(Boolean(res.data?.pagination?.hasMore));
        setDbNextCursor(res.data?.pagination?.nextCursor || null);

        setConversations(data);
        return data;
      } catch (err) {
        console.error("Error fetching sidebar conversations:", err);
        return [];
      }
    },
  });

  // Load older conversations from DB via cursor pagination
  const loadMoreDBConversations = useCallback(async () => {
    if (isLoadingMoreDB || !hasMoreDB || !dbNextCursor) return;
    setIsLoadingMoreDB(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };
      const params = {
        limit: 50,
        before: dbNextCursor,
      };
      if (platform !== "inbox") {
        params.platform = platform;
      }

      const res = await api.get("/conversations/getSidebarConversations", {
        params,
        headers,
      });

      if (res.data?.success && Array.isArray(res.data.data)) {
        const olderBatch = res.data.data;
        setHasMoreDB(Boolean(res.data?.pagination?.hasMore));
        setDbNextCursor(res.data?.pagination?.nextCursor || null);

        queryClient.setQueryData(["conversations", platform], (old = []) => {
          const seen = new Set(old.map((c) => c.roomId));
          const merged = [...old];
          for (const item of olderBatch) {
            if (item?.roomId && !seen.has(item.roomId)) {
              seen.add(item.roomId);
              merged.push(item);
            }
          }
          setConversations(merged);
          return merged;
        });
      } else {
        setHasMoreDB(false);
      }
    } catch (err) {
      console.error("Error loading older DB conversations:", err);
    } finally {
      setIsLoadingMoreDB(false);
    }
  }, [isLoadingMoreDB, hasMoreDB, dbNextCursor, platform, queryClient, setConversations]);

  const handleSyncFacebook = async (cursor = "", isSilent = false) => {
    if (isSyncingFBRef.current) return;
    setIsSyncingFB(true);
    isSyncingFBRef.current = true;
    if (!isSilent) setIsManualSyncing(true);

    let toastId = null;
    if (!isSilent) {
      toastId = toast.loading("Syncing Facebook conversations from Meta...");
    }
    try {
      const token = await auth.currentUser?.getIdToken();
      const url = cursor
        ? `/facebook/sync?limit=20&after=${cursor}`
        : `/facebook/sync?limit=20`;

      const res = await api.post(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.success) {
        const { syncedCount, hasNextPage, nextCursor } = res.data.data;
        const nextHasMore = Boolean(hasNextPage);
        setFbCursor(nextCursor || null);
        setHasMoreFB(nextHasMore);

        try {
          if (nextCursor) {
            localStorage.setItem("fb_next_cursor", nextCursor);
          } else {
            localStorage.removeItem("fb_next_cursor");
          }
          localStorage.setItem("fb_has_more", String(nextHasMore));
        } catch (e) {
          // Ignore localStorage errors
        }

        if (toastId) {
          toast.update(toastId, {
            render: `Synced ${syncedCount} conversations from Facebook!`,
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        }
        await refetch();
      } else {
        if (toastId) {
          toast.update(toastId, {
            render: res.data?.message || "Sync failed",
            type: "warning",
            isLoading: false,
            autoClose: 3500,
          });
        }
      }
    } catch (err) {
      console.error("Facebook sync error:", err);
      if (toastId) {
        toast.update(toastId, {
          render:
            err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to sync Facebook chats",
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
      } else if (!isSilent) {
        toast.error(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to load older Facebook chats",
          { autoClose: 3000 }
        );
      }
    } finally {
      setIsSyncingFB(false);
      isSyncingFBRef.current = false;
      if (!isSilent) setIsManualSyncing(false);
    }
  };

  useEffect(() => {
    handleSyncFacebookRef.current = handleSyncFacebook;
  });

  // In-place React Query cache updates on Socket events (eliminates full-list HTTP refetch storm)
  useEffect(() => {
    if (!socket) return;

    const handleConversationUpdate = (payload) => {
      if (!payload?.roomId) {
        refetch();
        return;
      }

      if (payload.deleted) {
        queryClient.setQueryData(["conversations", platform], (old = []) => {
          const next = old.filter(
            (c) =>
              c.roomId !== payload.roomId &&
              cleanRoomId(c.roomId) !== cleanRoomId(payload.roomId)
          );
          setConversations(next);
          return next;
        });
        return;
      }

      let foundInCache = false;
      queryClient.setQueryData(["conversations", platform], (old = []) => {
        if (!Array.isArray(old)) return old;
        const idx = old.findIndex(
          (c) =>
            c.roomId === payload.roomId ||
            cleanRoomId(c.roomId) === cleanRoomId(payload.roomId)
        );

        if (idx !== -1) {
          foundInCache = true;
          const existing = old[idx];
          const updatedItem = {
            ...existing,
            lastMessage: payload.lastMessage ?? existing.lastMessage,
            updatedAt:
              payload.updatedAt || new Date().toISOString(),
            lastCustomerMessageAt:
              payload.lastCustomerMessageAt ?? existing.lastCustomerMessageAt,
            unreadCount:
              typeof payload.unreadCount === "number"
                ? payload.unreadCount
                : existing.unreadCount,
            platform: payload.platform || existing.platform,
            customer: payload.customer || existing.customer,
            isClient: payload.isClient ?? existing.isClient,
            clientId: payload.clientId ?? existing.clientId,
            isBlocked:
              payload.isBlocked !== undefined
                ? payload.isBlocked
                : existing.isBlocked,
            isFollowUp:
              payload.isFollowUp !== undefined
                ? payload.isFollowUp
                : existing.isFollowUp,
            followUpReason:
              payload.followUpReason !== undefined
                ? payload.followUpReason
                : existing.followUpReason,
            followUpDueDate:
              payload.followUpDueDate !== undefined
                ? payload.followUpDueDate
                : existing.followUpDueDate,
            followUpPriority:
              payload.followUpPriority !== undefined
                ? payload.followUpPriority
                : existing.followUpPriority,
            followUpBy:
              payload.followUpBy !== undefined
                ? payload.followUpBy
                : existing.followUpBy,
          };
          const next = [
            updatedItem,
            ...old.slice(0, idx),
            ...old.slice(idx + 1),
          ];
          setConversations(next);
          return next;
        }

        // If brand new conversation has customer info attached, prepend directly without HTTP call
        // (Ensure it matches current platform tab to avoid cross-platform pollution)
        const itemPlatform = payload.platform || "web";
        const isPlatformMatch =
          platform === "inbox" || platform === itemPlatform;

        if (payload.customer && isPlatformMatch) {
          foundInCache = true;
          const newItem = {
            _id: payload.roomId,
            roomId: payload.roomId,
            platform: itemPlatform,
            lastMessage: payload.lastMessage || "",
            updatedAt: payload.updatedAt || new Date().toISOString(),
            lastCustomerMessageAt: payload.lastCustomerMessageAt,
            unreadCount: payload.unreadCount ?? 1,
            customerId: payload.customerId,
            customer: payload.customer,
          };
          const next = [newItem, ...old];
          setConversations(next);
          return next;
        }

        return old;
      });

      if (!foundInCache) {
        refetch();
      }
    };

    const handleConversationDeleted = ({ roomId }) => {
      if (!roomId) return;
      queryClient.setQueryData(["conversations", platform], (old = []) => {
        if (!Array.isArray(old)) return old;
        const next = old.filter(
          (c) =>
            c.roomId !== roomId &&
            cleanRoomId(c.roomId) !== cleanRoomId(roomId)
        );
        setConversations(next);
        return next;
      });
    };

    const handleBlockStatusUpdated = ({ roomId, isBlocked }) => {
      if (!roomId) return;
      queryClient.setQueryData(["conversations", platform], (old = []) => {
        if (!Array.isArray(old)) return old;
        const next = old.map((c) =>
          c.roomId === roomId || cleanRoomId(c.roomId) === cleanRoomId(roomId)
            ? { ...c, isBlocked }
            : c
        );
        setConversations(next);
        return next;
      });
    };

    const handleFollowUpStatusUpdated = (data) => {
      if (!data?.roomId) return;
      queryClient.setQueryData(["conversations", platform], (old = []) => {
        if (!Array.isArray(old)) return old;
        const next = old.map((c) =>
          c.roomId === data.roomId || cleanRoomId(c.roomId) === cleanRoomId(data.roomId)
            ? { ...c, ...data }
            : c
        );
        setConversations(next);
        return next;
      });
    };

    socket.on("newConversationUpdate", handleConversationUpdate);
    socket.on("conversationDeleted", handleConversationDeleted);
    socket.on("conversationBlockStatusUpdated", handleBlockStatusUpdated);
    socket.on("conversationFollowUpUpdated", handleFollowUpStatusUpdated);

    return () => {
      socket.off("newConversationUpdate", handleConversationUpdate);
      socket.off("conversationDeleted", handleConversationDeleted);
      socket.off("conversationBlockStatusUpdated", handleBlockStatusUpdated);
      socket.off("conversationFollowUpUpdated", handleFollowUpStatusUpdated);
    };
  }, [socket, currentUser, platform, queryClient, refetch, setConversations]);

  // One-time silent sync on initial Facebook tab visit (webhooks handle realtime updates)
  const hasInitialSyncedRef = useRef(false);
  useEffect(() => {
    if (platform !== "facebook" && platform !== "inbox") return;
    if (hasInitialSyncedRef.current) return;
    hasInitialSyncedRef.current = true;
    handleSyncFacebookRef.current?.("", true);
  }, [platform]);

  const handleDeleteChat = useCallback((conversation) => {
    deleteRef.current?.showModal();
    setChat(conversation);
  }, []);

  const handleManageFollowUp = useCallback((conversation) => {
    setFollowUpModalChat(conversation);
  }, []);

  const platformConversations = useMemo(() => {
    if (!conversations || conversations.length === 0) return [];
    return conversations.filter((conv) => {
      if (platform === "inbox" || platform === "all") return true;

      let convPlatform = conv.platform;
      if (!convPlatform) {
        if (conv.roomId?.startsWith("fb_")) convPlatform = "facebook";
        else if (conv.roomId?.startsWith("ig_")) convPlatform = "instagram";
        else if (conv.roomId?.startsWith("wa_")) convPlatform = "whatsapp";
        else convPlatform = "web";
      }

      return convPlatform === platform;
    });
  }, [conversations, platform]);

  const followUpCount = useMemo(() => {
    return platformConversations.filter((c) => Boolean(c?.isFollowUp)).length;
  }, [platformConversations]);

  const unreadTotalCount = useMemo(() => {
    return platformConversations.filter(
      (c) => (unreadCounts[c?.roomId] ?? c?.unreadCount ?? 0) > 0
    ).length;
  }, [platformConversations, unreadCounts]);

  const filteredConversations = useMemo(() => {
    let list = platformConversations;

    if (subFilter === "followup") {
      list = list.filter((c) => Boolean(c?.isFollowUp));
    } else if (subFilter === "unread") {
      list = list.filter(
        (c) => (unreadCounts[c?.roomId] ?? c?.unreadCount ?? 0) > 0
      );
    }

    if (!debouncedSearch) return list;

    const term = debouncedSearch.toLowerCase();
    return list.filter((conv) => {
      const name = (
        conv?.customer?.userName ||
        conv?.customer?.name ||
        ""
      ).toLowerCase();
      const phone = (conv?.customer?.phone || "").toLowerCase();
      const lastMsg = (conv?.lastMessage || "").toLowerCase();
      const roomId = (conv?.roomId || "").toLowerCase();
      return (
        name.includes(term) ||
        phone.includes(term) ||
        lastMsg.includes(term) ||
        roomId.includes(term)
      );
    });
  }, [platformConversations, subFilter, debouncedSearch, unreadCounts]);

  const loadOlderFacebookChats = useCallback(() => {
    if (
      platform !== "facebook" ||
      isSyncingFBRef.current ||
      !hasMoreFBRef.current ||
      debouncedSearch
    ) {
      return;
    }
    handleSyncFacebookRef.current?.(fbCursorRef.current || "", true);
  }, [platform, debouncedSearch]);

  // Handle scroll for infinite pagination
  const handleScroll = useCallback(
    (e) => {
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
      } = e.currentTarget;

      if (scrollTop + clientHeight >= scrollHeight - 80) {
        if (hasMoreDB && !isLoadingMoreDB && !debouncedSearch) {
          loadMoreDBConversations();
        } else if (
          platform === "facebook" &&
          !isSyncingFBRef.current &&
          hasMoreFBRef.current &&
          !debouncedSearch
        ) {
          loadOlderFacebookChats();
        }
      }
    },
    [
      hasMoreDB,
      isLoadingMoreDB,
      debouncedSearch,
      loadMoreDBConversations,
      platform,
      loadOlderFacebookChats,
    ]
  );

  // IntersectionObserver for bottom sentinel
  useEffect(() => {
    if (debouncedSearch) return;
    const container = listContainerRef.current;
    const sentinel = bottomSentinelRef.current;
    if (!sentinel || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        if (hasMoreDB && !isLoadingMoreDB) {
          loadMoreDBConversations();
        } else if (
          platform === "facebook" &&
          !isSyncingFBRef.current &&
          hasMoreFBRef.current
        ) {
          loadOlderFacebookChats();
        }
      },
      {
        root: container,
        rootMargin: "80px",
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [
    platform,
    hasMoreDB,
    isLoadingMoreDB,
    hasMoreFB,
    isSyncingFB,
    debouncedSearch,
    fbCursor,
    loadMoreDBConversations,
    loadOlderFacebookChats,
  ]);

  const cleanCurrentRoom = useMemo(
    () => (currentRoom ? cleanRoomId(currentRoom) : ""),
    [currentRoom]
  );

  return (
    <div className="flex flex-col w-full h-full bg-base-100 overflow-hidden">
      <DeleteChatModal ref={deleteRef} chat={chat} />
      <FollowUpModal
        isOpen={Boolean(followUpModalChat)}
        onClose={() => setFollowUpModalChat(null)}
        conversation={followUpModalChat}
      />
      <div className="flex flex-col w-full h-full">
        {/* Header & Search */}
        <div className="p-4 bg-base-100 backdrop-blur space-y-3 border-b border-base-100">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <LuMessageCircle className="text-xl" />
              </div>
              <div>
                <h2 className="text-base font-bold leading-tight">
                  Unified Inbox
                </h2>
                <span className="text-[11px] text-base-content/50">
                  {filteredConversations?.length || 0} conversations
                </span>
              </div>
            </div>
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle btn-sm"
              >
                <LuEllipsisVertical />
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-lg border border-base-200 text-xs space-y-1"
              >
                <li>
                  <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2"
                  >
                    <LuRefreshCw className="size-3.5" />
                    <span>Refresh All</span>
                  </button>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button
                    onClick={() => handleSyncFacebook("", false)}
                    disabled={isSyncingFB}
                    className="text-blue-600 font-medium flex items-center gap-2"
                  >
                    {isManualSyncing ? (
                      <>
                        <LuLoader className="size-3.5 animate-spin" />
                        <span>Syncing FB...</span>
                      </>
                    ) : (
                      <>
                        <LuDownload className="size-3.5" />
                        <span>Sync Facebook Chats</span>
                      </>
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <SearchChat searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {/* Platform Tabs */}
        <div className="p-2 border-b border-base-300">
          <ConversationTabs />
        </div>

        {/* Quick Sub-filters: All / Follow-Up / Unread */}
        <div className="px-3 py-1.5 flex items-center gap-1.5 bg-base-100 border-b border-base-200 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSubFilter("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              subFilter === "all"
                ? "bg-base-300 text-base-content shadow-xs"
                : "text-base-content/60 hover:text-base-content hover:bg-base-200"
            }`}
          >
            All ({platformConversations.length})
          </button>
          <button
            type="button"
            onClick={() => setSubFilter("followup")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              subFilter === "followup"
                ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs"
                : "text-base-content/60 hover:text-amber-600 hover:bg-base-200"
            }`}
          >
            <LuBookmarkCheck className="size-3.5 text-amber-500" />
            <span>Follow-Up</span>
            {followUpCount > 0 && (
              <span className="badge badge-xs bg-amber-500 text-white font-bold px-1.5">
                {followUpCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setSubFilter("unread")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              subFilter === "unread"
                ? "bg-error/20 text-error border border-error/30 shadow-xs"
                : "text-base-content/60 hover:text-error hover:bg-base-200"
            }`}
          >
            <span>Unread</span>
            {unreadTotalCount > 0 && (
              <span className="badge badge-xs badge-error text-white font-bold px-1.5">
                {unreadTotalCount}
              </span>
            )}
          </button>
        </div>

        {/* Facebook Sync Banner */}
        {platform === "facebook" && (
          <div className="px-3 py-2 bg-blue-600/10 border-b border-blue-600/20 flex items-center justify-between text-xs">
            <span className="text-blue-600 font-semibold flex items-center gap-1.5">
              <FaFacebookF className="text-xs" /> Facebook Inbox
            </span>
            <button
              onClick={() => handleSyncFacebook("", false)}
              disabled={isSyncingFB}
              className="btn btn-xs btn-primary bg-blue-600 hover:bg-blue-700 border-blue-600 text-white rounded-lg text-[11px] gap-1 shadow-xs"
              title="Sync Facebook conversations"
            >
              {isManualSyncing ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <span>Sync Facebook</span>
              )}
            </button>
          </div>
        )}

        {/* Conversation List */}
        <ul
          ref={listContainerRef}
          onScroll={handleScroll}
          className="list px-2 py-2 overflow-y-auto flex-1 space-y-1"
        >
          {isLoading ? (
            Array.from({ length: 7 }).map((_, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-base-100/50 animate-pulse"
              >
                <div className="size-10 skeleton rounded-full shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 skeleton rounded w-3/4"></div>
                  <div className="h-3 skeleton rounded w-1/2"></div>
                </div>
              </li>
            ))
          ) : isError ? (
            <div className="p-6 text-center text-error text-xs space-y-2">
              <p>Failed to load conversations</p>
              <button
                onClick={() => refetch()}
                className="btn btn-xs btn-outline btn-error"
              >
                Retry
              </button>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="py-12 px-4 text-center text-base-content/40 space-y-1">
              <p className="text-sm font-medium">No conversations found</p>
              <p className="text-xs">
                {searchTerm
                  ? "Try adjusting your search query"
                  : "New customer messages will appear here"}
              </p>
            </div>
          ) : (
            <>
              {filteredConversations.map((conversation) => {
                const customerId =
                  conversation?.customer?._id || conversation?.customer?.id;
                let isOnline = customerId
                  ? Boolean(onlineStatuses[customerId])
                  : false;

                // For WhatsApp, check activity within 24h window
                if (conversation?.platform === "whatsapp") {
                  const lastAct =
                    conversation?.lastCustomerMessageAt ||
                    conversation?.updatedAt;
                  if (lastAct) {
                    const diff = Date.now() - new Date(lastAct).getTime();
                    isOnline = diff <= 24 * 60 * 60 * 1000;
                  }
                }

                const isSelected =
                  currentRoom === conversation?.roomId ||
                  Boolean(
                    cleanCurrentRoom &&
                      cleanCurrentRoom === cleanRoomId(conversation?.roomId)
                  );
                const unread =
                  unreadCounts[conversation?.roomId] ??
                  conversation?.unreadCount ??
                  0;

                return (
                  <SidebarConversationItem
                    key={conversation?._id || conversation?.roomId}
                    conversation={conversation}
                    platform={platform}
                    isSelected={isSelected}
                    isOnline={isOnline}
                    unread={unread}
                    onDeleteChat={handleDeleteChat}
                    onManageFollowUp={handleManageFollowUp}
                  />
                );
              })}

              {/* Skeleton loader when loading older chats on scroll */}
              {(isLoadingMoreDB ||
                (platform === "facebook" && isSyncingFB)) && (
                <>
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <li
                      key={`older-skeleton-${idx}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-base-100/50 animate-pulse"
                    >
                      <div className="size-10 skeleton rounded-full shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 skeleton rounded w-3/4"></div>
                        <div className="h-3 skeleton rounded w-1/2"></div>
                      </div>
                    </li>
                  ))}
                </>
              )}

              {/* Load Older Conversations Button & Sentinel */}
              {!debouncedSearch && (
                <li className="py-2.5 px-3 list-none">
                  {hasMoreDB || (platform === "facebook" && hasMoreFB) ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (hasMoreDB && !isLoadingMoreDB) {
                          loadMoreDBConversations();
                        } else if (platform === "facebook" && hasMoreFB) {
                          loadOlderFacebookChats();
                        }
                      }}
                      disabled={isLoadingMoreDB || isSyncingFB}
                      className="btn btn-sm btn-outline btn-primary rounded-xl w-full gap-2 shadow-2xs text-xs font-semibold"
                    >
                      {isLoadingMoreDB || isSyncingFB ? (
                        <>
                          <span className="loading loading-spinner loading-xs" />
                          <span>Loading older conversations...</span>
                        </>
                      ) : (
                        <>
                          <LuDownload className="size-3.5" />
                          <span>Load older conversations</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="text-center py-1.5">
                      <span className="text-[11px] text-base-content/40 font-medium">
                        All conversations loaded
                      </span>
                    </div>
                  )}

                  {/* Sentinel for auto-load on scroll */}
                  {(hasMoreDB || (platform === "facebook" && hasMoreFB)) && (
                    <div
                      ref={bottomSentinelRef}
                      className="h-2 w-full pointer-events-none opacity-0"
                      aria-hidden="true"
                    />
                  )}
                </li>
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ChatSidebar;
