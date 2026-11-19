"use client";

import { useMemo, useCallback } from "react";
import { useAuth } from "@/context/AuthProvider";
import {
  getEffectivePermissions,
  hasPermission as checkHasPermission,
  canAccessRoute as checkCanAccessRoute,
} from "@/utils/permissions";

/**
 * Custom hook to easily check user roles and granular permissions.
 * Separates business logic from UI components.
 */
export const usePermissions = () => {
  const { currentUser, isLoading } = useAuth();
  const user = currentUser?.user;

  const role = user?.role || "customer";
  const isAdmin = role === "admin";
  const isMember = role === "member";
  const isCustomer = !isAdmin && !isMember;

  const permissions = useMemo(() => {
    return getEffectivePermissions(user);
  }, [user]);

  const hasPermission = useCallback(
    (permissionKey) => {
      return checkHasPermission(user, permissionKey);
    },
    [user]
  );

  const canAccess = useCallback(
    (pathname) => {
      return checkCanAccessRoute(user, pathname);
    },
    [user]
  );

  return {
    user,
    role,
    isAdmin,
    isMember,
    isCustomer,
    permissions,
    hasPermission,
    canAccess,
    isLoading,
  };
};

export default usePermissions;
