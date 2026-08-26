"use client";

import DashDrawer from "@/components/dashboard/DashDrawer";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthProvider";
import { DashThemeProvider } from "@/context/DashThemeProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }) {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/login");
    }

    if (currentUser && !currentUser?.user?.emailVerified) {
      router.push("/verify-email");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <DashThemeProvider>
      <DashDrawer>{children}</DashDrawer>
    </DashThemeProvider>
  );
}
