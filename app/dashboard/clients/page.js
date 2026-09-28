"use client";

import ClientCard from "@/components/dashboard/clients/ClientCard";
import ClientForm from "@/components/dashboard/clients/ClientForm";
import ClientStats from "@/components/dashboard/clients/ClientStats";
import ClientTable from "@/components/dashboard/clients/ClientTable";
import DashBread from "@/components/dashboard/DashBread";
import ClientSkeleton from "@/components/dashboard/skeleton/ClientSkeleton";
import { fetchClients } from "@/api/fetchClients";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  LuArrowUpDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
  LuDownload,
  LuFilter,
  LuLayoutGrid,
  LuList,
  LuPlus,
  LuRotateCcw,
  LuSearch,
  LuSearchX,
  LuUsers,
  LuX,
} from "react-icons/lu";

const Clients = () => {
  const addClientForm = useRef(null);
  const queryClient = useQueryClient();

  // Search state (with debounce)
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Server-side filters & sorting state
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  // Server-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounce search effect (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch paginated, searched, and sorted clients directly from the backend
  const {
    data: clientResponse,
    isLoading: clientDataLoading,
    isError: clientDataError,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: [
      "clients",
      currentPage,
      pageSize,
      debouncedSearch,
      selectedCountry,
      sortBy,
    ],
    queryFn: ({ signal }) =>
      fetchClients(
        {
          page: currentPage,
          limit: pageSize,
          search: debouncedSearch,
          country: selectedCountry,
          sort: sortBy,
        },
        { signal },
      ),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2, // 2 minutes: cache is fresh, avoids refetching recent pages
    gcTime: 1000 * 60 * 10, // 10 minutes: keep unused data in cache
  });

  const clients = clientResponse?.clients || [];
  const totalItems = clientResponse?.pagination?.total ?? 0;
  const totalPages = clientResponse?.pagination?.totalPages ?? 1;
  const statsData = clientResponse?.stats || null;
  const availableCountries = clientResponse?.countries || [];

  const startIndex = totalItems > 0 ? (currentPage - 1) * pageSize : 0;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  // Check if search debounce or query is active
  const isSearchPending =
    searchInput !== debouncedSearch || (isFetching && !clientDataLoading);

  // Check if any filter is active
  const isFiltered = Boolean(
    debouncedSearch.trim() || selectedCountry !== "all",
  );

  // Reset all filters
  const handleResetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setSelectedCountry("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Helper function to prefetch any page on demand or hover
  const prefetchPage = useCallback(
    (targetPage) => {
      if (
        targetPage < 1 ||
        targetPage > totalPages ||
        targetPage === currentPage
      ) {
        return;
      }

      queryClient.prefetchQuery({
        queryKey: [
          "clients",
          targetPage,
          pageSize,
          debouncedSearch,
          selectedCountry,
          sortBy,
        ],
        queryFn: ({ signal }) =>
          fetchClients(
            {
              page: targetPage,
              limit: pageSize,
              search: debouncedSearch,
              country: selectedCountry,
              sort: sortBy,
            },
            { signal },
          ),
        staleTime: 1000 * 60 * 2,
      });
    },
    [
      totalPages,
      currentPage,
      queryClient,
      pageSize,
      debouncedSearch,
      selectedCountry,
      sortBy,
    ],
  );

  // TanStack Query Optimization: Automatically prefetch next and previous pages in the background
  useEffect(() => {
    if (!isPlaceholderData && totalPages > 1) {
      if (currentPage < totalPages) {
        prefetchPage(currentPage + 1);
      }
      if (currentPage > 1) {
        prefetchPage(currentPage - 1);
      }
    }
  }, [currentPage, totalPages, isPlaceholderData, prefetchPage]);

  // Generate pagination page numbers with smart sliding window & ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage >= totalPages - 3) {
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
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  // Export matching dataset to CSV (queries backend for all matching rows)
  const handleExportCSV = async () => {
    try {
      const data = await fetchClients({
        search: debouncedSearch,
        country: selectedCountry,
        sort: sortBy,
        all: "true",
      });

      const listToExport = Array.isArray(data)
        ? data
        : data?.clients || clients;

      if (!listToExport.length) return;

      const headers = [
        "Name",
        "Role",
        "Company",
        "Country",
        "Email",
        "Phone",
        "Date Added",
      ];
      const rows = listToExport.map((c) => [
        `"${(c.name || "").replace(/"/g, '""')}"`,
        `"${(c.role || "").replace(/"/g, '""')}"`,
        `"${(c.company || "").replace(/"/g, '""')}"`,
        `"${(c.country || "").replace(/"/g, '""')}"`,
        `"${(c.email || "").replace(/"/g, '""')}"`,
        `"${(c.phone || "").replace(/"/g, '""')}"`,
        `"${c.joined || c.createdAt || ""}"`,
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `clients_export_${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  return (
    <>
      <ClientForm ref={addClientForm} />

      <main className="flex flex-col gap-6 pb-12">
        {/* Top Header & Breadcrumb */}
        <section>
          <DashBread title="Clients" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3">
                <LuUsers className="text-primary size-8" /> Clients Management
              </h1>
              <p className="text-sm opacity-60 mt-1">
                Oversee client profiles, partnerships, communications, and
                accounts.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {totalItems > 0 && (
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="btn btn-outline border-base-300 hover:border-primary gap-2"
                  title="Export matching clients to CSV"
                >
                  <LuDownload className="size-4" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              )}
              <button
                className="btn btn-primary btn-nexoro-primary gap-2"
                onClick={() => addClientForm.current?.showModal()}
              >
                <LuPlus className="size-5" /> Add Client
              </button>
            </div>
          </div>
        </section>

        {/* Quick Stats Overview */}
        <section>
          <ClientStats
            clients={clients}
            filteredCount={totalItems}
            isFiltered={isFiltered}
            statsData={statsData}
          />
        </section>

        {/* Search, Filter, Sort & View Controls */}
        <section className="bg-base-100 p-4 rounded-2xl border border-base-200/80 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Left: Search input with real-time TanStack fetching indicator */}
          <div className="relative flex-1 max-w-md">
            <label className="input input-md flex items-center gap-2 w-full border border-base-300 focus-within:border-primary rounded-xl">
              {isSearchPending ? (
                <span className="loading loading-spinner loading-xs text-primary shrink-0" />
              ) : (
                <LuSearch className="size-4 opacity-50 shrink-0" />
              )}
              <input
                type="text"
                placeholder="Search by name, company, email, role, or country..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="grow text-sm bg-transparent outline-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setDebouncedSearch("");
                    setCurrentPage(1);
                  }}
                  className="btn btn-ghost btn-circle btn-xs text-base-content/50 hover:text-base-content"
                  title="Clear search"
                >
                  <LuX className="size-3.5" />
                </button>
              )}
            </label>
          </div>

          {/* Right: Country filter, Sort dropdown, and View mode toggle */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Country Filter */}
            {availableCountries.length > 0 && (
              <div className="flex items-center gap-1.5">
                <LuFilter className="size-4 opacity-50 text-base-content hidden sm:inline" />
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="select select-sm select-bordered rounded-xl text-xs bg-base-100 font-medium"
                >
                  <option value="all">All Countries</option>
                  {availableCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort Dropdown */}
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                role="button"
                className="btn btn-sm btn-outline border-base-300 rounded-xl gap-1.5 text-xs font-medium"
              >
                <LuArrowUpDown className="size-3.5 opacity-60" />
                <span className="truncate">
                  {sortBy === "newest" && "Newest First"}
                  {sortBy === "oldest" && "Oldest First"}
                  {sortBy === "name_asc" && "Name (A - Z)"}
                  {sortBy === "name_desc" && "Name (Z - A)"}
                  {sortBy === "company_asc" && "Company (A - Z)"}
                </span>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-30 menu p-2 shadow-lg bg-base-100 rounded-2xl w-48 border border-base-200 text-xs mt-1 space-y-1"
              >
                <li>
                  <button
                    type="button"
                    className={sortBy === "newest" ? "active font-medium" : ""}
                    onClick={() => {
                      setSortBy("newest");
                      setCurrentPage(1);
                    }}
                  >
                    Newest First
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={sortBy === "oldest" ? "active font-medium" : ""}
                    onClick={() => {
                      setSortBy("oldest");
                      setCurrentPage(1);
                    }}
                  >
                    Oldest First
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={
                      sortBy === "name_asc" ? "active font-medium" : ""
                    }
                    onClick={() => {
                      setSortBy("name_asc");
                      setCurrentPage(1);
                    }}
                  >
                    Name (A - Z)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={
                      sortBy === "name_desc" ? "active font-medium" : ""
                    }
                    onClick={() => {
                      setSortBy("name_desc");
                      setCurrentPage(1);
                    }}
                  >
                    Name (Z - A)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={
                      sortBy === "company_asc" ? "active font-medium" : ""
                    }
                    onClick={() => {
                      setSortBy("company_asc");
                      setCurrentPage(1);
                    }}
                  >
                    Company (A - Z)
                  </button>
                </li>
              </ul>
            </div>

            {/* View Mode Toggle (Grid vs Table) */}
            <div className="join border border-base-300 rounded-xl overflow-hidden p-0.5 bg-base-200/30">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`btn btn-xs join-item rounded-lg border-0 gap-1 ${
                  viewMode === "grid"
                    ? "btn-primary shadow-xs"
                    : "btn-ghost opacity-60 hover:opacity-100"
                }`}
                title="Grid View"
              >
                <LuLayoutGrid className="size-3.5" />
                <span className="hidden md:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`btn btn-xs join-item rounded-lg border-0 gap-1 ${
                  viewMode === "table"
                    ? "btn-primary shadow-xs"
                    : "btn-ghost opacity-60 hover:opacity-100"
                }`}
                title="Table View"
              >
                <LuList className="size-3.5" />
                <span className="hidden md:inline">Table</span>
              </button>
            </div>

            {/* Reset Filters button if filtered */}
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-sm btn-ghost text-error gap-1 text-xs"
                title="Reset all filters"
              >
                <LuRotateCcw className="size-3.5" /> Reset
              </button>
            )}
          </div>
        </section>

        {/* Content Section: Loading, Error, Empty, or List */}
        <section>
          {/* Initial Loading Skeletons */}
          {clientDataLoading && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(340px),1fr))] gap-5">
              {Array.from({ length: pageSize || 8 }).map((_, i) => (
                <ClientSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error Banner */}
          {clientDataError && (
            <div className="alert alert-error rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold">Failed to load clients</h3>
                <p className="text-xs opacity-80">
                  Please check your connection and try again.
                </p>
              </div>
              <button
                type="button"
                onClick={() => refetch()}
                className="btn btn-sm btn-neutral"
              >
                Retry
              </button>
            </div>
          )}

          {/* No data matching search/filters */}
          {!clientDataLoading && !clientDataError && clients.length === 0 && (
            <div className="bg-base-100 border border-base-200/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="size-16 rounded-2xl bg-base-200 text-base-content/40 flex items-center justify-center mb-1">
                <LuSearchX className="size-8" />
              </div>
              <h3 className="text-lg font-bold text-base-content">
                {isFiltered
                  ? "No matching clients found"
                  : "No clients added yet"}
              </h3>
              <p className="text-xs text-base-content/60 max-w-md">
                {isFiltered
                  ? `We couldn't find any clients matching your criteria. Try adjusting your search query or removing active filters.`
                  : `Get started by adding your first client to manage and track partnerships.`}
              </p>
              {isFiltered ? (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn btn-sm btn-primary btn-soft rounded-xl gap-2 mt-2"
                >
                  <LuRotateCcw className="size-3.5" /> Clear Filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => addClientForm.current?.showModal()}
                  className="btn btn-sm btn-primary rounded-xl gap-2 mt-2"
                >
                  <LuPlus className="size-4" /> Add Your First Client
                </button>
              )}
            </div>
          )}

          {/* Client Display: Grid or Table View with smooth transition during background pagination fetch */}
          {!clientDataLoading && !clientDataError && clients.length > 0 && (
            <div
              className={`transition-opacity duration-200 ${
                isPlaceholderData
                  ? "opacity-60 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              {viewMode === "grid" ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(340px),1fr))] gap-5">
                  {clients.map((client, idx) => (
                    <ClientCard
                      key={client._id || client.email || `client-${idx}`}
                      client={client}
                    />
                  ))}
                </div>
              ) : (
                <ClientTable clients={clients} />
              )}
            </div>
          )}
        </section>

        {/* Pagination & Summary Bar */}
        {!clientDataLoading && !clientDataError && totalItems > 0 && (
          <section className="bg-base-100 p-4 rounded-2xl border border-base-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-base-content/70">
            {/* Left: Summary and Page Size */}
            <div className="flex flex-wrap items-center gap-3">
              <span>
                Showing{" "}
                <span className="font-semibold text-base-content">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-base-content">
                  {endIndex}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-base-content">
                  {totalItems}
                </span>{" "}
                clients
              </span>

              <div className="flex items-center gap-1.5 border-l border-base-200 pl-3">
                <span className="text-[11px] text-base-content/60">
                  Per page:
                </span>
                <select
                  className="select select-xs select-bordered rounded-lg bg-base-100"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={18}>18</option>
                  <option value={36}>36</option>
                </select>
              </div>

              {/* Background fetching indicator during pagination */}
              {isFetching && !clientDataLoading && (
                <span className="flex items-center gap-1 text-[11px] text-primary font-medium animate-pulse ml-1">
                  <span className="loading loading-spinner loading-xs" />
                  Updating...
                </span>
              )}
            </div>

            {/* Right: Unified DaisyUI join Page Navigation */}
            {totalPages > 1 && (
              <div className="join overflow-hidden">
                {/* First Page */}
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1 || isPlaceholderData}
                  className="btn btn-sm join-item disabled:opacity-40"
                  title="First page"
                >
                  <LuChevronsLeft className="size-3.5" />
                </button>

                {/* Prev Page */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1 || isPlaceholderData}
                  className="btn btn-sm join-item disabled:opacity-40"
                  title="Previous page"
                >
                  <LuChevronLeft className="size-3.5" />
                </button>

                {/* Numbered Page Buttons with hover prefetching */}
                {getPageNumbers().map((num, idx) =>
                  num === "..." ? (
                    <button
                      key={`ellipsis-${idx}`}
                      type="button"
                      disabled
                      className="btn btn-sm join-item btn-disabled select-none px-2"
                    >
                      ...
                    </button>
                  ) : (
                    <button
                      key={`page-${num}`}
                      type="button"
                      onClick={() => setCurrentPage(num)}
                      onMouseEnter={() => prefetchPage(num)}
                      onFocus={() => prefetchPage(num)}
                      className={`btn btn-sm join-item ${
                        currentPage === num
                          ? "btn-primary font-bold shadow-xs"
                          : "btn-ghost"
                      }`}
                    >
                      {num}
                    </button>
                  ),
                )}

                {/* Next Page */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || isPlaceholderData}
                  className="btn btn-sm join-item disabled:opacity-40"
                  title="Next page"
                >
                  <LuChevronRight className="size-3.5" />
                </button>

                {/* Last Page */}
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || isPlaceholderData}
                  className="btn btn-sm join-item disabled:opacity-40"
                  title="Last page"
                >
                  <LuChevronsRight className="size-3.5" />
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </>
  );
};

export default Clients;
