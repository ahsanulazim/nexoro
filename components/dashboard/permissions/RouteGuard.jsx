"use client";

import { usePathname } from "next/navigation";
import usePermissions from "@/hooks/usePermissions";
import {
  getRequiredPermissionForPath,
  PERMISSION_MODULES,
} from "@/utils/permissions";
import AccessDenied from "./AccessDenied";

export default function RouteGuard({ children }) {
  const pathname = usePathname();
  const { user, canAccess, isLoading } = usePermissions();

  if (isLoading || !user) {
    return <>{children}</>;
  }

  // Check if current user has access to this route
  const isAllowed = canAccess(pathname);

  if (!isAllowed) {
    const permKey = getRequiredPermissionForPath(pathname);
    const modConfig = PERMISSION_MODULES.find((m) => m.id === permKey);
    const moduleName = modConfig ? modConfig.label : "this section";

    return <AccessDenied moduleName={moduleName} />;
  }

  return <>{children}</>;
}
