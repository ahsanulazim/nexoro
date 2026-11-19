import {
  LuBookUser,
  LuBriefcase,
  LuFlag,
  LuGalleryThumbnails,
  LuHeadset,
  LuLayoutDashboard,
  LuMessageCircle,
  LuNotebookPen,
  LuPackage,
  LuReceipt,
  LuSettings,
  LuStar,
  LuStore,
  LuTrophy,
  LuUsers,
  LuUsersRound,
} from "react-icons/lu";
import { HiOutlineCurrencyBangladeshi } from "react-icons/hi";

// Configured navigation items with their respective permission keys
export const DASHBOARD_NAV_ITEMS = [
  // Core Operations & Communication
  {
    href: "/dashboard/orders",
    dataTip: "Orders",
    label: "Orders",
    icon: LuPackage,
    permissionKey: "orders",
  },
  {
    href: "/dashboard/inbox",
    dataTip: "Inbox",
    label: "Inbox",
    icon: LuMessageCircle,
    permissionKey: "inbox",
  },
  {
    href: "/dashboard/projects",
    dataTip: "Projects",
    label: "Projects",
    icon: LuBriefcase,
    permissionKey: "projects",
  },
  {
    href: "/dashboard/clients",
    dataTip: "Clients",
    label: "Clients",
    icon: LuStore,
    permissionKey: "clients",
  },
  {
    href: "/dashboard/points",
    dataTip: "Points & Leaderboard",
    label: "Points & Leaderboard",
    icon: LuTrophy,
    permissionKey: "points",
  },

  // Content & Marketing
  {
    href: "/dashboard/blogs",
    dataTip: "Blog",
    label: "Blog",
    icon: LuNotebookPen,
    permissionKey: "blogs",
  },
  {
    href: "/dashboard/portfolio",
    dataTip: "Portfolio",
    label: "Portfolio",
    icon: LuBookUser,
    permissionKey: "portfolio",
  },
  {
    href: "/dashboard/services",
    dataTip: "Services",
    label: "Services",
    icon: LuFlag,
    permissionKey: "services",
  },
  {
    href: "/dashboard/pricing",
    dataTip: "Pricing",
    label: "Pricing",
    icon: HiOutlineCurrencyBangladeshi,
    permissionKey: "pricing",
  },
  {
    href: "/dashboard/sliders",
    dataTip: "Sliders",
    label: "Sliders",
    icon: LuGalleryThumbnails,
    permissionKey: "sliders",
  },
  {
    href: "/dashboard/review",
    dataTip: "Review",
    label: "Review",
    icon: LuStar,
    permissionKey: "review",
  },

  // Finance & Team Management
  {
    href: "/dashboard/expenses",
    dataTip: "Expenses",
    label: "Expenses",
    icon: LuReceipt,
    permissionKey: "expenses",
  },
  {
    href: "/dashboard/team",
    dataTip: "Team",
    label: "Team",
    icon: LuUsers,
    permissionKey: "team",
  },
  {
    href: "/dashboard/users",
    dataTip: "Users",
    label: "Users",
    icon: LuUsersRound,
    permissionKey: "users",
  },
];

// Customer-specific navigation items
export const CUSTOMER_NAV_ITEMS = [
  {
    href: "/dashboard/orders",
    dataTip: "My Orders",
    label: "My Orders",
    icon: LuPackage,
  },
  {
    href: "/dashboard/support",
    dataTip: "Support",
    label: "Support",
    icon: LuHeadset,
  },
  {
    href: "/dashboard/profile",
    dataTip: "Profile",
    label: "Profile",
    icon: LuBookUser,
  },
];
