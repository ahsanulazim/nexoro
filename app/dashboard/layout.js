"use client";

import DashDrawer from "@/components/dashboard/DashDrawer";
import Loader from "@/components/ui/Loader";
import auth from "@/firebase/firebase.config";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Layout({ children }) {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  return <DashDrawer>{children}</DashDrawer>;
}
