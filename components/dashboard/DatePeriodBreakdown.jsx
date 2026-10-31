"use client";

import { useState, useEffect } from "react";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { getPeriodBreakdown } from "@/api/fetchAnalytics";
import { useSocket } from "@/context/SocketProvider";
import {
  LuReceipt,
  LuShoppingBag,
  LuSparkles,
  LuSearch,
  LuExternalLink,
  LuChevronDown,
  LuChevronUp,
  LuRefreshCw,
} from "react-icons/lu";
import Link from "next/link";

const PAGE_SIZE = 10;

const DatePeriodBreakdown = ({ dateRange, fallbackSummary }) => {
  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "expenses"
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(true);

  const { socket } = useSocket();
  const queryClient = useQueryClient();

  // 1. Debounce search input to avoid spamming the backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 2. Reset page to 1 whenever tab or date filter changes
  useEffect(() => {
    setPage(1);
  }, [activeTab, dateRange?.startDate, dateRange?.endDate]);

  // 3. TanStack Query: Backend-optimized pagination & filtering
  const {
    data: responseData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "periodBreakdown",
      activeTab,
      page,
      PAGE_SIZE,
      debouncedSearch,
      dateRange?.startDate,
      dateRange?.endDate,
    ],
    queryFn: () =>
      getPeriodBreakdown({
        tab: activeTab,
        page,
        limit: PAGE_SIZE,
        startDate: dateRange?.startDate,
        endDate: dateRange?.endDate,
        search: debouncedSearch,
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });

  // 4. Socket.io real-time listener for automated query invalidation
  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["periodBreakdown"] });
    };
    socket.on("dashboardStatsUpdate", handleUpdate);
    return () => {
      socket.off("dashboardStatsUpdate", handleUpdate);
    };
  }, [socket, queryClient]);

  const items = responseData?.items || [];
  const pagination = responseData?.pagination || {};
  const summary = responseData?.summary || fallbackSummary || {};

  const totalRevenue = summary.totalIncome ?? 0;
  const totalExpenseAmount = summary.totalExpenseAmount ?? 0;
  const netDifference =
    summary.netDifference ?? totalRevenue - totalExpenseAmount;

  const totalOrdersCount = summary.totalOrders ?? 0;
  const totalExpensesCount = summary.totalExpenses ?? 0;

  // Smart sliding window pagination buttons
  const totalPages = pagination?.totalPages || 1;
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [1];
    if (page > 3) pages.push("...");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    if (!pages.includes(totalPages)) pages.push(totalPages);
    return pages;
  };

  return (
    <div className="card card-border bg-base-100 overflow-hidden shadow-xs rounded-2xl">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 border-b border-base-200/80 bg-base-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center justify-between flex-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/10 text-accent">
              <LuSparkles className="text-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base tracking-tight">
                  Itemized Period Breakdown
                </h3>
                <span className="badge badge-sm badge-soft badge-primary font-medium">
                  {summary.periodLabel || dateRange?.label || "Current Period"}
                </span>
                {isFetching && (
                  <span
                    className="loading loading-spinner loading-xs text-primary"
                    title="Refreshing data..."
                  ></span>
                )}
              </div>
              <p className="text-xs text-base-content/60">
                Detailed transactions and expenses recorded during this period
                (10 per page)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-sm btn-ghost btn-circle md:hidden"
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? <LuChevronUp /> : <LuChevronDown />}
          </button>
        </div>

        {/* Quick Period KPI summary badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="badge badge-soft badge-primary font-semibold text-xs py-2 px-3">
            Income: ৳{totalRevenue.toLocaleString()}
          </div>
          <div className="badge badge-soft badge-error font-semibold text-xs py-2 px-3">
            Expenses: ৳{totalExpenseAmount.toLocaleString()}
          </div>
          <div
            className={`badge badge-soft font-semibold text-xs py-2 px-3 ${
              netDifference >= 0 ? "badge-success" : "badge-error"
            }`}
          >
            Net: {netDifference >= 0 ? "+" : "-"}৳
            {Math.abs(netDifference).toLocaleString()}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden md:inline-flex btn btn-xs btn-ghost gap-1"
          >
            {isExpanded ? (
              <>
                <LuChevronUp /> Collapse
              </>
            ) : (
              <>
                <LuChevronDown /> Expand
              </>
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Controls: Tabs & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Tabs */}
            <div className="tabs tabs-box bg-base-200/70 p-1 rounded-xl">
              <button
                onClick={() => {
                  setActiveTab("orders");
                  setPage(1);
                }}
                className={`tab tab-sm font-semibold gap-1.5 rounded-lg transition-all ${
                  activeTab === "orders"
                    ? "tab-active bg-primary text-white"
                    : ""
                }`}
              >
                <LuShoppingBag />
                <span>Orders & Revenue ({totalOrdersCount})</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("expenses");
                  setPage(1);
                }}
                className={`tab tab-sm font-semibold gap-1.5 rounded-lg transition-all ${
                  activeTab === "expenses"
                    ? "tab-active bg-error text-white"
                    : ""
                }`}
              >
                <LuReceipt />
                <span>Expenses & Costs ({totalExpensesCount})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-50" />
              <input
                type="text"
                placeholder={
                  activeTab === "orders"
                    ? "Search order, client, service..."
                    : "Search title, method, ref..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-sm input-bordered w-full pl-8 pr-8 text-xs rounded-xl"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs opacity-40 hover:opacity-100"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Initial Loading Skeleton */}
          {isLoading ? (
            <div className="p-8 space-y-4">
              <div className="h-4 bg-base-300 rounded w-1/4 animate-pulse"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-base-200/60 rounded-xl animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ) : isError ? (
            /* Error State with Retry */
            <div className="py-12 text-center space-y-3">
              <p className="text-sm text-error font-medium">
                Failed to load breakdown items.
              </p>
              <button
                onClick={() => refetch()}
                className="btn btn-sm btn-outline btn-error gap-1.5 rounded-xl"
              >
                <LuRefreshCw className="text-xs" /> Retry
              </button>
            </div>
          ) : (
            <>
              {/* Tab 1: Orders Table */}
              {activeTab === "orders" && (
                <div className="overflow-x-auto rounded-xl border border-base-200">
                  {items.length === 0 ? (
                    <div className="py-12 text-center space-y-2">
                      <LuShoppingBag className="text-3xl opacity-30 mx-auto" />
                      <p className="text-sm font-medium text-base-content/70">
                        {debouncedSearch
                          ? `No orders matching "${debouncedSearch}"`
                          : "No orders found for this selected period"}
                      </p>
                      <p className="text-xs text-base-content/40">
                        {debouncedSearch
                          ? "Try clearing your search keyword."
                          : "Try choosing another date or widening your date range filter."}
                      </p>
                    </div>
                  ) : (
                    <table className="table table-sm w-full text-xs">
                      <thead className="bg-base-200/50 text-base-content/70">
                        <tr>
                          <th>Order ID</th>
                          <th>Client</th>
                          <th>Service</th>
                          <th>Amount Received</th>
                          <th>Payment</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((order) => (
                          <tr key={order._id} className="hover:bg-base-200/30">
                            <td className="font-semibold text-primary">
                              <Link
                                href="/dashboard/orders"
                                className="hover:underline flex items-center gap-1"
                              >
                                {order.orderId}
                                <LuExternalLink className="text-[10px] opacity-60" />
                              </Link>
                            </td>
                            <td>
                              <div className="font-medium text-base-content">
                                {order.clientName}
                              </div>
                              {order.clientEmail && (
                                <div className="text-[10px] text-base-content/50 truncate max-w-[150px]">
                                  {order.clientEmail}
                                </div>
                              )}
                            </td>
                            <td className="font-medium max-w-[180px] truncate">
                              {order.serviceName}
                            </td>
                            <td className="font-bold text-success">
                              ৳{Number(order.amount).toLocaleString()}
                              {order.price > order.amount && (
                                <span className="text-[10px] text-base-content/40 block font-normal">
                                  Total: ৳{Number(order.price).toLocaleString()}
                                </span>
                              )}
                            </td>
                            <td>
                              <span
                                className={`badge badge-xs font-semibold ${
                                  order.payment === "Success"
                                    ? "badge-success badge-soft"
                                    : order.payment === "Partial"
                                      ? "badge-warning badge-soft"
                                      : "badge-error badge-soft"
                                }`}
                              >
                                {order.payment}
                              </span>
                            </td>
                            <td>
                              <span className="badge badge-xs badge-neutral">
                                {order.status}
                              </span>
                            </td>
                            <td className="text-base-content/60 text-[11px] whitespace-nowrap">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timeZone: "Asia/Dhaka",
                                },
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Tab 2: Expenses Table */}
              {activeTab === "expenses" && (
                <div className="overflow-x-auto rounded-xl border border-base-200">
                  {items.length === 0 ? (
                    <div className="py-12 text-center space-y-2">
                      <LuReceipt className="text-3xl opacity-30 mx-auto" />
                      <p className="text-sm font-medium text-base-content/70">
                        {debouncedSearch
                          ? `No expenses matching "${debouncedSearch}"`
                          : "No expenses found for this selected period"}
                      </p>
                      <p className="text-xs text-base-content/40">
                        {debouncedSearch
                          ? "Try clearing your search keyword."
                          : "No expense or project cost was recorded in this period."}
                      </p>
                    </div>
                  ) : (
                    <table className="table table-sm w-full text-xs">
                      <thead className="bg-base-200/50 text-base-content/70">
                        <tr>
                          <th>Title & Description</th>
                          <th>Type</th>
                          <th>Paid To / Reference</th>
                          <th>Amount</th>
                          <th>Method</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((exp) => (
                          <tr key={exp._id} className="hover:bg-base-200/30">
                            <td className="font-semibold text-base-content">
                              {exp.title}
                            </td>
                            <td>
                              <span
                                className={`badge badge-xs font-medium ${
                                  exp.type === "Order Cost"
                                    ? "badge-secondary badge-soft"
                                    : "badge-primary badge-soft"
                                }`}
                              >
                                {exp.type}
                              </span>
                            </td>
                            <td className="text-base-content/70">
                              {exp.paidTo || exp.ref || "-"}
                            </td>
                            <td className="font-bold text-error">
                              -৳{Number(exp.amount).toLocaleString()}
                            </td>
                            <td>
                              <span className="badge badge-xs badge-neutral uppercase">
                                {exp.paymentMethod || "N/A"}
                              </span>
                            </td>
                            <td className="text-base-content/60 text-[11px] whitespace-nowrap">
                              {new Date(exp.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                timeZone: "Asia/Dhaka",
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Server-Side Backend-Optimized Pagination Controls */}
              {(pagination?.totalItems > 0 || items.length > 0) && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-base-content/70">
                  <div className="flex items-center gap-2">
                    <span>
                      Showing{" "}
                      <span className="font-semibold text-base-content">
                        {pagination?.start || 0}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold text-base-content">
                        {pagination?.end || 0}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-base-content">
                        {pagination?.totalItems || 0}
                      </span>{" "}
                      {activeTab === "orders" ? "orders" : "expenses"}
                    </span>
                    <span className="badge badge-xs badge-ghost">
                      10 per page
                    </span>
                    {isFetching && !isLoading && (
                      <span className="loading loading-spinner loading-xs text-primary ml-1" />
                    )}
                  </div>

                  {totalPages > 1 && (
                    <div className="join shadow-xs">
                      {/* Prev Button */}
                      <button
                        type="button"
                        disabled={!pagination?.hasPrev || isFetching}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="join-item btn btn-xs sm:btn-sm"
                        aria-label="Previous page"
                      >
                        « Prev
                      </button>

                      {/* Numbered Page Buttons with Ellipsis */}
                      {getPageNumbers().map((pageNum, idx) =>
                        pageNum === "..." ? (
                          <button
                            key={`ellipsis-${idx}`}
                            type="button"
                            className="join-item btn btn-xs sm:btn-sm btn-disabled"
                            disabled
                          >
                            ...
                          </button>
                        ) : (
                          <button
                            key={`page-${pageNum}`}
                            type="button"
                            onClick={() => setPage(pageNum)}
                            disabled={isFetching && page === pageNum}
                            className={`join-item btn btn-xs sm:btn-sm ${
                              page === pageNum
                                ? "btn-primary text-white font-bold"
                                : "hover:bg-base-200"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ),
                      )}

                      {/* Next Button */}
                      <button
                        type="button"
                        disabled={!pagination?.hasNext || isFetching}
                        onClick={() => setPage((p) => p + 1)}
                        className="join-item btn btn-xs sm:btn-sm"
                        aria-label="Next page"
                      >
                        Next »
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePeriodBreakdown;
