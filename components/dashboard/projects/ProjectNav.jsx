"use client";

import { useEffect, useState } from "react";
import {
  LuCircleCheck,
  LuClock,
  LuLayoutGrid,
  LuSearch,
  LuUserCheck,
  LuX,
} from "react-icons/lu";

const ProjectNav = ({
  allProjects = [],
  activeProjects = [],
  completedProjects = [],
  filterTab = "all",
  setFilterTab,
  isMemberOrHasAssigned = false,
  myAssignedProjects = [],
  searchTerm = "",
  setSearchTerm,
  counts = {},
}) => {
  const [searchInput, setSearchInput] = useState(searchTerm);

  // Debounce search input to prevent excessive API requests
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchTerm) {
        setSearchTerm(searchInput);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput, searchTerm, setSearchTerm]);

  // Synchronize when searchTerm changes externally
  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const allCount = counts?.all ?? allProjects.length;
  const activeCount = counts?.active ?? activeProjects.length;
  const completedCount = counts?.completed ?? completedProjects.length;
  const myCount = counts?.my ?? myAssignedProjects.length;

  const tabs = [
    {
      key: "all",
      label: "All Projects",
      icon: <LuLayoutGrid className="size-4" />,
      count: allCount,
    },
    {
      key: "active",
      label: "Active Projects",
      icon: <LuClock className="size-4" />,
      count: activeCount,
      badgeColor: "badge-warning",
    },
    {
      key: "completed",
      label: "Completed Projects",
      icon: <LuCircleCheck className="size-4" />,
      count: completedCount,
      badgeColor: "badge-success",
    },
    ...(isMemberOrHasAssigned
      ? [
          {
            key: "my",
            label: "Assigned to Me",
            icon: <LuUserCheck className="size-4" />,
            count: myCount,
            badgeColor: "badge-primary",
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-base-100 p-3 rounded-box border border-base-200 shadow-xs">
      {/* Tab buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = filterTab === tab.key;
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

      {/* Search Input */}
      <div className="w-full lg:w-80">
        <label className="input input-sm sm:input-md w-full flex items-center gap-2 bg-base-200/50 focus-within:bg-base-100 border border-base-300 focus-within:border-primary transition-all">
          <LuSearch className="opacity-50" />
          <input
            type="text"
            className="grow text-sm placeholder:text-base-content/40 focus:outline-none"
            placeholder="Search projects, client, assignee..."
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

export default ProjectNav;
