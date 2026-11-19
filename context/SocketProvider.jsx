"use client";

import { auth } from "@/firebase/firebase.config";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  isBrowserNotificationEnabled,
  setBrowserNotificationEnabled,
  showBrowserNotification,
  playNotificationSound,
  getNotificationCategoryPrefs,
} from "@/utils/browserNotification";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

const SocketProvider = ({ children }) => {
  const [user] = useAuthState(auth);
  const [socket, setSocket] = useState(null);
  const [onlineStatuses, setOnlineStatuses] = useState({});
  const [activeUser, setActiveUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [conversations, setConversations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [isConfirmOrderOpen, setIsConfirmOrderOpen] = useState(false);

  const [browserPermission, setBrowserPermission] = useState("default");
  const [isBrowserAlertActive, setIsBrowserAlertActive] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBrowserPermission(getNotificationPermission());
      setIsBrowserAlertActive(isBrowserNotificationEnabled());
    }
  }, []);

  const enableBrowserNotifications = useCallback(async () => {
    const perm = await requestNotificationPermission();
    setBrowserPermission(perm);
    const active = isBrowserNotificationEnabled();
    setIsBrowserAlertActive(active);
    if (perm === "granted") {
      showBrowserNotification({
        title: "Desktop Alerts Active!",
        message:
          "You'll now receive instant notifications for dashboard activity.",
        tag: "nexoro_welcome",
      });
    }
    return perm;
  }, []);

  const toggleBrowserNotifications = useCallback((enable) => {
    setBrowserNotificationEnabled(enable);
    setIsBrowserAlertActive(
      enable && getNotificationPermission() === "granted"
    );
  }, []);

  useEffect(() => {
    let newSocket = null;

    const initSocket = async () => {
      if (!user) {
        if (socket) {
          socket.close();
          setSocket(null);
        }
        return;
      }

      try {
        const socketUrl =
          process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

        const token = await user?.getIdToken();

        newSocket = io(socketUrl, {
          auth: {
            token,
          },
          transports: ["websocket"],
        });

        setSocket(newSocket);

        //Socket Event Handlers

        // ১. রিফ্রেশ প্রবলেম ফিক্স: ব্যাকএন্ড থেকে সব একটিভ ইউজারের লিস্ট একবারে রিসিভ করা
        newSocket.on("getOnlineCustomers", (onlineUserIds) => {
          // onlineUserIds যদি Array হয় (যেমন: ['uid1', 'uid2']), তাকে অবজেক্টে রূপান্তর করা হলো
          const statuses = {};
          if (Array.isArray(onlineUserIds)) {
            onlineUserIds.forEach((id) => {
              statuses[id] = true;
            });
          } else {
            // যদি সরাসরি অবজেক্ট আসে { uid1: true, uid2: true }
            Object.assign(statuses, onlineUserIds);
          }
          setOnlineStatuses(statuses);
        });

        //handle online
        newSocket.on("customerStatus", ({ userId, isOnline }) => {
          setOnlineStatuses((prev) => {
            if (Boolean(prev[userId]) === Boolean(isOnline)) return prev;
            return {
              ...prev,
              [userId]: isOnline,
            };
          });
        });

        //handle unread
        // ২. ফিচার: ইনিশিয়াল আনরিড মেসেজ লিস্ট লোড করা
        newSocket.on("initialUnreadCounts", (counts) => {
          // counts এর ফরম্যাট হবে: { "room_id_1": 2, "room_id_2": 0 }
          setUnreadCounts(counts || {});
        });

        // ৩. ফিচার: লাইভ আনরিড মেসেজ কাউন্ট আপডেট হওয়া
        newSocket.on("updateUnreadCount", ({ roomId, count }) => {
          setUnreadCounts((prev) => {
            if ((prev[roomId] || 0) === count) return prev;
            return {
              ...prev,
              [roomId]: count,
            };
          });
        });

        // ৩b. ফিচার: কনভারসেশন ব্লক/আনব্লক স্ট্যাটাস লাইভ আপডেট
        newSocket.on("conversationBlockStatusUpdated", ({ roomId, isBlocked }) => {
          setConversations((prev) =>
            Array.isArray(prev)
              ? prev.map((c) =>
                  c.roomId === roomId ? { ...c, isBlocked } : c
                )
              : prev
          );
        });

        // 🎯 ৪. ফিচার: লাইভ নোটিফিকেশন রিসিভ করা এবং টোস্ট দেখানো
        newSocket.on("newNotification", (notification) => {
          setNotifications((prev) => [notification, ...prev]);
          setUnreadNotificationsCount((prev) => prev + 1);

          const prefs = getNotificationCategoryPrefs();
          const type = notification.type || "";
          const isOrderEvent = [
            "new_order",
            "order_completed",
            "order_cancelled",
            "project_assigned",
            "order_assigned",
            "order_tasks_updated",
            "order_status_updated",
          ].includes(type);
          const isMessageEvent = type === "new_message";
          const isPaymentEvent = ["payment_completed", "payment_due"].includes(
            type
          );
          const isPointsEvent = [
            "points_earned",
            "work_submitted",
            "points_deducted",
            "work_rejected",
          ].includes(type);

          const isCategoryAllowed =
            (isOrderEvent && prefs.orders) ||
            (isMessageEvent && prefs.messages) ||
            (isPaymentEvent && prefs.payments) ||
            (isPointsEvent && prefs.points) ||
            (!isOrderEvent &&
              !isMessageEvent &&
              !isPaymentEvent &&
              !isPointsEvent);

          if (!isCategoryAllowed) return;

          if (prefs.inAppToast) {
            toast.info(
              <div className="flex flex-col">
                <h3 className="font-semibold text-sm">{notification.title}</h3>
                <p className="text-xs text-white line-clamp-2">
                  {notification.message}
                </p>
              </div>,
              {
                onClick: () => {
                  if (notification.link) {
                    router.push(notification.link);
                  }
                },
              }
            );
          }

          // 🎯 ব্রাউজার নোটিফিকেশন API দিয়ে ডেস্কটপ নোটিফিকেশন পাঠানো
          showBrowserNotification({
            title: notification.title || "Nexoro Notification",
            message:
              notification.message || "You have a new update in your dashboard.",
            tag: notification._id || undefined,
            link: notification.link,
            onNavigate: (url) => {
              if (url) router.push(url);
            },
            playSound: true,
          });
        });
      } catch (error) {
        console.log("Socket initialization error:", error);
      }
    };

    initSocket();

    // cleanup
    return () => {
      if (newSocket) {
        newSocket.off("getOnlineCustomers");
        newSocket.off("customerStatus");
        newSocket.off("initialUnreadCounts");
        newSocket.off("updateUnreadCount");
        newSocket.off("conversationBlockStatusUpdated");
        newSocket.off("newNotification");
        newSocket.close();
      }
    };
  }, [user]);

  const data = useMemo(
    () => ({
      socket,
      onlineStatuses,
      setOnlineStatuses,
      activeUser,
      setActiveUser,
      unreadCounts,
      conversations,
      setConversations,
      notifications,
      setNotifications,
      unreadNotificationsCount,
      setUnreadNotificationsCount,
      isCrmOpen,
      setIsCrmOpen,
      isConfirmOrderOpen,
      setIsConfirmOrderOpen,
      browserPermission,
      isBrowserAlertActive,
      enableBrowserNotifications,
      toggleBrowserNotifications,
      playNotificationSound,
      showBrowserNotification,
    }),
    [
      socket,
      onlineStatuses,
      activeUser,
      unreadCounts,
      conversations,
      notifications,
      unreadNotificationsCount,
      isCrmOpen,
      isConfirmOrderOpen,
      browserPermission,
      isBrowserAlertActive,
      enableBrowserNotifications,
      toggleBrowserNotifications,
    ]
  );

  return <SocketContext value={data}>{children}</SocketContext>;
};

export default SocketProvider;
