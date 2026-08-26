"use client";

import { useEffect, useState } from "react";
import DashBread from "@/components/dashboard/DashBread";
import { useSocket } from "@/context/SocketProvider";
import { auth } from "@/firebase/firebase.config";
import api from "@/axios/axiosInstance";
import { useRouter } from "next/navigation";
import moment from "moment";
import {
  LuBell,
  LuCheck,
  LuCircleAlert,
  LuCircleCheck,
  LuCircleX,
  LuCreditCard,
  LuMessageSquare,
  LuPackage,
} from "react-icons/lu";

export default function NotificationsPage() {
  const { setUnreadNotificationsCount } = useSocket();
  const router = useRouter();

  const [notificationsList, setNotificationsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const limit = 15;

  const fetchAllNotifications = async (page = 1) => {
    setIsLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      const response = await api.get(
        `/notifications?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setNotificationsList(response.data.notifications);
        setTotalPages(response.data.pagination.totalPages);
        setUnreadNotificationsCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch all notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchAllNotifications(currentPage);
      }
    });

    return () => unsubscribe();
  }, [currentPage]);

  const getNotificationStyles = (type) => {
    switch (type) {
      case "new_order":
        return {
          icon: <LuPackage className="size-5 text-primary" />,
          bg: "bg-primary/10",
          label: "New Order",
        };
      case "order_cancelled":
        return {
          icon: <LuCircleX className="size-5 text-error" />,
          bg: "bg-error/10",
          label: "Cancelled",
        };
      case "order_completed":
        return {
          icon: <LuCircleCheck className="size-5 text-success" />,
          bg: "bg-success/10",
          label: "Completed",
        };
      case "payment_completed":
        return {
          icon: <LuCreditCard className="size-5 text-success" />,
          bg: "bg-success/10",
          label: "Payment Done",
        };
      case "payment_due":
        return {
          icon: <LuCircleAlert className="size-5 text-warning" />,
          bg: "bg-warning/10",
          label: "Payment Due",
        };
      case "new_message":
        return {
          icon: <LuMessageSquare className="size-5 text-info" />,
          bg: "bg-info/10",
          label: "Message",
        };
      default:
        return {
          icon: <LuBell className="size-5 text-neutral" />,
          bg: "bg-neutral/10",
          label: "General",
        };
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        const token = await auth.currentUser?.getIdToken();
        await api.patch(
          `/notifications/${notification._id}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setNotificationsList((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n,
          ),
        );
        setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking read:", error);
      }
    }

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

      setNotificationsList((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadNotificationsCount(0);
    } catch (error) {
      console.error("Error marking all read:", error);
    }
  };

  // Filter local items
  const filteredNotifications = notificationsList.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "orders") {
      return ["new_order", "order_completed", "order_cancelled"].includes(
        item.type,
      );
    }
    if (activeFilter === "payments") {
      return ["payment_completed", "payment_due"].includes(item.type);
    }
    if (activeFilter === "messages") {
      return ["new_message"].includes(item.type);
    }
    return true;
  });

  return (
    <main className="p-4 space-y-6">
      <section className="flex justify-between items-center">
        <DashBread title="Notifications" />
        <button
          onClick={handleMarkAllRead}
          className="btn btn-sm btn-outline btn-primary gap-1 font-semibold"
          disabled={!notificationsList.some((n) => !n.isRead)}
        >
          <LuCheck className="size-4" /> Mark all read
        </button>
      </section>

      {/* Filters and List view */}
      <section className="bg-base-100 rounded-box p-6 space-y-6 shadow-sm border border-base-200">
        <div className="flex gap-2 overflow-x-auto">
          {[
            {
              id: "all",
              label: "All Notifications",
              icon: <LuBell className="text-base" />,
            },
            {
              id: "orders",
              label: "Orders",
              icon: <LuPackage className="text-base" />,
            },
            {
              id: "payments",
              label: "Payments",
              icon: <LuCreditCard className="text-base" />,
            },
            {
              id: "messages",
              label: "Messages",
              icon: <LuMessageSquare className="text-base" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`btn btn-sm rounded-full ${
                activeFilter === tab.id
                  ? "btn-primary font-bold shadow-md"
                  : "btn-soft opacity-70 hover:opacity-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-base-100">
                <LuBell className="size-10 opacity-30" />
              </div>
            </div>
            <p className="text-lg font-semibold opacity-60">
              No notifications found
            </p>
            <p className="text-sm opacity-40 max-w-sm mx-auto">
              There are no notifications matching your selection at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => {
              const style = getNotificationStyles(notification.type);
              return (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-start bg-base-200 gap-4 py-4 px-3 cursor-pointer hover:bg-base-200/40 rounded-xl transition-all ${
                    !notification.isRead
                      ? "bg-base-300 border-l-4 border-primary"
                      : ""
                  }`}
                >
                  <div className={`p-3 rounded-xl ${style.bg} shrink-0`}>
                    {style.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-base truncate flex items-center gap-2">
                        {notification.title}
                        {!notification.isRead && (
                          <span className="badge badge-primary badge-xs">
                            New
                          </span>
                        )}
                      </h3>
                      <span className="text-xs opacity-50 shrink-0">
                        {moment(notification.createdAt).format("LLL")}
                      </span>
                    </div>
                    <p className="text-sm opacity-70 mt-1 max-w-3xl leading-relaxed">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="badge badge-soft text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5">
                        {style.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t border-base-200">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <LuChevronLeft className="size-5" />
            </button>
            <span className="text-sm font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages || isLoading}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <LuChevronRight className="size-5" />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
