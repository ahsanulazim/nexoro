"use client";

import api from "@/axios/axiosInstance";
import { auth } from "@/firebase/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    // Firebase observer একবারই attach হবে
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoading(true);
        const email = user.email;
        try {
          const res = await api.get("users/getUser", {
            params: {
              email,
            },
          });
          setCurrentUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem("user");
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const refetchUser = async () => {
    const user = auth.currentUser;
    if (user) {
      const email = user.email;
      try {
        const res = await api.get("users/getUser", {
          params: {
            email,
          },
        });
        setCurrentUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        return res.data;
      } catch (error) {
        console.error("Error refetching user data:", error);
      }
    }
    return null;
  };

  const data = {
    currentUser,
    setCurrentUser,
    isLoading,
    refetchUser,
  };

  return <AuthContext value={data}>{children}</AuthContext>;
};

export default AuthProvider;
