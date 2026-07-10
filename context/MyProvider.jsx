"use client";

import { getChart } from "@/api/fetchAnalytics";
import { fetchClients } from "@/api/fetchClients";
import { fetchServices } from "@/api/fetchServices";
import { fetchMembers } from "@/api/fetchTeam";
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
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

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

  //team members data
  const {
    data: team,
    isLoading: teamLoading,
    isError: teamError,
  } = useQuery({
    queryKey: ["team"],
    queryFn: fetchMembers,
  });

  //connect socket function to handle socket function and online users updates

  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(process.env.NEXT_PUBLIC_API_BASE, {
      auth: {
        token: user?.accessToken,
      },
    });

    newSocket.on("connect", () => {
      console.log("Connected to server", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.log(`Connection Error: ${err.message}`);
    });

    newSocket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  };

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
    team,
    teamLoading,
    teamError,
  };

  return <MyContext value={data}>{children}</MyContext>;
};

export default MyProvider;
