import { LuSearch } from "react-icons/lu";

const SearchChat = () => {
  return (
    <label className="input">
      <LuSearch className="h-[1em] opacity-50" />
      <input type="search" required placeholder="Search" />
    </label>
  );
};

export default SearchChat;
