"use client";
import { useAuth } from "@/context/AuthProvider";
import { auth } from "@/firebase/firebase.config";
import Link from "next/link";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { LuLogOut, LuSettings, LuUser } from "react-icons/lu";

const UserDropDown = () => {
  const { currentUser } = useAuth();
  const [signOut] = useSignOut(auth);

  return (
    <ul
      tabIndex="-1"
      className="menu dropdown-content bg-base-200 rounded-box z-1 mt-3 w-60 p-2 shadow-sm"
    >
      <li>
        <div className="grid-rows-2 hover:bg-transparent gap-0">
          <h2 className="text-base font-semibold">
            {currentUser?.user?.userName}
          </h2>
          <p className="truncate">{currentUser?.user?.email}</p>
        </div>
      </li>
      <li>
        <Link href="/dashboard/profile">
          <LuUser /> Profile
        </Link>
      </li>
      <li>
        <Link href="/dashboard/settings">
          <LuSettings />
          Settings
        </Link>
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
