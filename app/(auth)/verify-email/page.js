"use client";
import UserForm from "@/components/auth/UserForm";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const page = () => {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/login");
    }
    if (!isLoading && currentUser && currentUser?.user?.emailVerified) {
      router.push("/dashboard");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser) {
    return <Loader />;
  }

  return <UserForm isLogin={false} isReset={false} verifyEmail={true} />;
};

export default page;
