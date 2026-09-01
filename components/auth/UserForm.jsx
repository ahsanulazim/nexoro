"use client";

import Link from "next/link";
import { loginSchema, regSchema, resetSchema } from "@/validator/userValidator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppForm } from "../ui/forms/CustomHookForm";
import { createUser } from "@/api/fetchUsers";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase/firebase.config";
import { signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthProvider";
import Image from "next/image";
import { useState } from "react";

const UserForm = ({ isLogin, isReset, verifyEmail }) => {
  const router = useRouter();

  const { currentUser, setCurrentUser, setIsLoading, refreshUser } = useAuth();
  const [verificationSent, setVerificationSent] = useState(false);
  const [isSendingMail, setIsSendingMail] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const { AppField, handleSubmit, reset, AppForm, SubmitButton } = useAppForm({
    defaultValues: {
      ...(isLogin || isReset ? {} : { userName: "" }),
      email: "",
      password: "",
    },
    validators: {
      onSubmit: isLogin ? loginSchema : isReset ? resetSchema : regSchema,
    },
    onSubmit: async ({ value }) => {
      if (isLogin) {
        try {
          const userCred = await signInWithEmailAndPassword(
            auth,
            value.email,
            value.password,
          );

          toast.success("Login Successful");
          router.push("/dashboard");
        } catch (error) {
          toast.error(error.message);
        }
      } else {
        try {
          const userCred = await createUserWithEmailAndPassword(
            auth,
            value.email,
            value.password,
          );
          const user = userCred.user;
          if (user) {
            const uid = user.uid;
            mutate({ ...value, uid });
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Registration Successful");
      setCurrentUser(data);
      reset();
      if (!data?.user?.emailVerified) {
        router.push("/verify-email");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error) => {
      reset();
      console.warn("User sync warning:", error.message);
      if (!auth.currentUser?.emailVerified) {
        router.push("/verify-email");
      } else {
        router.push("/dashboard");
      }
    },
  });

  const googleSync = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Login Successful");
      setCurrentUser(data);
      reset();
      if (!data?.user?.emailVerified) {
        router.push("/verify-email");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error) => {
      reset();
      console.warn("Google sync warning:", error.message);
      if (!auth.currentUser?.emailVerified) {
        router.push("/verify-email");
      } else {
        router.push("/dashboard");
      }
    },
  });

  //custom verification page
  const actionCodeSettings = {
    url:
      typeof window !== "undefined"
        ? `${window.location.origin}/verification-status`
        : "http://localhost:3000/verification-status",
    handleCodeInApp: true,
  };

  const handleEmail = async () => {
    try {
      setIsSendingMail(true);
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please login to send verification email");
        return;
      }
      await sendEmailVerification(user, actionCodeSettings);
      setVerificationSent(true);
      toast.success("Verification email sent");
    } catch (error) {
      setIsSendingMail(false);
      setVerificationSent(false);
      toast.error(error.message);
    } finally {
      setIsSendingMail(false);
    }
  };

  const handleCheckStatus = async () => {
    try {
      setIsCheckingStatus(true);
      await refreshUser?.();
      if (auth.currentUser?.emailVerified || currentUser?.user?.emailVerified) {
        toast.success("Email verified!");
        router.push("/dashboard");
      } else {
        toast.info("Email is not verified yet. Please check your inbox.");
      }
    } catch (error) {
      toast.error("Failed to check status");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    router.push("/login");
  };

  //google login
  const handleGoogle = async () => {
    const google = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, google);
      const user = result.user;
      if (user) {
        const userData = {
          userName: user.displayName,
          email: user.email,
          uid: user.uid,
        };
        googleSync.mutate(userData);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-base-200 border-base-300 rounded-box w-full sm:max-w-lg border p-5 sm:p-10 mx-auto">
      <h1 className=" text-center font-semibold text-2xl sm:text-4xl mb-5">
        {isLogin
          ? "Login"
          : isReset
            ? "Reset Password"
            : verifyEmail
              ? "Verify Email"
              : "Register"}
      </h1>

      {!isReset && !verifyEmail && (
        <>
          {/* Social Login */}
          <button
            type="button"
            onClick={handleGoogle}
            className="btn bg-white text-black border-[#e5e5e5] grow py-6 rounded-lg w-full"
          >
            <svg
              aria-label="Google logo"
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            <span>Continue with Google</span>
          </button>
          <div className="divider">OR</div>
        </>
      )}

      {verifyEmail ? (
        <div className="text-center">
          <Image
            src="/assets/Envelope.svg"
            className="mx-auto"
            width={350}
            height={350}
            alt="verification email art"
          />
          <p className="text-balance">
            Please verify your email address (
            <span className="font-semibold">
              {auth.currentUser?.email || currentUser?.user?.email}
            </span>
            ) by clicking the button below.
          </p>{" "}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6">
            <button
              type="button"
              onClick={handleEmail}
              disabled={verificationSent || isSendingMail}
              className={`btn btn-lg ${verificationSent || isSendingMail ? "" : "btn-nexoro-primary"} w-full sm:w-auto`}
            >
              {verificationSent ? (
                "Email Sent"
              ) : isSendingMail ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Send Verification Email"
              )}
            </button>
            <button
              type="button"
              onClick={handleCheckStatus}
              disabled={isCheckingStatus}
              className="btn btn-lg btn-outline w-full sm:w-auto"
            >
              {isCheckingStatus ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "I've Verified My Email"
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
      ) : (
        <AppForm>
          <form
            className="fieldset"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
          >
            {/* email & pass login */}
            {!isLogin && !isReset && (
              <AppField
                name="userName"
                children={(field) => (
                  <field.UsernameField
                    label="Full Name"
                    placeholder="ex: John Doe"
                  />
                )}
              />
            )}

            <AppField
              name="email"
              children={(field) => (
                <field.EmailField
                  label="Email"
                  placeholder="ex: user@email.com"
                />
              )}
            />

            {!isReset && (
              <AppField
                name="password"
                children={(field) => (
                  <field.PasswordField
                    label="Password"
                    placeholder="ex: ******"
                  />
                )}
              />
            )}

            {isLogin && (
              <Link href="/forget-password" className="text-sm text-purple-500">
                Forgot Password?
              </Link>
            )}

            <SubmitButton
              label={
                isLogin ? "Login" : isReset ? "Send Reset Link" : "Register"
              }
              isPending={isPending}
              className="btn-lg mt-4"
            />

            <p className="text-sm text-center text-balance">
              {isLogin
                ? "Don't Have an Account?"
                : isReset
                  ? "Remember Your Password?"
                  : "Already Have an Account?"}{" "}
              <Link
                href={isLogin ? "/register" : "/login"}
                className="link text-purple-500"
              >
                {isLogin ? "Register Now" : "Login Now"}
              </Link>
            </p>
          </form>
        </AppForm>
      )}
    </div>
  );
};

export default UserForm;
