"use client";

import { useAuth } from "@/context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { fetchMyOrders } from "@/api/fetchCart";
import Link from "next/link";
import { useRef, useState } from "react";
import moment from "moment";
import {
  LuShoppingBag,
  LuClock,
  LuCircleCheck,
  LuCircleAlert,
  LuArrowRight,
  LuPrinter,
  LuMessageCircle,
  LuSparkles,
  LuExternalLink,
  LuFolderCheck,
  LuUser,
  LuCalendar,
  LuShieldCheck,
  LuFileText,
} from "react-icons/lu";
import InvoiceModal from "../order/InvoiceModal";

const ClientPortalUi = () => {
  const { currentUser } = useAuth();
  const invoiceModalRef = useRef(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myOrders"],
    queryFn: fetchMyOrders,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const orders = data?.orders || [];
  const stats = data?.stats || {
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    totalSpent: 0,
    totalDue: 0,
  };

  const activeOrders = orders.filter(
    (o) => o.status === "Processing" || o.status === "Pending",
  );

  const handleOpenInvoice = (order) => {
    setSelectedOrder(order);
    invoiceModalRef.current?.showModal();
  };

  const clientName =
    currentUser?.user?.name ||
    currentUser?.user?.displayName ||
    "Valued Client";

  return (
    <div className="space-y-8 pb-10">
      <InvoiceModal ref={invoiceModalRef} order={selectedOrder} />

      {/* 1. Hero Welcome & Quick CTA Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-base-100 via-base-200 to-base-300 border border-base-content/10 p-6 sm:p-8 shadow-sm">
        <div className="absolute -right-16 -top-16 size-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="badge badge-primary badge-outline">
              Client Portal
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Welcome back, <span className="text-primary">{clientName}!</span>
            </h1>
            <p className="text-sm sm:text-base opacity-70 max-w-2xl">
              Track your active projects, service milestones, official invoices,
              and communicate directly with your dedicated project team.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/services">
              <button className="btn btn-primary btn-nexoro-primary shadow-md gap-2">
                <LuShoppingBag className="size-4" /> Explore Services
              </button>
            </Link>
            <Link href="/dashboard/support">
              <button className="btn btn-neutral gap-2">
                <LuMessageCircle className="size-4 text-info" /> Support Chat
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Overview */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Active Projects */}
        <div className="bg-base-100 p-5 rounded-xl border border-base-content/10 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold tracking-wider opacity-60">
              Active Projects
            </span>
            <div className="p-2 rounded-lg bg-warning/15 text-warning">
              <LuClock className="size-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold">
              {isLoading ? (
                <div className="skeleton h-8 w-16"></div>
              ) : (
                stats.processing + stats.pending
              )}
            </div>
            <p className="text-[11px] opacity-60 mt-0.5">In progress & queue</p>
          </div>
        </div>

        {/* Completed Deliverables */}
        <div className="bg-base-100 p-5 rounded-xl border border-base-content/10 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold tracking-wider opacity-60">
              Completed
            </span>
            <div className="p-2 rounded-lg bg-success/15 text-success">
              <LuCircleCheck className="size-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold">
              {isLoading ? (
                <div className="skeleton h-8 w-16"></div>
              ) : (
                stats.completed
              )}
            </div>
            <p className="text-[11px] opacity-60 mt-0.5">Delivered services</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-base-100 p-5 rounded-xl border border-base-content/10 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold tracking-wider opacity-60">
              Total Orders
            </span>
            <div className="p-2 rounded-lg bg-primary/15 text-primary">
              <LuShoppingBag className="size-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold">
              {isLoading ? (
                <div className="skeleton h-8 w-16"></div>
              ) : (
                stats.total
              )}
            </div>
            <p className="text-[11px] opacity-60 mt-0.5">Purchased lifetime</p>
          </div>
        </div>

        {/* Total Spent / Due */}
        <div className="bg-base-100 p-5 rounded-xl border border-base-content/10 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold tracking-wider opacity-60">
              Total Paid
            </span>
            <div className="p-2 rounded-lg bg-info/15 text-info">
              <LuShieldCheck className="size-5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold truncate">
              {isLoading ? (
                <div className="skeleton h-8 w-24"></div>
              ) : (
                (stats.totalSpent || 0).toLocaleString()
              )}
            </div>
            <p className="text-[11px] opacity-60 mt-0.5">
              {stats.totalDue > 0 ? (
                <span className="text-warning font-semibold">
                  Due: ৳{stats.totalDue.toLocaleString()}
                </span>
              ) : (
                <span className="text-success font-medium">
                  All accounts clear
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Active Projects & Real-time Progress Tracking */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <LuFolderCheck className="text-primary size-5" /> Active Projects &
            Tracking
          </h2>
          <span className="text-xs opacity-60">
            {activeOrders.length} active service
            {activeOrders.length === 1 ? "" : "s"}
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="skeleton h-44 w-full rounded-2xl"></div>
            <div className="skeleton h-44 w-full rounded-2xl"></div>
          </div>
        ) : activeOrders.length === 0 ? (
          <div className="bg-base-100 border border-dashed border-base-content/20 rounded-2xl p-8 text-center space-y-3">
            <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <LuShoppingBag className="size-7" />
            </div>
            <h3 className="font-bold text-lg">
              No Active Projects In Progress
            </h3>
            <p className="text-sm opacity-60 max-w-md mx-auto">
              You currently do not have any ongoing projects. Need
              high-converting marketing campaigns, video editing, or website
              development?
            </p>
            <Link href="/pricing" className="inline-block mt-2">
              <button className="btn btn-sm btn-primary btn-nexoro-primary gap-2">
                Order a Service <LuArrowRight className="size-4" />
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {activeOrders.map((order) => {
              const progress =
                order.progressPercent ||
                (order.status === "Processing" ? 50 : 20);

              return (
                <div
                  key={order.orderId}
                  className="bg-base-100 border border-base-content/10 rounded-2xl p-5 sm:p-7 shadow-xs hover:border-primary/40 transition-all space-y-6"
                >
                  {/* Project Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-base-content/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="badge badge-primary font-bold text-xs uppercase tracking-wider">
                          {order.orderUid}
                        </span>
                        <span
                          className={`badge badge-sm font-semibold ${
                            order.status === "Processing"
                              ? "badge-warning"
                              : "badge-info"
                          }`}
                        >
                          {order.status}
                        </span>
                        <span
                          className={`badge badge-sm font-medium ${
                            order.payment === "Success"
                              ? "badge-success text-success-content"
                              : "badge-soft badge-warning"
                          }`}
                        >
                          Payment: {order.payment}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mt-2">
                        {order.serviceTitle}
                      </h3>
                      {order.planName && (
                        <p className="text-xs opacity-60 mt-0.5">
                          Plan:{" "}
                          <span className="font-medium text-base-content">
                            {order.planName}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <button
                        onClick={() => handleOpenInvoice(order)}
                        className="btn btn-sm btn-neutral btn-soft gap-1.5"
                        title="View & Print Invoice"
                      >
                        <LuPrinter className="size-4" /> Invoice
                      </button>
                      <Link href="/dashboard/support">
                        <button className="btn btn-sm btn-primary gap-1.5">
                          <LuMessageCircle className="size-4" /> Chat Team
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Visual Progress Stepper */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold opacity-75">
                        Milestone Progress
                      </span>
                      <span className="font-bold text-primary">
                        {progress}% Complete
                      </span>
                    </div>
                    <div className="w-full bg-base-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-main-dark via-main to-main-light h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    {/* Stepper milestones */}
                    <div className="grid grid-cols-4 text-center pt-2 text-[11px] sm:text-xs text-base-content/70">
                      <div className="flex flex-col items-center">
                        <div className="size-2 rounded-full bg-primary mb-1"></div>
                        <span>Placed</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className={`size-2 rounded-full mb-1 ${
                            progress >= 30 ? "bg-primary" : "bg-base-content/20"
                          }`}
                        ></div>
                        <span>Requirements</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className={`size-2 rounded-full mb-1 ${
                            progress >= 60 ? "bg-primary" : "bg-base-content/20"
                          }`}
                        ></div>
                        <span>In Production</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className={`size-2 rounded-full mb-1 ${
                            progress >= 100
                              ? "bg-success"
                              : "bg-base-content/20"
                          }`}
                        ></div>
                        <span>Final Delivery</span>
                      </div>
                    </div>
                  </div>

                  {/* Project Details Footer (Lead, Deadlines, Due) */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-base-content/10 text-xs text-base-content/70">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <LuCalendar className="size-4 opacity-50" /> Ordered:{" "}
                        <span className="font-medium text-base-content">
                          {moment(order.createdAt).format("MMM DD, YYYY")}
                        </span>
                      </span>

                      {order.deadline && (
                        <span className="flex items-center gap-1.5">
                          <LuClock className="size-4 text-warning" /> Delivery
                          Target:{" "}
                          <span className="font-semibold text-warning">
                            {moment(order.deadline).format("MMM DD, YYYY")}
                          </span>
                        </span>
                      )}

                      {order.assignedMember && (
                        <span className="flex items-center gap-1.5">
                          <LuUser className="size-4 text-primary" /> Lead:{" "}
                          <span className="font-medium text-base-content">
                            {order.assignedMember}
                          </span>
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="font-semibold text-sm text-base-content">
                        ৳{order.price?.toLocaleString()}
                      </span>
                      {order.dueAmount > 0 && (
                        <span className="badge badge-warning badge-xs ml-2 font-bold">
                          Due: ৳{order.dueAmount.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Complete Orders & Invoices History */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <LuFileText className="text-primary size-5" /> Order History &
            Invoices
          </h2>
          <Link
            href="/dashboard/orders"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Full View <LuArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-base-content/10 bg-base-100 shadow-xs">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200/60 text-xs font-semibold uppercase tracking-wider text-base-content/70">
                <th>Order UID</th>
                <th>Service Name</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Project Status</th>
                <th>Date</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-base-content/5">
                    <td>
                      <div className="skeleton h-4 w-20"></div>
                    </td>
                    <td>
                      <div className="skeleton h-4 w-36"></div>
                    </td>
                    <td>
                      <div className="skeleton h-4 w-16"></div>
                    </td>
                    <td>
                      <div className="skeleton h-4 w-20"></div>
                    </td>
                    <td>
                      <div className="skeleton h-4 w-20"></div>
                    </td>
                    <td>
                      <div className="skeleton h-4 w-24"></div>
                    </td>
                    <td className="text-right">
                      <div className="skeleton h-8 w-20 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 opacity-60 text-sm"
                  >
                    No order history found.
                  </td>
                </tr>
              ) : (
                orders.slice(0, 8).map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-base-200/40 border-b border-base-content/5 transition-colors"
                  >
                    <td className="font-bold text-primary">{order.orderUid}</td>
                    <td>
                      <div className="font-semibold">{order.serviceTitle}</div>
                      {order.planName && (
                        <div className="text-xs opacity-60">
                          {order.planName}
                        </div>
                      )}
                    </td>
                    <td className="font-semibold">
                      ৳{order.price?.toLocaleString()}
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm font-semibold ${
                          order.payment === "Success"
                            ? "badge-success text-success-content"
                            : order.payment === "Partial"
                              ? "badge-warning"
                              : "badge-neutral"
                        }`}
                      >
                        {order.payment}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm font-semibold ${
                          order.status === "Completed"
                            ? "badge-success text-success-content"
                            : order.status === "Processing"
                              ? "badge-warning"
                              : order.status === "Cancelled"
                                ? "badge-error text-error-content"
                                : "badge-info"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="text-xs opacity-70 whitespace-nowrap">
                      {moment(order.createdAt).format("MMM DD, YYYY")}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleOpenInvoice(order)}
                        className="btn btn-xs sm:btn-sm btn-ghost gap-1 text-primary hover:bg-primary/10"
                        title="Print / Save Invoice PDF"
                      >
                        <LuPrinter className="size-3.5" />
                        <span>Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Need Immediate Help Card */}
      <section className="bg-gradient-to-r from-base-200 to-base-300 rounded-2xl border border-base-content/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-lg flex items-center justify-center sm:justify-start gap-2">
            <LuMessageCircle className="text-primary size-5" /> Need Assistance
            with Your Order?
          </h3>
          <p className="text-xs sm:text-sm opacity-70">
            Our support managers are available around the clock. Message us in
            real-time.
          </p>
        </div>
        <Link href="/dashboard/support">
          <button className="btn btn-primary btn-nexoro-primary shrink-0 gap-2">
            Start Live Chat <LuExternalLink className="size-4" />
          </button>
        </Link>
      </section>
    </div>
  );
};

export default ClientPortalUi;
