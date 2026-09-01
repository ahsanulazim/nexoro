"use client";

import api from "@/axios/axiosInstance";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthProvider";
import { auth } from "@/firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  LuArrowRight,
  LuEye,
  LuEyeOff,
  LuKey,
  LuMail,
  LuUser,
} from "react-icons/lu";
import { toast } from "react-toastify";

const Register = () => {
  const { currentUser, isLoading: authLoading, refetchUser } = useAuth();
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
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const name = data.name;
    const email = data.email;
    const password = data.password;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      await sendEmailVerification(auth.currentUser);

      await api.post("/users/add", {
        name,
        email,
      });
      await refetchUser();
      reset();
      router.push("/verify-email");
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  if (authLoading || currentUser?.success) {
    return <Loader />;
  }

  return (
    <div className="bg-base-200 border-base-300 rounded-box w-full sm:max-w-lg border p-5 mx-auto">
      <h1 className=" text-center font-semibold text-2xl mb-5">Registration</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          <label className="label">Name</label>
          <label className={`input w-full ${errors.name && "input-error"}`}>
            <LuUser className="h-[1em] opacity-50" />
            <input
              type="text"
              placeholder="Name"
              {...register("name", { required: "Name is required" })}
            />
          </label>
          {errors.name && (
            <span className="text-xs text-error">{errors.name.message}</span>
          )}

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
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
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

          <button
            className="btn btn-nexoro-primary mt-4"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <>
                Register <LuArrowRight />
              </>
            )}
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

export default Register;
