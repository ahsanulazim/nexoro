"use client";

import { getAllProjects } from "@/api/fetchProject";
import DashBread from "@/components/dashboard/DashBread";
import ProjectCard from "@/components/dashboard/projects/ProjectCard";
import ProjectNav from "@/components/dashboard/projects/ProjectNav";
import { useAuth } from "@/context/AuthProvider";
import { MyContext } from "@/context/MyProvider";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import {
  LuFolderKanban,
  LuPlus,
  LuSparkles,
  LuUserCheck,
} from "react-icons/lu";

const Page = () => {
  const { currentUser } = useAuth();
  const { team } = useContext(MyContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState("all"); // "all" | "my"

  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects,
  });

  const allProjects = Array.isArray(data?.projects) ? data.projects : [];

  // Identify current member in Team collection
  const userEmail = currentUser?.user?.email?.toLowerCase();
  const userName = (
    currentUser?.user?.name ||
    currentUser?.user?.displayName ||
    ""
  ).toLowerCase();

  const currentMember = team?.find(
    (m) =>
      (userEmail && m.email?.toLowerCase() === userEmail) ||
      (userName && m.memberName?.toLowerCase() === userName),
  );

  const isAssignedToUser = (project) => {
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
      currentUser?.user?._id &&
      String(project.assignedToId) === String(currentUser.user._id)
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

  // Separate user's assigned projects
  const myAssignedProjects = allProjects.filter(isAssignedToUser);
  const isMemberOrHasAssigned =
    currentUser?.user?.role === "member" || myAssignedProjects.length > 0;

  // Filter projects by search term
  const filterBySearch = (list) => {
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(
      (p) =>
        p.serviceName?.toLowerCase().includes(term) ||
        p.planName?.toLowerCase().includes(term) ||
        p.client?.toLowerCase().includes(term) ||
        p.assignedTo?.toLowerCase().includes(term),
    );
  };

  const filteredMyProjects = filterBySearch(myAssignedProjects);
  const filteredAllProjects = filterBySearch(allProjects);

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
              Manage all assigned projects, monitor milestones, and update
              tasks.
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
          allProjects={allProjects}
          filterTab={filterTab}
          setFilterTab={setFilterTab}
          isMemberOrHasAssigned={isMemberOrHasAssigned}
          myAssignedProjects={myAssignedProjects}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </section>

      {/* Loading & Error States */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 gap-3 bg-base-100 rounded-2xl border border-base-200">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm font-medium opacity-60">Loading projects...</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error">
          <span>Failed to load projects. Please refresh the page.</span>
        </div>
      ) : allProjects.length === 0 ? (
        <div className="p-12 text-center bg-base-100 rounded-2xl border border-base-200">
          <h3 className="text-lg font-bold">No Projects Found</h3>
          <p className="text-sm opacity-60 mt-1">
            Assigned customer orders will appear here as active projects.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* SEPARATED SECTION: My Assigned Projects */}
          {(filterTab === "all" || filterTab === "my") &&
            isMemberOrHasAssigned && (
              <section className="bg-base-100/70 p-5 sm:p-6 rounded-2xl border border-primary/20 shadow-xs relative overflow-hidden">
                <div className="absolute -top-12 -right-12 size-44 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-base-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-primary bg-main border-main">
                        <LuSparkles /> My Workspace
                      </span>
                      <h2 className="text-xl font-bold">
                        My Assigned Projects
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm opacity-60 mt-1">
                      Projects assigned specifically to you. Check off tasks as
                      you finish them to keep progress updated.
                    </p>
                  </div>
                  <span className="badge badge-outline badge-primary text-xs">
                    {myAssignedProjects.length} Assigned
                  </span>
                </div>

                {filteredMyProjects.length === 0 ? (
                  <div className="p-8 text-center bg-base-200/50 rounded-xl border border-dashed border-base-300">
                    <LuUserCheck className="size-8 mx-auto opacity-40 text-primary mb-2" />
                    <p className="font-semibold text-sm">
                      {searchTerm
                        ? "No assigned projects match your search."
                        : "No projects are currently assigned to you."}
                    </p>
                    <p className="text-xs opacity-50 mt-1">
                      When an order is assigned to you by an admin, it will
                      appear here with your task checklist.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(min(340px),1fr))] gap-5">
                    {filteredMyProjects.map((project) => (
                      <ProjectCard
                        key={project._id}
                        project={project}
                        isAssignedToMe={true}
                        defaultTasksOpen={true}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

          {/* All Projects Section */}
          {filterTab === "all" && (
            <section>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <LuFolderKanban className="size-5 opacity-70" />
                    All Projects
                  </h2>
                  <p className="text-xs opacity-60 mt-0.5">
                    Overview of all customer projects and assigned team members
                    across the organization.
                  </p>
                </div>
                <span className="badge badge-neutral text-xs whitespace-nowrap">
                  {filteredAllProjects.length} Total
                </span>
              </div>

              {filteredAllProjects.length === 0 ? (
                <div className="p-8 text-center bg-base-100 rounded-xl border border-base-200">
                  <p className="text-sm opacity-60">
                    No projects found matching &ldquo;{searchTerm}&rdquo;.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(340px),1fr))] gap-5">
                  {filteredAllProjects.map((project) => {
                    const isMine = isAssignedToUser(project);
                    return (
                      <ProjectCard
                        key={project._id}
                        project={project}
                        isAssignedToMe={isMine}
                        defaultTasksOpen={isMine}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </main>
  );
};

export default Page;
