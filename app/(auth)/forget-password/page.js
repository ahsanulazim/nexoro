"use client";

import Loader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthProvider";
import { auth } from "@/firebase/firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LuArrowRight, LuMail } from "react-icons/lu";
import { toast } from "react-toastify";

const page = () => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setIsDisabled(false);
    }
  }, [seconds]);

  useEffect(() => {
    if (authLoading) return;
    if (currentUser?.success) {
      if (currentUser?.user?.emailVerified) {
        router.replace("/dashboard");
      } else {
        router.replace("/verify-email");
      }
    }
  }, [currentUser, authLoading, router]);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      setIsDisabled(true);
      await sendPasswordResetEmail(auth, data.email);
      setSeconds(30);
      toast.success("Password reset link sent successfully");
      reset();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || currentUser?.success) {
    return <Loader />;
  }

  return (
    <div className="bg-base-200 border-base-300 rounded-box w-full sm:max-w-lg border p-5 mx-auto">
      <h1 className=" text-center font-semibold text-2xl mb-5">
        Forget Password
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <label className={`input w-full ${errors.email && "input-error"}`}>
            <LuMail className="h-[1em] opacity-50" />
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
          </label>
          {errors.email && (
            <span className="text-xs text-error">{errors.email.message}</span>
          )}

          <button
            className={`btn ${
              isSubmitting || isDisabled ? "" : "btn-nexoro-primary"
            } mt-4`}
            type="submit"
            disabled={isSubmitting || isDisabled}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : isDisabled ? (
              `Wait ${seconds}s`
            ) : (
              <>
                Send Reset Link <LuArrowRight />
              </>
            )}
          </button>

          <p className="text-center mt-4">
            Remembered your password?{" "}
            <Link className="link link-hover text-main-light" href="/login">
              Login Here
            </Link>
          </p>
        </fieldset>
      </form>
    </div>
  );
};

export default page;
