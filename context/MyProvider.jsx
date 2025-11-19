"use client";

import { createContext } from "react";

export const MyContext = createContext();

const MyProvider = ({ children }) => {
  const serverUrl = process.env.NEXT_PUBLIC_API_BASE;

  const data = {
    serverUrl,
  };

  return <MyContext value={data}>{children}</MyContext>;
};

export default MyProvider;
