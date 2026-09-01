"use client";

import Loader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthProvider";
import { auth } from "@/firebase/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LuArrowRight, LuEye, LuEyeOff, LuKey, LuMail } from "react-icons/lu";
import { toast } from "react-toastify";

const page = () => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const email = data.email;
    const password = data.password;

    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (userCredential.user.emailVerified) {
        toast.success("Login successful");
        router.push("/dashboard");
      } else {
        toast.warning("Verify your email address");
        router.push("/verify-email");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || currentUser?.success) {
    return <Loader />;
  }

  return (
    <div className="bg-base-200 border-base-300 rounded-box w-full sm:max-w-lg border p-5 mx-auto">
      <h1 className=" text-center font-semibold text-2xl mb-5">Login</h1>
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

          <label className="label">Password</label>
          <label className={`input w-full ${errors.password && "input-error"}`}>
            <LuKey className="h-[1em] opacity-50" />
            <input
              type={isVisible ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            <button type="button" onClick={() => setIsVisible(!isVisible)}>
              {isVisible ? <LuEye /> : <LuEyeOff />}
            </button>
          </label>
          {errors.password && (
            <span className="text-xs text-error">
              {errors.password.message}
            </span>
          )}
          <Link href="/forget-password">
            <span className="text-main-light">Forgot Password?</span>
          </Link>

          <button
            className={`btn ${isLoading ? "" : "btn-nexoro-primary"} mt-4`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <>
                Login <LuArrowRight />
              </>
            )}
          </button>

          <p className="text-center mt-4">
            Don't have an account?{" "}
            <Link className="link link-hover text-main-light" href="/register">
              Register
            </Link>
          </p>
        </fieldset>
      </form>
    </div>
  );
};

export default page;
