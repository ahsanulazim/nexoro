import { LuLogOut, LuSettings, LuUser } from "react-icons/lu";

const UserDropDown = () => {
  return (
    <ul
      tabIndex="-1"
      className="menu dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow-sm"
    >
      <li>
        <a className="justify-between">
          <div className="flex gap-2 items-center">
            <LuUser /> Profile
          </div>
        </a>
      </li>
      <li>
        <a>
          <LuSettings />
          Settings
        </a>
      </li>
      <li className="text-error">
        <a>
          <LuLogOut /> Logout
        </a>
      </li>
    </ul>
  );
};

export default UserDropDown;
