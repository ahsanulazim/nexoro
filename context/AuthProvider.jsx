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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      try {
        if (user) {
          const token = await user.getIdToken();
          const res = await api.get(`/users/getUser`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCurrentUser(res.data);
          console.log(res.data);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.log(error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const data = {
    currentUser,
    setCurrentUser,
    isLoading,
  };

  return <AuthContext value={data}>{children}</AuthContext>;
};

export default AuthProvider;
