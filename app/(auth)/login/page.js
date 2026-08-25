"use client";
import UserForm from "@/components/auth/UserForm";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const page = () => {
  const navigate = useRouter();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (currentUser && !loading) {
      navigate.push("/dashboard");
    }
  }, [currentUser, loading]);

  if (loading) return <Loader />;

  return <UserForm isLogin={true} isReset={false} />;
};

export default page;
