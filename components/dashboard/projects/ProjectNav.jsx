import { LuLayoutGrid, LuSearch, LuUserCheck } from "react-icons/lu";

const ProjectNav = ({
  allProjects,
  filterTab,
  setFilterTab,
  isMemberOrHasAssigned,
  myAssignedProjects,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-base-100 p-3 rounded-box">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => setFilterTab("all")}
          className={`btn ${filterTab === "all" ? "btn-primary bg-main border-main" : "btn-ghost"}`}
        >
          <LuLayoutGrid />
          All Projects
          <span className="badge badge-sm badge-neutral ml-1">
            {allProjects.length}
          </span>
        </button>

        {isMemberOrHasAssigned && (
          <button
            type="button"
            onClick={() => setFilterTab("my")}
            className={`btn ${
              filterTab === "my"
                ? "btn-primary bg-main border-main"
                : "btn-ghost"
            }`}
          >
            <LuUserCheck />
            Assigned to Me
            <span
              className={`badge badge-sm ml-1 ${
                myAssignedProjects.length > 0
                  ? "badge-success text-success-content"
                  : "badge-neutral"
              }`}
            >
              {myAssignedProjects.length}
            </span>
          </button>
        )}
      </div>

      {/* Search input */}
      <label className="input">
        <LuSearch className="h-[1em] opacity-50" />
        <input
          type="text"
          placeholder="Search projects or clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </label>
    </div>
  );
};

export default ProjectNav;
