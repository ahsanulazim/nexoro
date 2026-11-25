"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  addQueryNote,
  batchUpdateQueries,
  deleteQuery,
  deleteQueryNote,
  fetchQueries,
  toggleStarQuery,
  updateQueryStatus,
} from "@/api/fetchQueries";
import DashBread from "@/components/dashboard/DashBread";
import QueryStats from "@/components/dashboard/queries/QueryStats";
import QueryCard from "@/components/dashboard/queries/QueryCard";
import QueryTable from "@/components/dashboard/queries/QueryTable";
import QueryDetailModal from "@/components/dashboard/queries/QueryDetailModal";
import QueryDeleteModal from "@/components/dashboard/queries/QueryDeleteModal";
import {
  LuArrowUpDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
  LuCircleCheck,
  LuFilter,
  LuLayoutGrid,
  LuList,
  LuMailQuestion,
  LuRotateCcw,
  LuSearch,
  LuSearchX,
  LuTrash2,
  LuX,
} from "react-icons/lu";

export default function QueriesPage() {
  const queryClient = useQueryClient();

  // Search state with debounce
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Filters & display state
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection state for batch actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [activeQuery, setActiveQuery] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    query: null,
    isBatch: false,
  });

  // Debounce search effect (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Build query parameters
  const queryParams = {
    page: currentPage,
    limit: pageSize,
    sortBy,
  };
  if (debouncedSearch.trim()) {
    queryParams.search = debouncedSearch.trim();
  }
  if (statusFilter !== "all") {
    queryParams.status = statusFilter;
  }

  // TanStack Query for fetching queries
  const {
    data: queryResult,
    isLoading,
    isFetching,
    isError,
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["contact-queries", queryParams],
    queryFn: ({ signal }) => fetchQueries(queryParams, { signal }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30, // 30s cache
  });

  const queries = queryResult?.data || [];
  const pagination = queryResult?.pagination || {
    total: 0,
    page: 1,
    totalPages: 1,
  };
  const counts = queryResult?.counts || {
    all: 0,
    unread: 0,
    read: 0,
    contacted: 0,
    resolved: 0,
    starred: 0,
  };

  const totalPages = pagination.totalPages || 1;
  const totalItems = pagination.total || 0;

  // Single Status Update Mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateQueryStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contact-queries"] });
      if (activeQuery && activeQuery._id === variables.id) {
        setActiveQuery((prev) => ({
          ...prev,
          status: variables.status,
          read: variables.status !== "unread",
        }));
      }
      toast.success(`Query marked as ${variables.status}`);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update status");
    },
  });

  // Star Toggle Mutation
  const starMutation = useMutation({
    mutationFn: (id) => toggleStarQuery(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["contact-queries"] });
      if (activeQuery && activeQuery._id === id) {
        setActiveQuery((prev) => ({
          ...prev,
          isStarred: !prev.isStarred,
        }));
      }
      toast.success(data?.isStarred ? "Query starred" : "Query unstarred");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to toggle star");
    },
  });

  // Add Note Mutation
  const addNoteMutation = useMutation({
    mutationFn: ({ id, text }) => addQueryNote(id, text),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contact-queries"] });
      if (activeQuery && activeQuery._id === variables.id) {
        setActiveQuery((prev) => ({
          ...prev,
          notes: data.notes || [...(prev.notes || []), data.note],
        }));
      }
      toast.success("Internal note added");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to add note");
    },
  });

  // Delete Note Mutation
  const deleteNoteMutation = useMutation({
    mutationFn: ({ id, noteId }) => deleteQueryNote(id, noteId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contact-queries"] });
      if (activeQuery && activeQuery._id === variables.id) {
        setActiveQuery((prev) => ({
          ...prev,
          notes: (prev.notes || []).filter((n) => n.id !== variables.noteId),
        }));
      }
      toast.info("Note deleted");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete note");
    },
  });

  // Delete Query Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteQuery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-queries"] });
      setDeleteModalState({ isOpen: false, query: null, isBatch: false });
      if (activeQuery) {
        setIsDetailModalOpen(false);
        setActiveQuery(null);
      }
      toast.success("Query deleted successfully");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete query");
    },
  });

  // Batch Operations Mutation
  const batchMutation = useMutation({
    mutationFn: ({ ids, action }) => batchUpdateQueries(ids, action),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["contact-queries"] });
      setSelectedIds([]);
      setDeleteModalState({ isOpen: false, query: null, isBatch: false });
      toast.success(data?.message || "Batch action completed");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to perform batch operation");
    },
  });

  // Handlers
  const handleOpenDetail = (query) => {
    setActiveQuery(query);
    setIsDetailModalOpen(true);
    // If opening an unread query, auto mark as read
    if (query.status === "unread") {
      statusMutation.mutate({ id: query._id, status: "read" });
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === queries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(queries.map((q) => q._id));
    }
  };

  const handleBatchAction = (action) => {
    if (selectedIds.length === 0) return;
    if (action === "delete") {
      setDeleteModalState({
        isOpen: true,
        query: null,
        isBatch: true,
      });
      return;
    }
    batchMutation.mutate({ ids: selectedIds, action });
  };

  const confirmDelete = () => {
    if (deleteModalState.isBatch) {
      batchMutation.mutate({ ids: selectedIds, action: "delete" });
    } else if (deleteModalState.query) {
      deleteMutation.mutate(deleteModalState.query._id);
    }
  };

  // Prefetch adjacent page on hover
  const prefetchPage = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) {
        queryClient.prefetchQuery({
          queryKey: [
            "contact-queries",
            { ...queryParams, page },
          ],
          queryFn: ({ signal }) =>
            fetchQueries({ ...queryParams, page }, { signal }),
          staleTime: 1000 * 30,
        });
      }
    },
    [queryClient, queryParams, totalPages]
  );

  // Generate numbered pagination buttons
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  const startIndex = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(currentPage * pageSize, totalItems);

  return (
    <>
      <DashBread
        title="Contact Queries"
        path={["Dashboard", "Operations", "Contact Queries"]}
      />

      <main className="space-y-6 pb-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-base-content flex items-center gap-2.5">
              <LuMailQuestion className="size-7 text-primary" />
              Website Contact Queries
            </h1>
            <p className="text-sm text-base-content/60 mt-1">
              Manage incoming leads, messages, and project inquiries submitted from the website homepage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="btn btn-sm btn-ghost border border-base-300 rounded-xl gap-2"
              title="Refresh queries"
            >
              <LuRotateCcw
                className={`size-4 ${isFetching ? "animate-spin text-primary" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <QueryStats
          counts={counts}
          activeFilter={statusFilter}
          onSelectFilter={(newFilter) => {
            setStatusFilter(newFilter);
            setCurrentPage(1);
          }}
        />

        {/* Control Toolbar: Search, Filters, View Modes */}
        <div className="bg-base-100 rounded-3xl p-4 border border-base-300 shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by client name, email, phone, company, or message..."
                className="input input-sm input-bordered w-full pl-10 pr-9 rounded-xl bg-base-200/40 focus:bg-base-100 text-xs"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                >
                  <LuX className="size-3.5" />
                </button>
              )}
            </div>

            {/* Filter Controls Group */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <LuFilter className="size-3.5 text-base-content/50" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="select select-sm select-bordered rounded-xl bg-base-100 text-xs"
                >
                  <option value="all">All Statuses ({counts.all})</option>
                  <option value="unread">Unread ({counts.unread})</option>
                  <option value="read">Read ({counts.read})</option>
                  <option value="contacted">Contacted ({counts.contacted})</option>
                  <option value="resolved">Resolved ({counts.resolved})</option>
                  <option value="starred">Starred ({counts.starred})</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-1.5">
                <LuArrowUpDown className="size-3.5 text-base-content/50" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="select select-sm select-bordered rounded-xl bg-base-100 text-xs"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {/* View Mode Toggle (Grid vs Table) */}
              <div className="join rounded-xl border border-base-300 overflow-hidden bg-base-100">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`btn btn-xs join-item px-2.5 ${
                    viewMode === "table"
                      ? "btn-primary"
                      : "btn-ghost text-base-content/60"
                  }`}
                  title="Table view"
                >
                  <LuList className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`btn btn-xs join-item px-2.5 ${
                    viewMode === "grid"
                      ? "btn-primary"
                      : "btn-ghost text-base-content/60"
                  }`}
                  title="Card Grid view"
                >
                  <LuLayoutGrid className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Selection Bar (Shows up when items are checked) */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-primary/10 border border-primary/20 text-xs animate-in fade-in duration-150">
              <span className="font-semibold text-primary pl-2">
                {selectedIds.length} {selectedIds.length === 1 ? "query" : "queries"} selected
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBatchAction("mark_read")}
                  className="btn btn-xs btn-outline rounded-lg bg-base-100"
                >
                  <LuCircleCheck className="size-3" /> Mark Read
                </button>
                <button
                  type="button"
                  onClick={() => handleBatchAction("mark_resolved")}
                  className="btn btn-xs btn-outline rounded-lg bg-base-100 text-success"
                >
                  <LuCircleCheck className="size-3 text-success" /> Mark Resolved
                </button>
                <button
                  type="button"
                  onClick={() => handleBatchAction("delete")}
                  className="btn btn-xs btn-error text-white rounded-lg"
                >
                  <LuTrash2 className="size-3" /> Delete
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="btn btn-xs btn-ghost rounded-lg text-base-content/60"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Query Results / Empty / Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-3xl bg-base-200/60 animate-pulse border border-base-300"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 bg-base-100 rounded-3xl border border-base-300 p-8">
            <LuSearchX className="size-12 mx-auto text-error opacity-60 mb-3" />
            <h3 className="font-bold text-lg text-base-content">
              Failed to load queries
            </h3>
            <p className="text-xs text-base-content/60 mt-1 max-w-sm mx-auto">
              An error occurred while fetching queries. Please verify your connection or try again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="btn btn-sm btn-primary rounded-xl mt-4"
            >
              Try Again
            </button>
          </div>
        ) : queries.length === 0 ? (
          <div className="text-center py-16 bg-base-100 rounded-3xl border border-base-300 p-8">
            <LuMailQuestion className="size-12 mx-auto text-base-content/30 mb-3" />
            <h3 className="font-bold text-lg text-base-content">
              {debouncedSearch || statusFilter !== "all"
                ? "No matching queries found"
                : "No queries submitted yet"}
            </h3>
            <p className="text-xs text-base-content/60 mt-1 max-w-sm mx-auto">
              {debouncedSearch || statusFilter !== "all"
                ? "Try clearing your search keyword or switching the status filter."
                : "When prospective clients fill out the contact form on your website homepage, their messages will appear here in real time."}
            </p>
            {(debouncedSearch || statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
                className="btn btn-sm btn-outline rounded-xl mt-4 text-xs"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : viewMode === "table" ? (
          <QueryTable
            queries={queries}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onToggleSelect={handleToggleSelect}
            onView={handleOpenDetail}
            onUpdateStatus={(id, status) => statusMutation.mutate({ id, status })}
            onToggleStar={(id) => starMutation.mutate(id)}
            onDelete={(query) =>
              setDeleteModalState({ isOpen: true, query, isBatch: false })
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {queries.map((query) => (
              <QueryCard
                key={query._id}
                query={query}
                isSelected={selectedIds.includes(query._id)}
                onToggleSelect={handleToggleSelect}
                onView={handleOpenDetail}
                onUpdateStatus={(id, status) => statusMutation.mutate({ id, status })}
                onToggleStar={(id) => starMutation.mutate(id)}
                onDelete={(q) =>
                  setDeleteModalState({ isOpen: true, query: q, isBatch: false })
                }
              />
            ))}
          </div>
        )}

        {/* Pagination Section */}
        {totalItems > 0 && (
          <section className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-base-200">
            {/* Left: Summary and Page Size */}
            <div className="flex items-center gap-3 text-xs text-base-content/70">
              <span>
                Showing{" "}
                <span className="font-semibold text-base-content">
                  {startIndex}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-base-content">
                  {endIndex}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-base-content">
                  {totalItems}
                </span>{" "}
                queries
              </span>

              <div className="flex items-center gap-1.5 border-l border-base-200 pl-3">
                <span className="text-[11px] text-base-content/60">Per page:</span>
                <select
                  className="select select-xs select-bordered rounded-lg bg-base-100"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {isFetching && !isLoading && (
                <span className="flex items-center gap-1 text-[11px] text-primary font-medium animate-pulse ml-1">
                  <span className="loading loading-spinner loading-xs" />
                  Updating...
                </span>
              )}
            </div>

            {/* Right: Join Numbered Page Navigation */}
            {totalPages > 1 && (
              <div className="join overflow-hidden">
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1 || isPlaceholderData}
                  className="btn btn-sm join-item disabled:opacity-40"
                  title="First page"
                >
                  <LuChevronsLeft className="size-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || isPlaceholderData}
                  className="btn btn-sm join-item disabled:opacity-40"
                  title="Previous page"
                >
                  <LuChevronLeft className="size-3.5" />
                </button>

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
                  )
                )}

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || isPlaceholderData}
                  className="btn btn-sm join-item disabled:opacity-40"
                  title="Next page"
                >
                  <LuChevronRight className="size-3.5" />
                </button>

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

      {/* Detail Modal */}
      <QueryDetailModal
        query={activeQuery}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setActiveQuery(null);
        }}
        onUpdateStatus={(id, status) => statusMutation.mutate({ id, status })}
        onToggleStar={(id) => starMutation.mutate(id)}
        onAddNote={(id, text) => addNoteMutation.mutate({ id, text })}
        onDeleteNote={(id, noteId) => deleteNoteMutation.mutate({ id, noteId })}
        isUpdating={statusMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <QueryDeleteModal
        isOpen={deleteModalState.isOpen}
        onClose={() =>
          setDeleteModalState({ isOpen: false, query: null, isBatch: false })
        }
        onConfirm={confirmDelete}
        query={deleteModalState.query}
        batchCount={selectedIds.length}
        isDeleting={deleteMutation.isPending || batchMutation.isPending}
      />
    </>
  );
}
