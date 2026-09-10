"use client";

import { useEffect, useState } from "react";
import {
  LuBan,
  LuCircleCheck,
  LuClock,
  LuHourglass,
  LuLayoutGrid,
  LuSearch,
  LuX,
} from "react-icons/lu";

const OrderNav = ({
  filterTab = "all",
  setFilterTab,
  searchTerm = "",
  setSearchTerm,
  statusCounts = {},
  totalFiltered = 0,
}) => {
  const [searchInput, setSearchInput] = useState(searchTerm);

  // Debouncing for search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchTerm) {
        setSearchTerm(searchInput);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, searchTerm, setSearchTerm]);

  // Sync internal state if searchTerm changes externally
  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const tabs = [
    {
      key: "all",
      label: "All Orders",
      icon: <LuLayoutGrid className="size-4" />,
      count: statusCounts?.all ?? totalFiltered,
    },
    {
      key: "processing",
      label: "Processing",
      icon: <LuClock className="size-4" />,
      count: statusCounts?.processing ?? 0,
      badgeColor: "badge-warning",
    },
    {
      key: "completed",
      label: "Completed",
      icon: <LuCircleCheck className="size-4" />,
      count: statusCounts?.completed ?? 0,
      badgeColor: "badge-success",
    },
    {
      key: "pending",
      label: "Pending",
      icon: <LuHourglass className="size-4" />,
      count: statusCounts?.pending ?? 0,
      badgeColor: "badge-info",
    },
    {
      key: "cancelled",
      label: "Cancelled",
      icon: <LuBan className="size-4" />,
      count: statusCounts?.cancelled ?? 0,
      badgeColor: "badge-error",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-base-100 p-3 rounded-box border border-base-200 shadow-xs">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = filterTab.toLowerCase() === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterTab(tab.key)}
              className={`btn btn-sm sm:btn-md shrink-0 gap-2 transition-all ${
                isActive
                  ? "btn-primary bg-main border-main text-white shadow-xs"
                  : "btn-ghost hover:bg-base-200"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`badge badge-sm font-semibold ${
                    isActive
                      ? "badge-neutral text-white"
                      : tab.badgeColor
                        ? `${tab.badgeColor} badge-soft`
                        : "badge-neutral"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Debounced Search Bar */}
      <div className="w-full lg:w-80">
        <label className="input input-sm sm:input-md w-full flex items-center gap-2 bg-base-200/50 focus-within:bg-base-100 border border-base-300 focus-within:border-primary transition-all">
          <LuSearch className="opacity-50" />
          <input
            type="text"
            className="grow text-sm placeholder:text-base-content/40 focus:outline-none"
            placeholder="Search order ID, client, service..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setSearchTerm("");
              }}
              className="btn btn-ghost btn-circle btn-sm"
              title="Clear search"
            >
              <LuX />
            </button>
          )}
        </label>
      </div>
    </div>
  );
};

export default OrderNav;
