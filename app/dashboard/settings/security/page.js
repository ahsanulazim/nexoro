"use client";

import PasswordInput from "@/components/dashboard/settings/PasswordInput";
import auth from "@/firebase/firebase.config";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { LuKey } from "react-icons/lu";
import { toast } from "react-toastify";

const Page = () => {
  const [user] = useAuthState(auth);

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      // Step 1: re-authenticate
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Step 2: update password
      await updatePassword(user, newPassword);
      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error("Error updating password:", error.code, error.message);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <LuKey />
        Change Password
      </h2>
      <form onSubmit={changePassword} className="fieldset max-w-sm">
        <PasswordInput
          label="Current Password"
          name="currentPass"
          placeholder="Type Your Current Password"
        />
        <PasswordInput
          label="New Password"
          name="newPass"
          placeholder="Type Your New Password"
        />
        <PasswordInput
          label="Confirm Password"
          name="confirmPass"
          placeholder="Type Your New Password Again"
        />
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
