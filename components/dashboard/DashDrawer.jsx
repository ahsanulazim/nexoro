"use client";

import { useState } from "react";
import { LuLayoutDashboard, LuSettings } from "react-icons/lu";
import DashNav from "./DashNav";
import ActiveLink from "./ActiveLink";
import BrowserNotificationBanner from "./BrowserNotificationBanner";
import { useDashTheme } from "@/context/DashThemeProvider";
import usePermissions from "@/hooks/usePermissions";
import {
  DASHBOARD_NAV_ITEMS,
  CUSTOMER_NAV_ITEMS,
} from "./dashboardNavItems";

const DashDrawer = ({ children }) => {
  const { isAdmin, isMember, isCustomer, hasPermission } = usePermissions();
  const [isChecked, setIsChecked] = useState(false);
  const { isDark } = useDashTheme();

  // Filter staff nav items based on granular member/admin permissions
  const visibleStaffItems = (isAdmin || isMember)
    ? DASHBOARD_NAV_ITEMS.filter((item) =>
        isAdmin ? true : hasPermission(item.permissionKey)
      )
    : [];

  return (
    <div
      className="drawer lg:drawer-open"
      data-lenis-ignore
      id="nexoro-dashboard"
    >
      <input
        id="my-drawer-4"
        type="checkbox"
        onChange={() => setIsChecked(!isChecked)}
        className="drawer-toggle"
      />
      <div className="drawer-content">
        {/* Navbar */}
        <DashNav isChecked={isChecked} />
        <BrowserNotificationBanner />
        {/* Page content here */}
        <div className="p-4 bg-base-300 min-h-[calc(100dvh-80px)]">
          {children}
        </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          <div className="flex gap-2 items-center px-2 py-4">
            <img
              src="/assets/nexoro_logo_icon.png"
              className="w-full max-w-10"
              alt="Nexoro Logo"
            />
            <span className="is-drawer-close:hidden">
              <img
                src={`/assets/${!isDark ? "nexoro_logo_name_dark.png" : "nexoro_logo_name.png"}`}
                className="w-full max-w-18"
                alt="Nexoro Logo"
              />
            </span>
          </div>

          {/* Sidebar Navigation */}
          <ul className="menu w-full grow">
            {/* Common Dashboard Home */}
            <li>
              <ActiveLink href="/dashboard" dataTip="Dashboard">
                <LuLayoutDashboard className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Dashboard</span>
              </ActiveLink>
            </li>

            {/* Staff Navigation Items (Admin & Member with permissions) */}
            {visibleStaffItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <ActiveLink href={item.href} dataTip={item.dataTip}>
                    <Icon className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">{item.label}</span>
                  </ActiveLink>
                </li>
              );
            })}

            {/* Customer Navigation Items */}
            {isCustomer &&
              CUSTOMER_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <ActiveLink href={item.href} dataTip={item.dataTip}>
                      <Icon className="my-1.5 inline-block size-4" />
                      <span className="is-drawer-close:hidden">{item.label}</span>
                    </ActiveLink>
                  </li>
                );
              })}

            {/* Settings (Available to all) */}
            <li>
              <ActiveLink href="/dashboard/settings" dataTip="Settings">
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
