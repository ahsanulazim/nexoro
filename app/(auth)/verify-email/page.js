"use client";

import api from "@/axios/axiosInstance";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthProvider";
import { auth } from "@/firebase/firebase.config";
import { sendEmailVerification, signOut } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const page = () => {
  const { currentUser, isLoading, refetchUser } = useAuth();
  const router = useRouter();

  //button disable for 30sec
  const [isDisabled, setIsDisabled] = useState(true);
  const [seconds, setSeconds] = useState(30);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // cleanup
    } else {
      setIsDisabled(false); // 0 হলে enable হবে
    }
  }, [seconds]);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/login");
    } else if (!isLoading && currentUser?.user?.emailVerified) {
      router.push("/dashboard");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser || currentUser?.user?.emailVerified) {
    return <Loader />;
  }

  const sendVerificationEmail = async () => {
    try {
      if (!auth.currentUser) {
        toast.error("User not found. Please log in again.");
        return;
      }
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email sent");
      setSeconds(30);
      setIsDisabled(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const checkVerificationStatus = async () => {
    try {
      setIsChecking(true);
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        await api.put("users/updateUser", {
          emailVerified: true,
        });
        await refetchUser();
        toast.success("Email verified successfully");
        router.push("/dashboard");
      } else {
        toast.error("Email not verified yet. Please check your inbox.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="text-center">
      <Image
        src="/assets/Envelope.svg"
        className="mx-auto"
        width={350}
        height={350}
        alt="verification email art"
      />
      <p className="text-balance">
        Please check your email address (
        <span className="font-semibold">
          {auth.currentUser?.email || currentUser?.user?.email}
        </span>
        ) for the verification link.
      </p>{" "}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6">
        <button
          type="button"
          onClick={sendVerificationEmail}
          disabled={isDisabled}
          className={`btn btn-lg ${isDisabled ? "" : "btn-nexoro-primary"} w-full sm:w-auto`}
        >
          {isDisabled ? `Wait ${seconds}s` : "Resend Verification Email"}
        </button>
        <button
          className="btn btn-lg btn-outline w-full sm:w-auto"
          type="button"
          onClick={checkVerificationStatus}
          disabled={isChecking}
        >
          {isChecking ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Check Verification Status"
          )}
        </button>
      </div>
      <div className="mt-6">
        <button
          type="button"
          onClick={handleLogout}
          className="link text-sm text-error"
        >
          Log out / Switch Account
        </button>
      </div>
    </div>
  );
};

export default page;
