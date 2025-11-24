"use client";

import PasswordInput from "@/components/dashboard/settings/PasswordInput";
import auth from "@/firebase/firebase.config";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { LuKey } from "react-icons/lu";
import { toast } from "react-toastify";

const Page = () => {
  const [user] = useAuthState(auth);
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [matchError, setMatchError] = useState(false)
  const [loading, setLoading] = useState(false)

  const changePassword = async (e) => {
    e.preventDefault();
    setMatchError(false)
    setLoading(true)
    if (newPassword === confirmPassword) {
      try {
        // Step 1: re-authenticate
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);

        // Step 2: update password
        await updatePassword(user, newPassword);
        setLoading(false)
        toast.success("Password updated successfully!");
      } catch (error) {
        setLoading(false)
        toast.error("Wrong Current Password");
      }
    } else {
      setMatchError(true)
      setLoading(false)
    }

  };

  return (
    <>
      <h2 className="text-xl xs:text-2xl font-semibold flex items-center gap-2">
        <LuKey />
        Change Password
      </h2>
      <form onSubmit={changePassword} className="fieldset max-w-sm mt-5">
        <PasswordInput
          label="Current Password"
          name="currentPass"
          placeholder="Type Your Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <PasswordInput
          label="New Password"
          name="newPass"
          placeholder="Type Your New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {matchError && <p role="alert" className="alert alert-error mb-2">
          Passwords Do not Match!
        </p>}
        <PasswordInput
          label="Confirm Password"
          name="confirmPass"
          placeholder="Type Your New Password Again"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {matchError && <p role="alert" className="alert alert-error mb-2">
          Passwords Do not Match!
        </p>}
        <button
          type="submit"
          className="btn btn-primary shadow-none bg-main hover:bg-main-dark border-main hover:border-main-dark"
        >
          Change Password
        </button>
      </form>
    </>
  );
};

export default Page;
