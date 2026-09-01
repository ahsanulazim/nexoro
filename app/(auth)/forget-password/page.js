"use client";

import Loader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { LuArrowRight, LuMail } from "react-icons/lu";

const page = () => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter();

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
    console.log(data);
  };

  if (authLoading || currentUser?.success) {
    return <Loader />;
  }

  return (
    <div className="bg-base-200 border-base-300 rounded-box w-full sm:max-w-lg border p-5 mx-auto">
      <h1 className=" text-center font-semibold text-2xl mb-5">Registration</h1>
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

          <button className="btn btn-nexoro-primary mt-4">
            Register <LuArrowRight />
          </button>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link className="link link-hover text-main-light" href="/login">
              Login
            </Link>
          </p>
        </fieldset>
      </form>
    </div>
  );
};

export default page;
