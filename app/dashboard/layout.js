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
    if (isLoading) return;

    if (!currentUser?.success) {
      router.push("/login");
    } else if (!currentUser?.user?.emailVerified) {
      router.push("/verify-email");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser?.success) {
    return <Loader />;
  }

  return (
    <DashThemeProvider>
      <DashDrawer>{children}</DashDrawer>
    </DashThemeProvider>
  );
}
