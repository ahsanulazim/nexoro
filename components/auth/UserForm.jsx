"use client";

import auth from "@/firebase/firebase.config";
import Link from "next/link";
import { LuKey, LuMail, LuUser } from "react-icons/lu";
import {
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { MyContext } from "@/context/MyProvider";
import { toast } from "react-toastify";

const UserForm = ({ login }) => {
  const { serverUrl } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [createUser, error] = useCreateUserWithEmailAndPassword(auth);
  const [signInUserWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [sendEmailVerification] = useSendEmailVerification(auth);
  const [updateProfile] = useUpdateProfile(auth);

  const handleGoogle = async () => {
    try {
      const res = await signInWithGoogle();
      if (res?.user) {
        // এখানে চাইলে Firestore এ ইউজারের ডেটা সেভ করতে পারেন
        const userName = res.user.displayName;
        const email = res.user.email;
        const google = true;
        const userRes = await fetch(`${serverUrl}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName,
            google,
            email,
          }),
        });
        const data = await userRes.json();
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;
    const pass = e.target.pass.value;
    await signInUserWithEmailAndPassword(email, pass);
    router.push("/dashboard");
    setLoading(false);
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userName = e.target.name.value;
    const email = e.target.email.value;
    const pass = e.target.pass.value;
    const userExists = await fetch(`${serverUrl}/users/${email}`);
    const userData = await userExists.json();
    if (userData.success) {
      setLoading(false);
      toast.error("User already exists!");
      return;
    }
    const res = await createUser(email, pass);
    const google = false;
    if (res?.user) {
      // Save username in Firebase Auth profile
      console.log(res.user);
      await updateProfile({ displayName: userName });
      await sendEmailVerification();
      //send Data to server
      const userRes = await fetch(`${serverUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          google,
          email,
        }),
      });
      const data = await userRes.json();
      router.push("/dashboard");
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-200 border-base-300 rounded-box w-full sm:max-w-lg border p-5 sm:p-10 mx-auto">
      <h1 className=" text-center font-semibold text-2xl sm:text-4xl mb-5">
        {login ? "Login" : "Register"}
      </h1>
      {/* Social Login */}
      <button
        className="btn bg-white text-black border-[#e5e5e5] grow py-6 rounded-lg w-full"
        onClick={handleGoogle}
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
      </button>
      <div className="divider">OR</div>

      <form
        className="fieldset"
        onSubmit={(e) => (login ? handleLogin(e) : handleRegister(e))}
      >
        {/* email & pass login */}
        {!login && (
          <>
            <label className="label text-sm" htmlFor="name">
              Full Name
            </label>
            <label className="input input-lg w-full validator">
              <LuUser className="size-4 opacity-50" />
              <input
                type="text"
                required
                placeholder="Name"
                name="name"
                pattern="[A-Za-z ]{3,30}"
                minLength="3"
                maxLength="30"
                title="Only letters"
              />
            </label>
            <p className="validator-hint hidden">
              Must be 3 to 30 characters
              <br />
              containing only letters
            </p>
          </>
        )}
        <label className="label text-sm" htmlFor="email">
          Email
        </label>
        <label className="input input-lg w-full validator">
          <LuMail className="size-4 opacity-50" />
          <input
            type="email"
            placeholder="mail@site.com"
            name="email"
            required
          />
        </label>
        <div className="validator-hint hidden">Enter valid email address</div>
        {/* Error message UI */}
        {error && (
          <p className="text-red-500 text-sm mt-2">
            {error.code === "auth/email-already-in-use"
              ? "This email is already registered. Try logging in with Google."
              : error.message}
          </p>
        )}

        <label className="label text-sm" htmlFor="pass">
          Password
        </label>
        <label className="input input-lg w-full validator">
          <LuKey className="opacity-50 size-4" />
          <input
            type="password"
            name="pass"
            required
            placeholder="Password"
            minLength="8"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
          />
        </label>
        <p className="validator-hint hidden">
          Must be more than 8 characters, including
          <br />
          At least one number <br />
          At least one lowercase letter <br />
          At least one uppercase letter
        </p>
        {login && (
          <Link href="#" className="text-sm text-purple-500">
            Forogot Password?
          </Link>
        )}

        <button
          className={`btn btn-primary btn-lg rounded-md ${!loading &&
            "bg-main hover:bg-main-dark hover:border-main-dark border-main"
            } mt-4 shadow-none`}
          disabled={loading ? true : false}
        >
          {login ? (
            loading ? (
              <>
                <span className="loading loading-spinner"></span>Login
              </>
            ) : (
              "Login"
            )
          ) : loading ? (
            <>
              <span className="loading loading-spinner"></span>Register
            </>
          ) : (
            "Register"
          )}
        </button>
        <p className="text-sm text-center text-balance">
          {login ? "Don't Have an Account?" : "Already Have an Account?"}{" "}
          <Link
            href={login ? "/register" : "/login"}
            className="link text-purple-500"
          >
            {login ? "Register Now" : "Login Now"}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default UserForm;
