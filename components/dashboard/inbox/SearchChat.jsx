import { LuSearch, LuX } from "react-icons/lu";

const SearchChat = ({ searchTerm = "", setSearchTerm = () => {} }) => {
  return (
    <div className="relative w-full">
      <div className="input input-sm input-bordered w-full flex items-center gap-2 bg-base-100 rounded-lg">
        <LuSearch className="h-4 w-4 opacity-50 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, message, phone..."
          className="grow bg-transparent text-xs focus:outline-none placeholder:text-base-content/40"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="btn btn-ghost btn-circle btn-xs text-base-content/60 hover:text-base-content"
          >
            <LuX className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchChat;
