"use client";

import Link from "next/link";
import UserDropDown from "./UserDropDown";
import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketProvider";
import { auth } from "@/firebase/firebase.config";
import api from "@/axios/axiosInstance";
import { useRouter } from "next/navigation";
import moment from "moment";
import {
  LuBell,
  LuCircleAlert,
  LuCircleCheck,
  LuCircleX,
  LuCreditCard,
  LuMessageSquare,
  LuPackage,
} from "react-icons/lu";

const DashNav = () => {
  const {
    notifications,
    setNotifications,
    unreadNotificationsCount,
    setUnreadNotificationsCount,
  } = useSocket();
  const router = useRouter();

  // Fetch initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;

        const response = await api.get("/notifications?limit=10", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setNotifications(response.data.notifications);
          setUnreadNotificationsCount(response.data.unreadCount);
        }
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    // Listen to changes in auth to fetch notifications
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchNotifications();
      }
    });

    return () => unsubscribe();
  }, [setNotifications, setUnreadNotificationsCount]);

  const getNotificationStyles = (type) => {
    switch (type) {
      case "new_order":
        return {
          icon: <LuPackage className="size-4 text-primary" />,
          bg: "bg-primary/15",
        };
      case "order_cancelled":
        return {
          icon: <LuCircleX className="size-4 text-error" />,
          bg: "bg-error/15",
        };
      case "order_completed":
        return {
          icon: <LuCircleCheck className="size-4 text-success" />,
          bg: "bg-success/15",
        };
      case "payment_completed":
        return {
          icon: <LuCreditCard className="size-4 text-success" />,
          bg: "bg-success/15",
        };
      case "payment_due":
        return {
          icon: <LuCircleAlert className="size-4 text-warning" />,
          bg: "bg-warning/15",
        };
      case "new_message":
        return {
          icon: <LuMessageSquare className="size-4 text-info" />,
          bg: "bg-info/15",
        };
      default:
        return {
          icon: <LuBell className="size-4 text-neutral" />,
          bg: "bg-neutral/15",
        };
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read in DB if unread
    if (!notification.isRead) {
      try {
        const token = await auth.currentUser?.getIdToken();
        await api.patch(
          `/notifications/${notification._id}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );

        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n,
          ),
        );
        setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    // Close dropdown
    const elem = document.activeElement;
    if (elem) {
      elem.blur();
    }

    // Redirect to target link
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      await api.patch(
        `/notifications/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadNotificationsCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <nav className="navbar w-full bg-base-300 border-b border-b-base-100 sticky top-0 z-10">
      <label
        htmlFor="my-drawer-4"
        aria-label="open sidebar"
        className="btn btn-square btn-ghost"
      >
        {/* Sidebar toggle icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2"
          fill="none"
          stroke="currentColor"
          className="my-1.5 inline-block size-4"
        >
          <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
          <path d="M9 4v16"></path>
          <path d="M14 10l2 2l-2 2"></path>
        </svg>
      </label>
      <div className="px-4 flex-1">
        <div className="w-fit">
          <Link href="/dashboard">
            <h1 className="font-bold text-xl">Dashboard</h1>
          </Link>
        </div>
      </div>
      <div className="flex gap-2">
        <details className="dropdown dropdown-end">
          <summary className="btn btn-circle relative">
            <LuBell className="size-5" />
            {unreadNotificationsCount > 0 && (
              <span className="badge badge-error badge-xs absolute top-1 right-1 px-1.5 py-1 text-[10px]">
                {unreadNotificationsCount}
              </span>
            )}
          </summary>
          <div className="dropdown-content bg-base-100 rounded-box z-20 w-80 p-2 shadow-lg border border-base-200 mt-2">
            <div className="flex justify-between items-center px-3 py-2 border-b border-base-200">
              <span className="font-bold text-sm">Notifications</span>
              {unreadNotificationsCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Mark all read
                </button>
              )}
            </div>
            <ul className="py-1 max-h-96 overflow-y-scroll space-y-1">
              {notifications.length === 0 ? (
                <div className="text-center py-6 text-sm opacity-50">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => {
                  const style = getNotificationStyles(notification.type);
                  return (
                    <li key={notification._id} className="p-0">
                      <button
                        onClick={() => handleNotificationClick(notification)}
                        className={`flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
                          notification.isRead
                            ? "opacity-60 hover:opacity-100"
                            : "bg-base-200/50 font-medium"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-full ${style.bg} shrink-0`}
                        >
                          {style.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs opacity-75 mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-[10px] opacity-50 mt-1">
                            {moment(notification.createdAt).fromNow()}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
            <div className="border-t border-base-200 pt-2 text-center">
              <Link
                href="/dashboard/notifications"
                onClick={() => {
                  const elem = document.activeElement;
                  if (elem) elem.blur();
                }}
                className="text-xs text-primary hover:underline font-semibold block py-1"
              >
                See all notifications
              </Link>
            </div>
          </div>
        </details>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <UserDropDown />
        </div>
      </div>
    </nav>
  );
};

export default DashNav;
