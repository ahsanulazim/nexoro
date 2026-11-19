/**
 * Centralized Permission Definitions and Helpers for Nexoro
 */

export const PERMISSION_MODULES = [
  // Operations & Communication
  {
    id: "orders",
    label: "Orders",
    category: "Operations",
    description: "Manage client orders, order status, tasks, and costs",
    route: "/dashboard/orders",
  },
  {
    id: "inbox",
    label: "Inbox / Messages",
    category: "Operations",
    description: "Access customer conversations, chat, and deal closing",
    route: "/dashboard/inbox",
  },
  {
    id: "projects",
    label: "Projects",
    category: "Operations",
    description: "Manage ongoing client projects, tasks, and files",
    route: "/dashboard/projects",
  },
  {
    id: "clients",
    label: "Clients",
    category: "Operations",
    description: "View and manage clients directory and CRM records",
    route: "/dashboard/clients",
  },
  {
    id: "points",
    label: "Points & Leaderboard",
    category: "Operations",
    description: "View team performance, leaderboard, and reward points",
    route: "/dashboard/points",
  },

  // Content & Marketing
  {
    id: "blogs",
    label: "Blogs",
    category: "Content",
    description: "Create, edit, and publish blog articles",
    route: "/dashboard/blogs",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    category: "Content",
    description: "Manage portfolio items and case studies",
    route: "/dashboard/portfolio",
  },
  {
    id: "services",
    label: "Services",
    category: "Content",
    description: "Manage service offerings and categories",
    route: "/dashboard/services",
  },
  {
    id: "pricing",
    label: "Pricing Plans",
    category: "Content",
    description: "Manage service pricing tiers and plans",
    route: "/dashboard/pricing",
  },
  {
    id: "sliders",
    label: "Sliders & Banners",
    category: "Content",
    description: "Manage homepage banners and promotional sliders",
    route: "/dashboard/sliders",
  },
  {
    id: "review",
    label: "Reviews",
    category: "Content",
    description: "Manage customer reviews and testimonials",
    route: "/dashboard/review",
  },

  // Finance & Management
  {
    id: "expenses",
    label: "Expenses",
    category: "Finance & Admin",
    description: "View and manage business expenses and financial records",
    route: "/dashboard/expenses",
  },
  {
    id: "team",
    label: "Team",
    category: "Finance & Admin",
    description: "View internal team member directory",
    route: "/dashboard/team",
  },
  {
    id: "users",
    label: "User Management",
    category: "Finance & Admin",
    description: "Manage customer accounts, roles, and member permissions",
    route: "/dashboard/users",
  },
];

export const ALL_PERMISSION_IDS = PERMISSION_MODULES.map((m) => m.id);

// Default permissions for standard team members (preserves backward compatibility)
export const DEFAULT_MEMBER_PERMISSIONS = [
  "orders",
  "inbox",
  "blogs",
  "projects",
  "points",
  "portfolio",
  "services",
  "pricing",
  "clients",
];

// Presets for quick selection in Admin UI
export const PERMISSION_PRESETS = [
  {
    name: "Full Access",
    description: "All modules and routes",
    permissions: ALL_PERMISSION_IDS,
  },
  {
    name: "Standard Member",
    description: "Default member permissions (Operations + Content)",
    permissions: DEFAULT_MEMBER_PERMISSIONS,
  },
  {
    name: "Support & Communication",
    description: "Inbox, Orders, Clients, Points",
    permissions: ["inbox", "orders", "clients", "points"],
  },
  {
    name: "Project & Operations",
    description: "Orders, Projects, Clients, Points",
    permissions: ["orders", "projects", "clients", "points"],
  },
  {
    name: "Content & Marketing",
    description: "Blogs, Portfolio, Services, Pricing, Sliders, Reviews",
    permissions: ["blogs", "portfolio", "services", "pricing", "sliders", "review"],
  },
  {
    name: "Finance & Operations",
    description: "Expenses, Orders, Clients",
    permissions: ["expenses", "orders", "clients"],
  },
];

// Route mapping: maps route prefix to permission key
export const ROUTE_PERMISSION_MAP = {
  "/dashboard/orders": "orders",
  "/dashboard/inbox": "inbox",
  "/dashboard/projects": "projects",
  "/dashboard/clients": "clients",
  "/dashboard/points": "points",
  "/dashboard/blogs": "blogs",
  "/dashboard/portfolio": "portfolio",
  "/dashboard/services": "services",
  "/dashboard/pricing": "pricing",
  "/dashboard/sliders": "sliders",
  "/dashboard/review": "review",
  "/dashboard/expenses": "expenses",
  "/dashboard/team": "team",
  "/dashboard/users": "users",
};

// Routes accessible to all authenticated dashboard users
export const UNIVERSAL_DASHBOARD_ROUTES = [
  "/dashboard",
  "/dashboard/settings",
  "/dashboard/notifications",
];

// Customer-accessible routes
export const CUSTOMER_ALLOWED_ROUTES = [
  "/dashboard",
  "/dashboard/orders",
  "/dashboard/support",
  "/dashboard/profile",
  "/dashboard/settings",
  "/dashboard/notifications",
];

/**
 * Returns the effective permission list for a user.
 */
export const getEffectivePermissions = (user) => {
  if (!user) return [];
  if (user.role === "admin") return ALL_PERMISSION_IDS;
  if (user.role === "member") {
    return Array.isArray(user.permissions)
      ? user.permissions
      : DEFAULT_MEMBER_PERMISSIONS;
  }
  return [];
};

/**
 * Checks whether a user has a specific permission.
 */
export const hasPermission = (user, permissionKey) => {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.role === "member") {
    const permissions = getEffectivePermissions(user);
    return permissions.includes(permissionKey);
  }
  return false;
};

/**
 * Resolves the required permission ID for a given pathname.
 */
export const getRequiredPermissionForPath = (pathname) => {
  if (!pathname) return null;
  for (const [routePrefix, permKey] of Object.entries(ROUTE_PERMISSION_MAP)) {
    if (pathname === routePrefix || pathname.startsWith(`${routePrefix}/`)) {
      return permKey;
    }
  }
  return null;
};

/**
 * Determines whether a user can access a specific route.
 */
export const canAccessRoute = (user, pathname) => {
  if (!user) return false;
  if (user.role === "admin") return true;

  // Universal routes available to everyone
  if (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/settings") ||
    pathname.startsWith("/dashboard/notifications")
  ) {
    return true;
  }

  // Customer role check
  if (user.role !== "admin" && user.role !== "member") {
    return CUSTOMER_ALLOWED_ROUTES.some(
      (allowed) => pathname === allowed || pathname.startsWith(`${allowed}/`)
    );
  }

  // Member role check: find required permission
  const requiredPermission = getRequiredPermissionForPath(pathname);
  if (!requiredPermission) {
    // Non-module specific dashboard subpath (e.g. profile)
    return true;
  }

  return hasPermission(user, requiredPermission);
};
