"use client";

import { fetchMyOrders } from "@/api/fetchCart";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  LuSearch,
  LuShoppingBag,
  LuClock,
  LuCircleCheck,
  LuCircleX,
  LuPrinter,
  LuMessageCircle,
  LuRotateCcw,
  LuCalendar,
  LuUser,
  LuInbox,
} from "react-icons/lu";
import InvoiceModal from "../order/InvoiceModal";
import DashBread from "../DashBread";

const ClientOrdersView = () => {
  const invoiceModalRef = useRef(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["myOrders"],
    queryFn: fetchMyOrders,
  });

  const orders = data?.orders || [];
  const stats = data?.stats || {
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
  };

  const handleOpenInvoice = (order) => {
    setSelectedOrder(order);
    invoiceModalRef.current?.showModal();
  };

  // Client-side filtering for fast interactive search & status tab switching
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" ||
      (order.status || "").toLowerCase() === statusFilter.toLowerCase();

    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      order.orderUid?.toLowerCase().includes(q) ||
      order.serviceTitle?.toLowerCase().includes(q) ||
      order.planName?.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <main className="space-y-6 pb-12">
      <InvoiceModal ref={invoiceModalRef} order={selectedOrder} />

      {/* Header */}
      <section>
        <DashBread title="My Orders" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3">
              <LuShoppingBag className="text-primary size-8" /> My Orders &
              Services
            </h1>
            <p className="text-sm opacity-60 mt-1">
              Review your purchase history, monitor service deliverables, and
              print official invoices.
            </p>
          </div>
          <Link href="/services">
            <button className="btn btn-primary btn-nexoro-primary shadow-xs">
              <LuShoppingBag /> Order New Service
            </button>
          </Link>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="bg-base-100 p-4 rounded-2xl border border-base-content/10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Orders", count: stats.total },
            { id: "processing", label: "In Progress", count: stats.processing },
            { id: "pending", label: "Pending", count: stats.pending },
            { id: "completed", label: "Completed", count: stats.completed },
            { id: "cancelled", label: "Cancelled", count: stats.cancelled },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`btn btn-sm rounded-full font-medium transition-all ${
                statusFilter === tab.id
                  ? "btn-primary bg-main border-main text-white shadow-xs"
                  : "btn-ghost opacity-70 hover:opacity-100"
              }`}
            >
              {tab.label}
              <span
                className={`badge badge-xs ml-1 ${
                  statusFilter === tab.id
                    ? "bg-white/20 text-white"
                    : "badge-neutral"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <label className="input rounded-full">
          <LuSearch className="opacity-50 h-[1em]" />
          <input
            type="text"
            placeholder="Search order ID or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-50 hover:opacity-100"
            >
              Clear
            </button>
          )}
        </label>
      </section>

      {/* Orders Table / Cards List */}
      <section>
        <div className="overflow-x-auto rounded-2xl border border-base-content/10 bg-base-100 shadow-xs">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200/60 text-xs font-semibold uppercase tracking-wider text-base-content/70">
                <th>Order UID</th>
                <th>Service & Plan</th>
                <th>Payment</th>
                <th>Milestone Status</th>
                <th>Assigned Lead</th>
                <th>Target Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-base-content/5">
                    <td>
                      <div className="skeleton h-4 w-24"></div>
                    </td>
                    <td>
                      <div className="skeleton h-4 w-40"></div>
                      <div className="skeleton h-3 w-24 mt-1"></div>
                    </td>
                    <td>
                      <div className="skeleton h-4 w-20"></div>
                    </td>
                    <td>
                      <div className="skeleton h-4 w-28"></div>
                    </td>
                    <td>
                      <div className="skeleton h-4 w-24"></div>
                    </td>
                    <td>
                      <div className="skeleton h-4 w-24"></div>
                    </td>
                    <td className="text-right">
                      <div className="skeleton h-8 w-24 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <p className="text-error font-semibold">
                      Failed to fetch your orders. Please try again.
                    </p>
                    <button
                      onClick={() => refetch()}
                      className="btn btn-sm btn-ghost gap-2 mt-2"
                    >
                      <LuRotateCcw /> Retry
                    </button>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                      <LuInbox className="size-12 opacity-30 text-primary" />
                      <h3 className="font-semibold text-lg">No orders found</h3>
                      <p className="text-xs opacity-60">
                        {searchTerm || statusFilter !== "all"
                          ? "No orders match your filter criteria. Try resetting filters."
                          : "You have not placed any orders with Nexoro yet."}
                      </p>
                      {(searchTerm || statusFilter !== "all") && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                          }}
                          className="btn btn-sm btn-primary btn-soft gap-1.5"
                        >
                          <LuRotateCcw /> Reset Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const progress =
                    order.progressPercent ||
                    (order.status === "Completed"
                      ? 100
                      : order.status === "Processing"
                        ? 50
                        : 15);

                  return (
                    <tr
                      key={order.orderId}
                      className="hover:bg-base-200/40 border-b border-base-content/5 transition-colors"
                    >
                      {/* Order UID */}
                      <td className="font-bold text-primary whitespace-nowrap">
                        {order.orderUid}
                      </td>

                      {/* Service & Plan */}
                      <td>
                        <div className="font-bold">{order.serviceTitle}</div>
                        <div className="text-xs opacity-60 mt-0.5">
                          {order.planName && `${order.planName} • `}৳
                          {order.price?.toLocaleString()}
                        </div>
                      </td>

                      {/* Payment Status */}
                      <td>
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`badge badge-sm font-semibold ${
                              order.payment === "Success"
                                ? "badge-success text-success-content"
                                : order.payment === "Partial"
                                  ? "badge-warning"
                                  : order.payment === "Failed"
                                    ? "badge-error text-error-content"
                                    : "badge-neutral"
                            }`}
                          >
                            {order.payment}
                          </span>
                          {order.payment === "Partial" &&
                            order.dueAmount > 0 && (
                              <span className="text-[11px] text-warning font-medium">
                                Due: ৳{order.dueAmount.toLocaleString()}
                              </span>
                            )}
                        </div>
                      </td>

                      {/* Milestone Status & Progress Bar */}
                      <td>
                        <div className="space-y-1.5 min-w-[130px]">
                          <div className="flex items-center justify-between text-xs">
                            <span
                              className={`badge badge-xs font-semibold ${
                                order.status === "Completed"
                                  ? "badge-success"
                                  : order.status === "Processing"
                                    ? "badge-warning"
                                    : order.status === "Cancelled"
                                      ? "badge-error"
                                      : "badge-info"
                              }`}
                            >
                              {order.status}
                            </span>
                            <span className="text-[11px] font-bold opacity-75">
                              {progress}%
                            </span>
                          </div>
                          <div className="w-full bg-base-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-1.5 rounded-full"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Assigned Lead */}
                      <td>
                        {order.assignedMember ? (
                          <div className="flex items-center gap-1.5 text-xs">
                            <LuUser className="size-3.5 text-primary" />
                            <span className="font-medium">
                              {order.assignedMember}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs opacity-50 italic">
                            Team Queue
                          </span>
                        )}
                      </td>

                      {/* Date / Deadline */}
                      <td>
                        <div className="text-xs">
                          <div className="opacity-70">
                            {moment(order.createdAt).format("MMM DD, YYYY")}
                          </div>
                          {order.deadline && (
                            <div className="text-[11px] text-warning font-medium mt-0.5 flex items-center gap-1">
                              <LuClock className="size-3" />
                              {moment(order.deadline).format("MMM DD, YYYY")}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenInvoice(order)}
                            className="btn btn-sm btn-ghost gap-1.5 text-primary hover:bg-primary/10"
                            title="View / Print Invoice"
                          >
                            <LuPrinter className="size-4" />
                            <span className="hidden sm:inline">Invoice</span>
                          </button>
                          <Link href="/dashboard/support">
                            <button
                              className="btn btn-sm btn-circle btn-ghost"
                              title="Chat with support about this order"
                            >
                              <LuMessageCircle className="size-4 text-info" />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default ClientOrdersView;
