"use client";

import auth from "@/firebase/firebase.config";
import { createContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user?.email) return;
    const email = user?.email;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      });
  }, [user]);

  const data = {
    isAdmin,
  };

  return <MyContext value={data}>{children}</MyContext>;
};

export default MyProvider;
