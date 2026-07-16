"use client";

import { auth } from "@/firebase/firebase.config";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import Loader from "@/components/ui/Loader";
import AuthPage from "@/components/auth/AuthPage";

const page = () => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loader />;
  }

  if (user) {
    return <Loader />;
  }

  return <AuthPage login={false} reset={true} />;
};

export default page;
