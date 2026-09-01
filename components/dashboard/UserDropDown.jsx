"use client";
import { useAuth } from "@/context/AuthProvider";
import { auth } from "@/firebase/firebase.config";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuLogOut, LuSettings, LuUser } from "react-icons/lu";
import { toast } from "react-toastify";

const UserDropDown = () => {
  const { currentUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
      toast.success("Logout successful");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <ul
      tabIndex="-1"
      className="menu dropdown-content bg-base-200 rounded-box z-1 mt-3 w-60 p-2 shadow-sm"
    >
      <li>
        <div className="grid-rows-2 hover:bg-transparent gap-0">
          <h2 className="text-base font-semibold">{currentUser?.user?.name}</h2>
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
        <div onClick={handleLogout}>
          <LuLogOut /> Logout
        </div>
      </li>
    </ul>
  );
};

export default UserDropDown;
