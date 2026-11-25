import { getRecentProjects } from "@/api/fetchAnalytics";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

const RecentProjectsData = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recent-projects"],
    queryFn: getRecentProjects,
  });

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead className="">
          <tr>
            <th>Project Name</th>
            <th>Assigned To</th>
            <th>Progress</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan="5">Error fetching recent projects</td>
            </tr>
          ) : data?.length === 0 ? (
            <tr>
              <td colSpan="5">No recent projects</td>
            </tr>
          ) : (
            data.map((project) => (
              <tr key={project._id}>
                <td>{project.serviceName}</td>
                <td>
                  {Array.isArray(project.assignedMembers) && project.assignedMembers.length > 0 ? (
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {project.assignedMembers.map((m, idx) => (
                        <span key={idx} className="badge badge-xs badge-soft badge-primary font-medium">
                          {m.memberName || "Member"}
                        </span>
                      ))}
                    </div>
                  ) : (
                    project.assignedTo || "Unassigned"
                  )}
                </td>
                <td>
                  <progress
                    className="progress progress-accent w-20"
                    value={
                      project?.tasks?.filter((task) => task.isCompleted).length
                    }
                    max={project?.tasks?.length}
                  ></progress>
                </td>
                <td>
                  <span
                    className={`badge ${
                      project.status === "Completed"
                        ? "badge-success"
                        : project.status === "Pending"
                          ? "badge-warning"
                          : "badge-error"
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td>{moment(project.createdAt).format("MMM Do, YY")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentProjectsData;
