"use client";

import Modal from "@/components/modal/Modal";
import { useMemo, useRef, useState } from "react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuRotateCcw,
  LuSearchX,
  LuUsers,
} from "react-icons/lu";
import UserRow from "./UserRow";

const UserTable = ({
  users = [],
  isLoading = false,
  isError = false,
  searchTerm = "",
  filterRole = "all",
  onResetFilters,
  currentLoggedInEmail,
  currentPage = 1,
  setCurrentPage,
  pageSize = 10,
  setPageSize,
}) => {
  const [removeEmail, setRemoveEmail] = useState(null);
  const deleteModalRef = useRef(null);

  // Fallback internal pagination if not controlled
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(10);

  const activePage = setCurrentPage ? currentPage : internalPage;
  const setActivePage = setCurrentPage || setInternalPage;
  const activePageSize = setPageSize ? pageSize : internalPageSize;
  const setActivePageSize = setPageSize || setInternalPageSize;

  // Trigger delete modal
  const handleOpenDeleteModal = (email) => {
    setRemoveEmail(email);
    deleteModalRef.current?.showModal();
  };

  // Calculate paginated slice
  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / activePageSize) || 1;
  const startIndex = (activePage - 1) * activePageSize;
  const endIndex = Math.min(startIndex + activePageSize, totalUsers);
  const paginatedUsers = users.slice(startIndex, endIndex);

  // Pagination numbers generator
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (activePage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }
    if (activePage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      1,
      "...",
      activePage - 1,
      activePage,
      activePage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <>
      <Modal ref={deleteModalRef} remove={removeEmail} />

      <div className="rounded-box border border-base-200/80 bg-base-100 shadow-xs overflow-hidden">
        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 pl-5">User</th>
                <th className="py-3.5">Email</th>
                <th className="py-3.5">Role</th>
                <th className="py-3.5">Joined Date</th>
                <th className="py-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                // Skeletons
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-base-200/50">
                    <td className="pl-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="skeleton size-10 rounded-xl shrink-0"></div>
                        <div className="space-y-1.5">
                          <div className="skeleton h-4 w-32"></div>
                          <div className="skeleton h-3 w-20"></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="skeleton h-4 w-44"></div>
                    </td>
                    <td>
                      <div className="skeleton h-6 w-20 rounded-lg"></div>
                    </td>
                    <td>
                      <div className="skeleton h-4 w-28"></div>
                    </td>
                    <td className="pr-5 text-right">
                      <div className="flex justify-end gap-2">
                        <div className="skeleton h-8 w-24 rounded-lg"></div>
                        <div className="skeleton h-8 w-20 rounded-lg"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                      <div className="size-12 rounded-2xl bg-error/10 text-error flex items-center justify-center">
                        <LuUsers className="size-6" />
                      </div>
                      <h3 className="font-semibold text-base text-base-content">
                        Failed to load users
                      </h3>
                      <p className="text-xs text-base-content/60">
                        There was an issue fetching users data. Please refresh
                        or check your network.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : totalUsers === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto">
                      <div className="size-14 rounded-2xl bg-base-200 text-base-content/40 flex items-center justify-center">
                        <LuSearchX className="size-7" />
                      </div>
                      <h3 className="font-semibold text-base text-base-content">
                        No users found
                      </h3>
                      <p className="text-xs text-base-content/60">
                        {searchTerm || filterRole !== "all"
                          ? `No users match "${searchTerm}" in role "${filterRole}". Try adjusting your filters.`
                          : "There are currently no users in the database."}
                      </p>
                      {(searchTerm || filterRole !== "all") && (
                        <button
                          type="button"
                          onClick={onResetFilters}
                          className="btn btn-sm btn-primary btn-soft rounded-xl gap-1.5 mt-1"
                        >
                          <LuRotateCcw className="size-3.5" /> Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <UserRow
                    key={user._id || user.uid || user.email}
                    client={user}
                    onRemove={handleOpenDeleteModal}
                    currentLoggedInEmail={currentLoggedInEmail}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination Controls */}
        {!isLoading && totalUsers > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-base-200 bg-base-200/20 text-xs text-base-content/70">
            {/* Left: Summary and Page Size */}
            <div className="flex items-center gap-3">
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
                  {totalUsers}
                </span>{" "}
                users
              </span>

              <div className="flex items-center gap-1.5 ml-2 border-l border-base-300 pl-3">
                <span className="text-[11px] text-base-content/60">
                  Per page:
                </span>
                <select
                  className="select select-sm select-bordered bg-base-100"
                  value={activePageSize}
                  onChange={(e) => {
                    setActivePageSize(Number(e.target.value));
                    setActivePage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Right: Page Navigation */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
                disabled={activePage === 1}
                className="btn btn-xs btn-ghost border border-base-200 rounded-lg disabled:opacity-40"
                title="Previous page"
              >
                <LuChevronLeft />
                <span className="hidden xs:inline">Prev</span>
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((num, idx) =>
                  num === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-base-content/40"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={`page-${num}`}
                      type="button"
                      onClick={() => setActivePage(Number(num))}
                      className={`btn btn-xs btn-square ${
                        activePage === num ? "btn-nexoro-primary" : "btn-ghost"
                      }`}
                    >
                      {num}
                    </button>
                  ),
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setActivePage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={activePage === totalPages}
                className="btn btn-xs btn-ghost"
                title="Next page"
              >
                <span className="hidden xs:inline">Next</span>
                <LuChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserTable;
