"use client";

import { getChart } from "@/api/fetchAnalytics";
import { fetchClients } from "@/api/fetchClients";
import { fetchServices } from "@/api/fetchServices";
import { fetchMembers } from "@/api/fetchTeam";
import api from "@/axios/axiosInstance";
import { auth } from "@/firebase/firebase.config";
import { useQuery } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

export const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    // Firebase observer একবারই attach হবে
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      if (user) {
        const email = user.email;
        try {
          const res = await api.get("/users/getUser", {
            params: {
              email,
            },
          });
          setCurrentUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
          setLoading(false);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // It's a new registration, the user is not in the database yet.
            // UserForm will handle setting the user after calling createUser API.
            console.log("New user registered, waiting for DB sync...");
            setLoading(false);
          } else {
            console.error("Error fetching user data:", error);
            setLoading(false);
          }
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem("user");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  //client Data
  const {
    data: clientData,
    isLoading: clientDataLoading,
    isError: clientDataError,
  } = useQuery({
    queryKey: ["clientData"],
    queryFn: fetchClients,
  });

  //services data
  const {
    data: services,
    isLoading: servicesLoading,
    isError: servicesError,
  } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  //chart Data
  const {
    data: chartData,
    isLoading: chartDataLoading,
    isError: chartDataError,
  } = useQuery({
    queryKey: ["chart"],
    queryFn: getChart,
  });

  //team members data
  const {
    data: team,
    isLoading: teamLoading,
    isError: teamError,
  } = useQuery({
    queryKey: ["team"],
    queryFn: fetchMembers,
  });

  const data = {
    cart,
    setCart,
    currentUser,
    loading,
    clientData,
    clientDataLoading,
    clientDataError,
    services,
    servicesLoading,
    servicesError,
    chartData,
    chartDataLoading,
    chartDataError,
    team,
    teamLoading,
    teamError,
  };

  return <MyContext value={data}>{children}</MyContext>;
};

export default MyProvider;
