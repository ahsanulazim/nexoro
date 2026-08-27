"use client";

import { getAllProjects } from "@/api/fetchProject";
import DashBread from "@/components/dashboard/DashBread";
import ProjectCard from "@/components/dashboard/projects/ProjectCard";
import { useQuery } from "@tanstack/react-query";
import { LuPlus } from "react-icons/lu";

const page = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects,
  });

  return (
    <main className="space-y-5">
      <section className="">
        <DashBread title="Projects" />
        <div className="flex items-center justify-between gap-5">
          <h1 className="text-4xl font-semibold">Projects</h1>
          <button className="btn btn-primary btn-nexoro-primary">
            <LuPlus /> Add Project
          </button>
        </div>
      </section>
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(375px),1fr))] gap-5">
          {isLoading ? (
            <span>Loading...</span>
          ) : isError ? (
            <span>Error</span>
          ) : data?.projects?.length === 0 ? (
            <span>No Projects Found</span>
          ) : (
            data?.projects?.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default page;
