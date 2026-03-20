"use client";

import { fetchAllOrders } from "@/api/fetchCart";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LuEye, LuTrash2 } from "react-icons/lu";
import OrderModal from "./OrderModal";
import { useRef, useState } from "react";

const OrderTable = () => {
  const orderRef = useRef();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const [orderId, setOrderId] = useState(null);

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", page],
    queryFn: fetchAllOrders,
    keepPreviousData: true,
  });

  const goToPage = (pageNum) => {
    router.push(`/dashboard/orders?page=${pageNum}`);
  };

  const handleDeleteOrder = (orderId) => {
    setOrderId(orderId);
    orderRef.current?.showModal();
  };

  return (
    <div>
      <OrderModal ref={orderRef} orderId={orderId} />
      <div className="overflow-x-auto bg-base-200 rounded-box">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Name</th>
              <th>Service</th>
              <th>Delivery Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <tr key={i}>
                  <th>
                    <div className="skeleton h-5 w-20"></div>
                  </th>
                  <td>
                    <div className="skeleton h-5 w-48"></div>
                  </td>
                  <td>
                    <div className="skeleton h-5 w-36"></div>
                    <div className="skeleton h-5 w-24 mt-2"></div>
                  </td>
                  <td>
                    <div className="skeleton h-5 w-20"></div>
                  </td>
                  <td>
                    <div className="skeleton h-5 w-24"></div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <div className="skeleton rounded-full size-10"></div>
                      <div className="skeleton rounded-full size-10"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan={7} className="text-center">
                  Error fetching orders
                </td>
              </tr>
            ) : !orders.orders || orders.orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.orders.map((order) => (
                <tr key={order.orderId}>
                  <th>
                    <Link
                      className="link link-hover"
                      href={`/dashboard/orders/${order.orderId}`}
                    >
                      {order.orderUid}
                    </Link>
                  </th>
                  <td>{order.userName}</td>
                  <td>
                    <h2>{order.serviceTitle}</h2>
                    <p className="font-semibold">
                      {order.planName} - ${order.planPrice}
                    </p>
                  </td>
                  <td>
                    <p
                      className={`badge ${order.status === "Completed" ? "badge-success" : order.status === "Processing" ? "badge-warning" : order.status === "Cancelled" ? "badge-error" : "badge-info"}`}
                    >
                      {order.status}
                    </p>
                  </td>
                  <td>{moment(order.createdAt).format("Do MMM, YYYY")}</td>
                  <td>
                    <Link href={`/dashboard/orders/${order.orderId}`}>
                      <button className="btn btn-success btn-soft btn-circle">
                        <LuEye />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteOrder(order.orderId)}
                      className="btn btn-error btn-soft btn-circle ml-2"
                    >
                      <LuTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <th>Order ID</th>
              <th>Name</th>
              <th>Service</th>
              <th>Delivery Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>
      </div>

      {!isLoading && orders?.pagination.totalPages > 1 && (
        <div className="mt-5">
          <div className="join">
            <button
              className="join-item btn"
              disabled={!orders.pagination.hasPrev}
              onClick={() => goToPage(page - 1)}
            >
              «
            </button>
            {[...Array(orders.pagination.totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  className={`join-item btn ${
                    page === pageNum ? "btn-active btn-success" : ""
                  }`}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              className="join-item btn"
              disabled={!orders.pagination.hasNext}
              onClick={() => goToPage(page + 1)}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
