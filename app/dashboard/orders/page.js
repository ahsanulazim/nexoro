"use client";

import { fetchAllOrders } from "@/api/fetchCart";
import DashBread from "@/components/dashboard/DashBread";
import OrderAddModal from "@/components/dashboard/order/OrderAddModal";
import OrderNav from "@/components/dashboard/order/OrderNav";
import OrderTable from "@/components/dashboard/order/OrderTable";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { LuPlus, LuShoppingBag } from "react-icons/lu";

const OrdersContent = () => {
  const orderAddRef = useRef();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial values from URL if present
  const initialPage = Number(searchParams.get("page") || 1);
  const initialStatus = searchParams.get("status") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [page, setPage] = useState(initialPage);
  const [filterTab, setFilterTab] = useState(initialStatus);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // TanStack Query for fetching filtered, searched, and paginated orders
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "orders",
      { page, status: filterTab, search: searchTerm, limit: 10 },
    ],
    queryFn: fetchAllOrders,
    placeholderData: keepPreviousData,
  });

  // URL sync helper
  const updateUrl = (newPage, newStatus, newSearch) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", newPage);
    if (newStatus && newStatus !== "all") params.set("status", newStatus);
    if (newSearch && newSearch.trim()) params.set("search", newSearch.trim());

    const qs = params.toString();
    const url = qs ? `/dashboard/orders?${qs}` : `/dashboard/orders`;
    router.replace(url, { scroll: false });
  };

  const handleTabChange = (newStatus) => {
    setFilterTab(newStatus);
    setPage(1);
    updateUrl(1, newStatus, searchTerm);
  };

  const handleSearchChange = (newSearch) => {
    setSearchTerm(newSearch);
    setPage(1);
    updateUrl(1, filterTab, newSearch);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    updateUrl(newPage, filterTab, searchTerm);
  };

  const handleResetFilters = () => {
    setFilterTab("all");
    setSearchTerm("");
    setPage(1);
    updateUrl(1, "all", "");
  };

  return (
    <main className="space-y-6">
      <OrderAddModal isEditing={false} ref={orderAddRef} />

      {/* Top Header & Actions Section */}
      <section>
        <DashBread title="Orders" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2.5">
              <LuShoppingBag className="text-primary" /> Orders
            </h1>
            <p className="text-sm opacity-60 mt-1">
              Search, monitor, and manage client orders, services, and payments.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://merchant.eps.com.bd/paymentLink/Create/empty"
              target="_blank"
              rel="noreferrer"
            >
              <button className="btn btn-success shadow-xs">
                Generate Payment
              </button>
            </a>
            <button
              className="btn btn-primary btn-nexoro-primary shadow-xs"
              onClick={() => orderAddRef.current.showModal()}
            >
              <LuPlus /> Add Order
            </button>
          </div>
        </div>
      </section>

      {/* Filter and Debounced Search Section */}
      <section>
        <OrderNav
          filterTab={filterTab}
          setFilterTab={handleTabChange}
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          statusCounts={orders?.statusCounts}
          totalFiltered={orders?.pagination?.totalOrders}
        />
      </section>

      {/* Orders Table & Conditional Pagination (> 10 orders) */}
      <section>
        <OrderTable
          orders={orders}
          isLoading={isLoading}
          isError={isError}
          page={page}
          setPage={handlePageChange}
          filterTab={filterTab}
          searchTerm={searchTerm}
          onResetFilters={handleResetFilters}
        />
      </section>
    </main>
  );
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="p-12 flex flex-col items-center justify-center gap-3">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm opacity-60">Loading orders dashboard...</p>
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
};

export default Page;
