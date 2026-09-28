"use client";

import { useEffect, useState } from "react";
import {
  LuArrowUpDown,
  LuLayoutGrid,
  LuSearch,
  LuShieldCheck,
  LuUserCheck,
  LuUsers,
  LuX,
} from "react-icons/lu";

const UserNav = ({
  filterRole = "all",
  setFilterRole,
  searchTerm = "",
  setSearchTerm,
  sortBy = "date_desc",
  setSortBy,
  counts = { all: 0, customer: 0, member: 0, admin: 0 },
}) => {
  const [searchInput, setSearchInput] = useState(searchTerm);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchTerm) {
        setSearchTerm(searchInput);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput, searchTerm, setSearchTerm]);

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const tabs = [
    {
      key: "all",
      label: "All Users",
      icon: <LuUsers className="size-4" />,
      count: counts.all,
    },
    {
      key: "customer",
      label: "Customers",
      icon: <LuLayoutGrid className="size-4" />,
      count: counts.customer,
      badgeClass: "badge-neutral",
    },
    {
      key: "member",
      label: "Team Members",
      icon: <LuUserCheck className="size-4" />,
      count: counts.member,
      badgeClass: "badge-primary",
    },
    ...(counts.admin > 0
      ? [
          {
            key: "admin",
            label: "Admins",
            icon: <LuShieldCheck className="size-4" />,
            count: counts.admin,
            badgeClass: "badge-accent",
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-base-100 p-3 rounded-box border border-base-200/80 shadow-xs">
      {/* Role Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = filterRole.toLowerCase() === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterRole(tab.key)}
              className={`btn ${isActive ? "btn-primary" : "btn-ghost"}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`badge badge-sm font-semibold rounded-lg ${
                    isActive ? "bg-white/20 text-white border-0" : "badge-ghost"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <label className="input input-md">
            <LuSearch className="opacity-50" />
            <input
              type="text"
              placeholder="Search by name or email..."
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
                className="btn btn-ghost btn-circle btn-xs text-base-content/60 hover:text-base-content"
                title="Clear search"
              >
                <LuX className="size-3.5" />
              </button>
            )}
          </label>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="dropdown dropdown-end w-full sm:w-auto">
            <label tabIndex={0} role="button" className="btn">
              <LuArrowUpDown className="size-3.5 opacity-60" />
              <span className="truncate">
                {sortBy === "date_desc" && "Newest First"}
                {sortBy === "date_asc" && "Oldest First"}
                {sortBy === "name_asc" && "Name (A - Z)"}
                {sortBy === "name_desc" && "Name (Z - A)"}
              </span>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-30 menu p-2 shadow-lg bg-base-100 rounded-box w-48 border border-base-200 text-xs mt-1"
            >
              <li>
                <button
                  type="button"
                  className={sortBy === "date_desc" ? "active" : ""}
                  onClick={() => setSortBy("date_desc")}
                >
                  Newest First
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={sortBy === "date_asc" ? "active" : ""}
                  onClick={() => setSortBy("date_asc")}
                >
                  Oldest First
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={sortBy === "name_asc" ? "active" : ""}
                  onClick={() => setSortBy("name_asc")}
                >
                  Name (A - Z)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={sortBy === "name_desc" ? "active" : ""}
                  onClick={() => setSortBy("name_desc")}
                >
                  Name (Z - A)
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNav;
