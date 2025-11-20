"use client";
import auth from "@/firebase/firebase.config";
import Link from "next/link";
import { useSignOut } from "react-firebase-hooks/auth";
import { LuLogOut, LuSettings, LuUser } from "react-icons/lu";

const UserDropDown = () => {
  const [signOut] = useSignOut(auth);

  return (
    <ul
      tabIndex="-1"
      className="menu dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow-sm"
    >
      <li>
        <Link href="/dashboard/profile">
          <LuUser /> Profile
        </Link>
      </li>
      <li>
        <a>
          <LuSettings />
          Settings
        </a>
      </li>
      <li className="text-error">
        <div onClick={signOut}>
          <LuLogOut /> Logout
        </div>
      </li>
    </ul>
  );
};

export default UserDropDown;
