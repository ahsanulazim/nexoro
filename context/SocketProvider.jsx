"use client";

import { auth } from "@/firebase/firebase.config";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

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
          setOnlineStatuses((prev) => ({
            ...prev,
            [userId]: isOnline,
          }));
        });

        //handle unread
        // ২. 🎯 ফিচার: ইনিশিয়াল আনরিড মেসেজ লিস্ট লোড করা
        newSocket.on("initialUnreadCounts", (counts) => {
          // counts এর ফরম্যাট হবে: { "room_id_1": 2, "room_id_2": 0 }
          setUnreadCounts(counts || {});
        });

        // ৩. 🎯 ফিচার: লাইভ আনরিড মেসেজ কাউন্ট আপডেট হওয়া
        newSocket.on("updateUnreadCount", ({ roomId, count }) => {
          setUnreadCounts((prev) => ({
            ...prev,
            [roomId]: count,
          }));
        });

        // 🎯 ৪. ফিচার: লাইভ নোটিফিকেশন রিসিভ করা এবং টোস্ট দেখানো
        newSocket.on("newNotification", (notification) => {
          setNotifications((prev) => [notification, ...prev]);
          setUnreadNotificationsCount((prev) => prev + 1);

          toast.info(
            <div className="cursor-pointer">
              <p className="font-semibold text-sm">{notification.title}</p>
              <p className="text-xs text-slate-500 line-clamp-2">{notification.message}</p>
            </div>,
            {
              onClick: () => {
                if (notification.link) {
                  router.push(notification.link);
                }
              },
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
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
        newSocket.off("newNotification");
        newSocket.close();
      }
    };
  }, [user]);

  const data = {
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
  };

  return <SocketContext value={data}>{children}</SocketContext>;
};

export default SocketProvider;
