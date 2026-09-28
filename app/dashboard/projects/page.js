"use client";

import { getAllProjects } from "@/api/fetchProject";
import DashBread from "@/components/dashboard/DashBread";
import ProjectCard from "@/components/dashboard/projects/ProjectCard";
import ProjectNav from "@/components/dashboard/projects/ProjectNav";
import { useAuth } from "@/context/AuthProvider";
import { MyContext } from "@/context/MyProvider";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useContext, useState } from "react";
import {
  LuCircleCheck,
  LuClock,
  LuFolderKanban,
  LuPlus,
  LuRefreshCw,
  LuSparkles,
  LuUserCheck,
} from "react-icons/lu";

const ProjectsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser } = useAuth();
  const { team } = useContext(MyContext);

  // Read initial states from URL query parameters
  const initialPage = Math.max(1, Number(searchParams.get("page") || 1));
  const initialTab =
    searchParams.get("tab") || searchParams.get("status") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [page, setPage] = useState(initialPage);
  const [filterTab, setFilterTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [pageSize, setPageSize] = useState(10);

  // User details for assigned projects identification
  const userEmail = currentUser?.user?.email?.toLowerCase() || "";
  const userName = (
    currentUser?.user?.name ||
    currentUser?.user?.displayName ||
    ""
  ).toLowerCase();
  const userId = currentUser?.user?._id || "";

  // Identify current member in Team collection for local fallback
  const currentMember = team?.find(
    (m) =>
      (userEmail && m.email?.toLowerCase() === userEmail) ||
      (userName && m.memberName?.toLowerCase() === userName),
  );

  // Helper to sync state changes with the URL query parameters
  const updateUrl = (newPage, newTab, newSearch) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", String(newPage));
    if (newTab && newTab !== "all") params.set("tab", newTab);
    if (newSearch && newSearch.trim()) params.set("search", newSearch.trim());

    const qs = params.toString();
    const url = qs ? `/dashboard/projects?${qs}` : `/dashboard/projects`;
    router.replace(url, { scroll: false });
  };

  // TanStack Query with server-side pagination, tab filter, and search
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: [
      "projects",
      {
        page,
        limit: pageSize,
        tab: filterTab,
        search: searchTerm,
        userEmail,
        userId,
        userName,
      },
    ],
    queryFn: getAllProjects,
    placeholderData: keepPreviousData,
  });

  const projects = Array.isArray(data?.projects) ? data.projects : [];
  const pagination = data?.pagination || {};
  const counts = data?.counts || { all: 0, active: 0, completed: 0, my: 0 };

  const totalPages = pagination.totalPages || 1;
  const totalProjects = pagination.totalProjects || 0;

  const isMemberOrHasAssigned =
    currentUser?.user?.role === "member" || counts.my > 0;

  // Check if a project is assigned to current user
  const isAssignedToUser = (project) => {
    if (project.isAssignedToMe) return true;
    if (!currentUser?.user) return false;

    if (
      project.assignedMemberEmail &&
      userEmail &&
      project.assignedMemberEmail.toLowerCase() === userEmail
    ) {
      return true;
    }

    if (
      project.assignedToId &&
      userId &&
      String(project.assignedToId) === String(userId)
    ) {
      return true;
    }

    if (
      project.assignedToId &&
      currentMember?._id &&
      String(project.assignedToId) === String(currentMember._id)
    ) {
      return true;
    }

    if (
      project.assignedTo &&
      currentMember?.memberName &&
      project.assignedTo.toLowerCase() ===
        currentMember.memberName.toLowerCase()
    ) {
      return true;
    }

    if (
      project.assignedTo &&
      userName &&
      project.assignedTo.toLowerCase() === userName
    ) {
      return true;
    }

    return false;
  };

  // Tab change handler
  const handleTabChange = (newTab) => {
    setFilterTab(newTab);
    setPage(1);
    updateUrl(1, newTab, searchTerm);
  };

  // Search change handler
  const handleSearchChange = (newSearch) => {
    setSearchTerm(newSearch);
    setPage(1);
    updateUrl(1, filterTab, newSearch);
  };

  // Page change handler
  const handlePageChange = (newPage) => {
    setPage(newPage);
    updateUrl(newPage, filterTab, searchTerm);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate pagination window
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

  // Section titles & icons based on current tab
  const getSectionHeader = () => {
    switch (filterTab) {
      case "active":
        return {
          title: "Active Projects",
          icon: <LuClock className="size-5 text-warning" />,
          desc: "Projects currently ongoing, in progress, or pending completion.",
          badgeClass: "badge-warning badge-soft",
          badgeText: `${counts.active} Active`,
        };
      case "completed":
        return {
          title: "Completed Projects",
          icon: <LuCircleCheck className="size-5 text-success" />,
          desc: "Projects that have been successfully finished and delivered.",
          badgeClass: "badge-success badge-soft",
          badgeText: `${counts.completed} Completed`,
        };
      case "my":
        return {
          title: "My Assigned Projects",
          icon: <LuUserCheck className="size-5 text-primary" />,
          desc: "Projects assigned specifically to you. Check off tasks as you finish them.",
          badgeClass: "badge-primary badge-soft",
          badgeText: `${counts.my} Assigned`,
        };
      case "all":
      default:
        return {
          title: "All Projects",
          icon: <LuFolderKanban className="size-5 opacity-70" />,
          desc: "Overview of all customer projects and assigned team members.",
          badgeClass: "badge-neutral",
          badgeText: `${counts.all} Total`,
        };
    }
  };

  const header = getSectionHeader();

  return (
    <main className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <section>
        <DashBread title="Projects" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-2.5">
              <LuFolderKanban className="text-primary" /> Projects
            </h1>
            <p className="text-sm opacity-60 mt-1">
              Manage all assigned projects, monitor milestones, and update tasks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn btn-nexoro-primary">
              <LuPlus /> Add Project
            </button>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section>
        <ProjectNav
          filterTab={filterTab}
          setFilterTab={handleTabChange}
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          isMemberOrHasAssigned={isMemberOrHasAssigned}
          counts={counts}
        />
      </section>

      {/* Loading & Error States */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 gap-3 bg-base-100 rounded-2xl border border-base-200">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm font-medium opacity-60">Loading projects...</p>
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-base-100 rounded-2xl border border-error/20 flex flex-col items-center gap-3">
          <p className="text-sm text-error font-medium">
            Failed to load projects. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="btn btn-sm btn-outline btn-error gap-2"
          >
            <LuRefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quick Workspace Callout for "All Projects" Tab when User has Assigned Projects */}
          {filterTab === "all" && isMemberOrHasAssigned && counts.my > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-base-100 rounded-2xl border border-primary/20 shadow-xs relative overflow-hidden">
              <div className="absolute -top-10 -right-10 size-32 rounded-full bg-primary/10 blur-2xl pointer-events-none"></div>
              <div className="flex items-center gap-3.5">
                <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <LuSparkles className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold">My Assigned Projects</h2>
                    <span className="badge badge-primary bg-main border-main text-white badge-sm font-semibold">
                      {counts.my}
                    </span>
                  </div>
                  <p className="text-xs opacity-60 mt-0.5">
                    You have {counts.my} assigned project{counts.my > 1 ? "s" : ""}.
                    Track milestones and checklist tasks in your workspace.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleTabChange("my")}
                className="btn btn-sm btn-primary bg-main border-main text-white shrink-0 gap-1.5"
              >
                <LuUserCheck className="size-4" /> Open My Workspace
              </button>
            </div>
          )}

          {/* Active Tab View Header */}
          <div className="flex items-center justify-between gap-3 mb-2">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                {header.icon}
                {header.title}
                {isFetching && !isLoading && (
                  <span className="loading loading-spinner loading-xs text-primary ml-1" />
                )}
              </h2>
              <p className="text-xs opacity-60 mt-0.5">{header.desc}</p>
            </div>
            <span
              className={`badge ${header.badgeClass} text-xs whitespace-nowrap font-semibold`}
            >
              {header.badgeText}
            </span>
          </div>

          {/* Projects Card Grid */}
          {projects.length === 0 ? (
            <div className="p-12 text-center bg-base-100 rounded-2xl border border-base-200">
              <h3 className="text-lg font-bold">No Projects Found</h3>
              <p className="text-sm opacity-60 mt-1">
                {searchTerm
                  ? `No projects matching "${searchTerm}".`
                  : filterTab === "my"
                    ? "No projects are currently assigned to you."
                    : "No projects in this category."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(340px),1fr))] gap-5">
              {projects.map((project) => {
                const isMine = isAssignedToUser(project);
                return (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    isAssignedToMe={isMine}
                    defaultTasksOpen={filterTab === "my" || isMine}
                  />
                );
              })}
            </div>
          )}

          {/* Server-Side Pagination Controls */}
          {!isLoading && totalProjects > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-base-100 rounded-2xl border border-base-200 shadow-xs">
              {/* Summary and Page Size */}
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-base-content/70">
                <span>
                  Showing{" "}
                  <span className="font-semibold text-base-content">
                    {pagination?.start || 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-base-content">
                    {pagination?.end || totalProjects}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-base-content">
                    {totalProjects}
                  </span>{" "}
                  projects
                </span>

                <div className="flex items-center gap-1.5 border-l border-base-300 pl-3">
                  <span className="text-[11px] text-base-content/60">
                    Per page:
                  </span>
                  <select
                    className="select select-xs select-bordered bg-base-100"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                      updateUrl(1, filterTab, searchTerm);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              {/* Page Buttons */}
              {totalPages > 1 && (
                <div className="join shadow-xs">
                  <button
                    type="button"
                    className="join-item btn btn-sm"
                    disabled={!pagination?.hasPrev}
                    onClick={() => handlePageChange(page - 1)}
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
                          disabled
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
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    className="join-item btn btn-sm"
                    disabled={!pagination?.hasNext}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Next »
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center p-16 gap-3 bg-base-100 rounded-2xl border border-base-200">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm font-medium opacity-60">Loading projects...</p>
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
};

export default Page;
