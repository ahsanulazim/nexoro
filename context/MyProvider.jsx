"use client";

import auth from "@/firebase/firebase.config";
import { createContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user?.email) return;
    const email = user?.email;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.role === "admin") {
          setIsAdmin(true);
        } else if (data?.user?.role === "employee") {
          setIsEmployee(true);
        } else if (data?.user?.role === "member") {
          setIsMember(true);
        }
        else {
          setIsAdmin(false);
          setIsEmployee(false);
          setIsMember(false);
        }
      });
  }, [user]);

  const data = {
    isAdmin, isEmployee, isMember
  };

  return <MyContext value={data}>{children}</MyContext>;
};

export default MyProvider;
