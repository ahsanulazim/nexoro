"use client";

import UserForm from "@/components/auth/UserForm";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Register = () => {
  const navigate = useRouter();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (currentUser && !loading) {
      navigate.push("/dashboard");
    }
  }, [currentUser, loading]);

  if (loading) return <Loader />;

  return <UserForm isLogin={false} isReset={false} />;
};

export default Register;
