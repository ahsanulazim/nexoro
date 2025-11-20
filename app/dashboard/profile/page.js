"use client";

import DashBread from "@/components/dashboard/DashBread";
import AccountInfo from "@/components/dashboard/profile/AccountInfo";
import auth from "@/firebase/firebase.config";
import profiledata from "@/json/profiledata.json";
import { userInfo } from "@/utils/userInfo";
import { useAuthState } from "react-firebase-hooks/auth";

const Profile = () => {
  const [user] = useAuthState(auth);
  const userData = userInfo(user);

  return (
    <main className="flex flex-col gap-4">
      <section className="">
        <DashBread title="Profile" />
        <h1 className="text-4xl font-semibold">Profile</h1>
      </section>
      {profiledata.map((data) => (
        <AccountInfo key={data.id} data={data} value={userData} />
      ))}
    </main>
  );
};

export default Profile;
