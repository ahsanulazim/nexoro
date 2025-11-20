"use client";

import auth from "@/firebase/firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaChevronRight } from "react-icons/fa6";
import { LuIdCard } from "react-icons/lu";

const AccountInfo = () => {
  const [user] = useAuthState(auth);

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-300">
      <h1 className="p-4 text-xl sm:text-2xl font-semibold flex items-center gap-3 border-b border-b-base-content/5">
        <LuIdCard className="size-6 sm:size-8 text-purple-500" />
        Profile Information
      </h1>
      <table className="table rounded-t-none">
        <tbody>
          {/* row 1 */}
          <tr>
            <td className="flex justify-between gap-5 items-center cursor-pointer">
              <div>
                <label className="font-semibold text-base">Name</label>
                <p className="opacity-50">{user?.displayName}</p>
              </div>
              <FaChevronRight />
            </td>
          </tr>
          {/* row 2 */}
          <tr>
            <td className="flex justify-between gap-5 items-center cursor-pointer">
              <div>
                <label className="font-semibold text-base">Phone</label>
                <p className="opacity-50">+880</p>
              </div>
              <FaChevronRight />
            </td>
          </tr>
          <tr>
            <td className="flex justify-between gap-5 items-center cursor-pointer">
              <div>
                <label className="font-semibold text-base">Address</label>
                <p className="opacity-50">Bangladesh</p>
              </div>
              <FaChevronRight />
            </td>
          </tr>
          <tr>
            <td className="flex justify-between gap-5 items-center cursor-pointer">
              <div>
                <label className="font-semibold text-base">Company</label>
                <p className="opacity-50">Company Name</p>
              </div>
              <FaChevronRight />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AccountInfo;
