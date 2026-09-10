"use client";

import { fetchAllOrders } from "@/api/fetchCart";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  LuEye,
  LuInbox,
  LuRotateCcw,
  LuSquarePen,
  LuTrash2,
} from "react-icons/lu";
import OrderAddModal from "./OrderAddModal";
import OrderModal from "./OrderModal";

const OrderTable = ({
  orders: propOrders,
  isLoading: propIsLoading,
  isError: propIsError,
  page: propPage,
  setPage: propSetPage,
  filterTab = "all",
  searchTerm = "",
  onResetFilters,
}) => {
  const orderRef = useRef();
  const orderEditRef = useRef();
  const [internalOrderId, setOrderId] = useState(null);
  const [internalPage, setInternalPage] = useState(1);

  // Fallback TanStack Query if props not passed directly
  const page = propPage !== undefined ? propPage : internalPage;
  const setPage = propSetPage || setInternalPage;

  const internalQuery = useQuery({
    queryKey: [
      "orders",
      { page, status: filterTab, search: searchTerm, limit: 10 },
    ],
    queryFn: fetchAllOrders,
    placeholderData: keepPreviousData,
    enabled: propOrders === undefined,
  });

  const orders = propOrders !== undefined ? propOrders : internalQuery.data;
  const isLoading =
    propIsLoading !== undefined ? propIsLoading : internalQuery.isLoading;
  const isError =
    propIsError !== undefined ? propIsError : internalQuery.isError;

  const handleDeleteOrder = (id) => {
    setOrderId(id);
    orderRef.current?.showModal();
  };

  const pagination = orders?.pagination;
  const totalPages = pagination?.totalPages || 0;
  const totalOrders = pagination?.totalOrders || 0;

  // Generate clean page numbers window
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (page >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <div>
      <OrderAddModal
        ref={orderEditRef}
        isEditing={true}
        orderId={internalOrderId}
        setOrderId={setOrderId}
      />
      <OrderModal
        ref={orderRef}
        orderId={internalOrderId}
        setOrderId={setOrderId}
      />

      <div className="overflow-x-auto rounded-box border border-base-200 bg-base-100 shadow-xs">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200 text-xs font-semibold uppercase tracking-wider text-base-content/70">
              <th>Order ID</th>
              <th>Name</th>
              <th>Service</th>
              <th>Payment Status</th>
              <th>Delivery Status</th>
              <th>Assigned</th>
              <th>Created By</th>
              <th>Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="border-b border-base-200/50">
                  <th>
                    <div className="skeleton h-5 w-20"></div>
                  </th>
                  <td>
                    <div className="skeleton h-5 w-44"></div>
                  </td>
                  <td>
                    <div className="skeleton h-5 w-36"></div>
                    <div className="skeleton h-4 w-24 mt-1.5"></div>
                  </td>
                  <td>
                    <div className="skeleton h-5 w-24"></div>
                  </td>
                  <td>
                    <div className="skeleton h-5 w-24"></div>
                  </td>
                  <td>
                    <div className="skeleton h-5 w-28"></div>
                  </td>
                  <td>
                    <div className="skeleton h-5 w-20"></div>
                  </td>
                  <td>
                    <div className="skeleton h-5 w-24"></div>
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <div className="skeleton rounded-full size-8"></div>
                      <div className="skeleton rounded-full size-8"></div>
                      <div className="skeleton rounded-full size-8"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan={9} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-error font-medium">
                      Failed to fetch orders. Please try again.
                    </p>
                    {onResetFilters && (
                      <button
                        type="button"
                        onClick={onResetFilters}
                        className="btn btn-sm btn-ghost gap-1.5"
                      >
                        <LuRotateCcw className="size-4" /> Reset Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : !orders?.orders || orders.orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-16">
                  <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                    <LuInbox className="size-10 text-base-content/30" />
                    <h3 className="font-semibold text-base">No orders found</h3>
                    <p className="text-xs text-base-content/60">
                      {searchTerm || (filterTab && filterTab !== "all")
                        ? "No orders matched your search or status filter criteria."
                        : "There are currently no orders placed in the system."}
                    </p>
                    {(searchTerm || (filterTab && filterTab !== "all")) &&
                      onResetFilters && (
                        <button
                          type="button"
                          onClick={onResetFilters}
                          className="btn btn-sm btn-primary btn-soft mt-2 gap-1.5"
                        >
                          <LuRotateCcw className="size-3.5" /> Clear Filters
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ) : (
              orders.orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="hover:bg-base-200/40 border-b border-base-200/50 transition-colors"
                >
                  <th>
                    <Link
                      className="link link-hover font-semibold text-primary"
                      href={`/dashboard/orders/${order.orderId}`}
                    >
                      {order.orderUid || order.orderId}
                    </Link>
                  </th>
                  <td className="font-medium">{order.userName}</td>
                  <td>
                    <div className="font-medium">{order.serviceTitle}</div>
                    <div className="text-xs text-base-content/70">
                      {order.planName && `${order.planName} • `}৳
                      {order.price?.toLocaleString() || order.price}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm font-semibold ${
                        order.payment === "Success"
                          ? "badge-success"
                          : order.payment === "Pending"
                            ? "badge-warning"
                            : order.payment === "Failed"
                              ? "badge-error"
                              : "badge-info"
                      }`}
                    >
                      {order.payment}
                    </span>
                    {order.payment === "Success" ? (
                      <div className="text-xs text-base-content/60 mt-0.5">
                        Paid by {order.paymentMethod}
                      </div>
                    ) : order.payment === "Partial" ? (
                      <div className="text-xs text-base-content/60 mt-0.5 flex items-center gap-1">
                        Due:
                        <span className="badge badge-warning badge-xs font-bold">
                          ৳{order.dueAmount}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm font-semibold ${
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
                  </td>
                  <td>
                    {order.assignedTo ? (
                      <span className="badge badge-sm badge-success badge-soft">
                        {order.assignedMember || "Assigned"}
                      </span>
                    ) : (
                      <span className="badge badge-sm badge-error badge-soft">
                        Not Assigned
                      </span>
                    )}
                  </td>
                  <td className="text-xs text-base-content/70">
                    {order.createdBy === null ? "Customer" : order.createdBy}
                  </td>
                  <td className="text-xs text-base-content/70 whitespace-nowrap">
                    {moment(order.createdAt).fromNow()}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/dashboard/orders/${order.orderId}`}>
                        <button
                          className="btn btn-success btn-soft btn-circle btn-sm"
                          title="View Order"
                        >
                          <LuEye />
                        </button>
                      </Link>
                      <button
                        className="btn btn-primary btn-soft btn-circle btn-sm"
                        onClick={() => {
                          setOrderId(order.orderId);
                          orderEditRef.current?.showModal();
                        }}
                        title="Edit Order"
                      >
                        <LuSquarePen />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.orderId)}
                        className="btn btn-error btn-soft btn-circle btn-sm"
                        title="Delete Order"
                      >
                        <LuTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="bg-base-200 text-xs font-semibold uppercase tracking-wider text-base-content/70">
              <th>Order ID</th>
              <th>Name</th>
              <th>Service</th>
              <th>Payment Status</th>
              <th>Delivery Status</th>
              <th>Assigned</th>
              <th>Created By</th>
              <th>Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination - ONLY SHOW WHEN MORE THAN 10 ORDERS */}
      {!isLoading && totalOrders > 10 && (
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-base-content/70">
            Showing{" "}
            <span className="font-semibold">{pagination?.start || 1}</span> to{" "}
            <span className="font-semibold">
              {pagination?.end || totalOrders}
            </span>{" "}
            of <span className="font-semibold">{totalOrders}</span> orders
          </div>

          <div className="join shadow-xs">
            <button
              type="button"
              className="join-item btn btn-sm"
              disabled={!pagination?.hasPrev}
              onClick={() => setPage(page - 1)}
            >
              « Prev
            </button>

            {getPageNumbers().map((pageNum, i) => {
              if (pageNum === "...") {
                return (
                  <button
                    key={`ellipsis-${i}`}
                    type="button"
                    className="join-item btn btn-sm btn-disabled"
                  >
                    ...
                  </button>
                );
              }
              const isCurrent = page === pageNum;
              return (
                <button
                  key={pageNum}
                  type="button"
                  className={`join-item btn btn-sm ${
                    isCurrent
                      ? "btn-primary bg-main border-main text-white"
                      : ""
                  }`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              className="join-item btn btn-sm"
              disabled={!pagination?.hasNext}
              onClick={() => setPage(page + 1)}
            >
              Next »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
