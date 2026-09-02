"use client";

import { getChart } from "@/api/fetchAnalytics";
import { fetchClients } from "@/api/fetchClients";
import { fetchServices } from "@/api/fetchServices";
import { fetchMembers } from "@/api/fetchTeam";
import { useQuery } from "@tanstack/react-query";
import { createContext, useState } from "react";

export const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
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
    data: chartResponse,
    isLoading: chartDataLoading,
    isError: chartDataError,
  } = useQuery({
    queryKey: ["chart"],
    queryFn: () => getChart("1month"),
  });

  const chartData = Array.isArray(chartResponse)
    ? chartResponse
    : chartResponse?.data || [];

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
