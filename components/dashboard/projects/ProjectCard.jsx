import moment from "moment";
import { FaStar } from "react-icons/fa6";
import { LuCalendar, LuEllipsisVertical } from "react-icons/lu";

const ProjectCard = ({ project }) => {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex gap-5 items-center justify-between">
          <h2 className="card-title">{project.serviceName}</h2>
          <div className="space-x-2">
            <button className="btn btn-square btn-soft btn-warning btn-sm">
              <FaStar />
            </button>
            <button className="btn btn-square btn-soft btn-info btn-sm">
              <LuEllipsisVertical />
            </button>
          </div>
        </div>
        <p className="opacity-60">
          {project.planName} - ${project.servicePrice}
        </p>
        <div>
          <h3 className="font-bold text-base">Task Status</h3>
          <div className="flex justify-between text-sm">
            <span>
              {project?.tasks?.find((task) => !task.isCompleted)?.task ||
                "Completed"}
            </span>
            <span>
              {project?.tasks?.filter((task) => task.isCompleted).length}/
              {project?.tasks?.length}
            </span>
          </div>
        </div>
        <progress
          className={`progress ${
            project?.tasks?.filter((task) => task.isCompleted).length ===
            project?.tasks?.length
              ? "progress-success"
              : project?.tasks.filter((task) => task.isCompleted).length > 0
                ? "progress-warning"
                : "progress-error"
          } w-full h-1`}
          value={project?.tasks?.filter((task) => task.isCompleted).length}
          max={project?.tasks?.length}
        ></progress>
        <hr className="border-0.5 border-dashed my-2 border-base-content/20" />
        <div className="card-actions justify-between items-center">
          {/* <div className="avatar-group -space-x-6">
            <div className="avatar">
              <div className="w-8">
                <img
                  alt="Tailwind-CSS-Avatar-component"
                  src="https://img.daisyui.com/images/profile/demo/batperson@192.webp"
                />
              </div>
            </div>
            <div className="avatar">
              <div className="w-8">
                <img
                  alt="Tailwind-CSS-Avatar-component"
                  src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"
                />
              </div>
            </div>
            <div className="avatar">
              <div className="w-8">
                <img
                  alt="Tailwind-CSS-Avatar-component"
                  src="https://img.daisyui.com/images/profile/demo/averagebulk@192.webp"
                />
              </div>
            </div>
            <div className="avatar">
              <div className="w-8">
                <img
                  alt="Tailwind-CSS-Avatar-component"
                  src="https://img.daisyui.com/images/profile/demo/wonderperson@192.webp"
                />
              </div>
            </div>
          </div> */}
          <div>
            <h3 className="opacity-60 text-xs">Assigned To</h3>
            <span className="font-semibold">{project?.assignedTo}</span>
          </div>
          <div className="flex items-center gap-2 opacity-60">
            <LuCalendar />
            <span>{moment(project.createdAt).format("LL")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
