"use client";

import {
  LuBookUser,
  LuFlag,
  LuGalleryThumbnails,
  LuLayoutDashboard,
  LuMessageCircle,
  LuNotebookPen,
  LuPackage,
  LuSettings,
  LuStar,
  LuStore,
  LuUsers,
  LuUsersRound,
} from "react-icons/lu";
import { HiOutlineCurrencyBangladeshi } from "react-icons/hi";
import DashNav from "./DashNav";
import Link from "next/link";
import { useContext } from "react";
import { MyContext } from "@/context/MyProvider";
import ActiveLink from "./ActiveLink";

const DashDrawer = ({ children }) => {
  const { isAdmin, isEmployee, isMember } = useContext(MyContext);

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
              <ActiveLink href="/dashboard" dataTip="Dashboard">
                {/* Home icon */}
                <LuLayoutDashboard className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Dashboard</span>
              </ActiveLink>
            </li>
            {isAdmin || isMember ? (
              <>
                <li>
                  <ActiveLink href="/dashboard/orders" dataTip="Orders">
                    <LuPackage className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">Orders</span>
                  </ActiveLink>
                </li>

                <li>
                  <ActiveLink href="/dashboard/blogs" dataTip="Blog">
                    <LuNotebookPen className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">Blog</span>
                  </ActiveLink>
                </li>

                <li>
                  <ActiveLink href="/dashboard/portfolio" dataTip="Portfolio">
                    <LuBookUser className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">Portfolio</span>
                  </ActiveLink>
                </li>

                <li>
                  <ActiveLink href="/dashboard/services" dataTip="Services">
                    <LuFlag className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">Services</span>
                  </ActiveLink>
                </li>
                <li>
                  <ActiveLink href="/dashboard/pricing" dataTip="Pricing">
                    <HiOutlineCurrencyBangladeshi className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">Pricing</span>
                  </ActiveLink>
                </li>
              </>
            ) : null}
            {isAdmin && (
              <>
                <li>
                  <ActiveLink href="/dashboard/sliders" dataTip="Sliders">
                    <LuGalleryThumbnails className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">Sliders</span>
                  </ActiveLink>
                </li>
                <li>
                  <ActiveLink href="/dashboard/inbox" dataTip="Inbox">
                    <LuMessageCircle className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">Inbox</span>
                  </ActiveLink>
                </li>
                <li>
                  <ActiveLink href="/dashboard/review" dataTip="Review">
                    <LuStar className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">Review</span>
                  </ActiveLink>
                </li>
                <li>
                  <ActiveLink href="/dashboard/clients" dataTip="Clients">
                    <LuStore className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">Clients</span>
                  </ActiveLink>
                </li>
                <li>
                  <ActiveLink href="/dashboard/users" dataTip="Users">
                    <LuUsersRound className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">Users</span>
                  </ActiveLink>
                </li>
                <li>
                  <ActiveLink href="/dashboard/team" dataTip="Team">
                    <LuUsers className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">Team</span>
                  </ActiveLink>
                </li>
              </>
            )}
            {/* List item */}
            <li>
              <ActiveLink href="/dashboard/settings" dataTip="Settings">
                {/* Settings icon */}
                <LuSettings className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Settings</span>
              </ActiveLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashDrawer;
