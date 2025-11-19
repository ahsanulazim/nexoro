"use client";

import AuthPage from "@/components/auth/AuthPage";
import Loader from "@/components/ui/Loader";
import auth from "@/firebase/firebase.config";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Login = () => {
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

  return <AuthPage login={true} />;
};

export default Login;
