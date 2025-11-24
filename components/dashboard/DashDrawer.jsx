"use client";

import {
  LuBookUser,
  LuFlag,
  LuLayoutDashboard,
  LuMessageCircle,
  LuPackage,
  LuSettings,
  LuStore,
  LuUsers,
  LuUsersRound,
} from "react-icons/lu";
import DashNav from "./DashNav";
import Link from "next/link";
import { useContext } from "react";
import { MyContext } from "@/context/MyProvider";

const DashDrawer = ({ children }) => {
  const { isAdmin } = useContext(MyContext);

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <DashNav />
        {/* Page content here */}
        <div className="p-4">{children}</div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="menu w-full grow">
            {/* List item */}
            <li>
              <Link
                href="/dashboard"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Dashboard"
              >
                {/* Home icon */}
                <LuLayoutDashboard className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Dashboard</span>
              </Link>
            </li>

            <li>
              <button
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Orders"
              >
                <LuPackage className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Orders</span>
              </button>
            </li>
            <li>
              <button
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Inbox"
              >
                <LuMessageCircle className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Inbox</span>
              </button>
            </li>
            <li>
              <Link
                href="/dashboard/services"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Services"
              >
                <LuFlag className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Services</span>
              </Link>
            </li>
            <li>
              <button
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Portfolio"
              >
                <LuBookUser className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Portfolio</span>
              </button>
            </li>
            {isAdmin && (
              <li>
                <Link
                  href="/dashboard/users"
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  data-tip="Users"
                >
                  <LuUsersRound className="my-1.5 inline-block size-4" />
                  <span className="is-drawer-close:hidden">Users</span>
                </Link>
              </li>
            )}
            <li>
              <button
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Team"
              >
                <LuUsers className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Team</span>
              </button>
            </li>
            <li>
              <button
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Clients"
              >
                <LuStore className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Clients</span>
              </button>
            </li>
            {/* List item */}
            <li>
              <Link
                href="/dashboard/settings"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Settings"
              >
                {/* Settings icon */}
                <LuSettings className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashDrawer;
