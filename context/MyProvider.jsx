"use client";

import { getChart } from "@/api/fetchAnalytics";
import { fetchClients } from "@/api/fetchClients";
import { fetchServices } from "@/api/fetchServices";
import { auth } from "@/firebase/firebase.config";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [user] = useAuthState(auth);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    if (!user?.email) return;
    const email = user?.email;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/getUser?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.role === "admin") {
          setIsAdmin(true);
        } else if (data?.user?.role === "employee") {
          setIsEmployee(true);
        } else if (data?.user?.role === "member") {
          setIsMember(true);
        } else {
          setIsAdmin(false);
          setIsEmployee(false);
          setIsMember(false);
        }
      });
  }, [user]);

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

  const data = {
    isAdmin,
    isEmployee,
    isMember,
    cart,
    setCart,
    user,
    clientData,
    clientDataLoading,
    clientDataError,
    services,
    servicesLoading,
    servicesError,
    chartData,
    chartDataLoading,
    chartDataError,
  };

  return <MyContext value={data}>{children}</MyContext>;
};

export default MyProvider;
