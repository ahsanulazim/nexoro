import { createContext, useContext, useEffect, useState } from "react";

const DashThemeContext = createContext();

export const useDashTheme = () => {
  const context = useContext(DashThemeContext);
  if (!context) {
    throw new Error("useDashTheme must be used within a DashThemeProvider");
  }
  return context;
};

export const DashThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedIsDark = localStorage.getItem("isDark");
    if (storedIsDark !== null) {
      setIsDark(storedIsDark === "true");
    }
  }, []);

  useEffect(() => {
    const dashboard = document.getElementById("nexoro-dashboard");
    if (dashboard) {
      dashboard.setAttribute("data-theme", isDark ? "dark" : "light");
    }
  }, [isDark]);

  const data = {
    isDark,
    setIsDark,
  };

  return <DashThemeContext value={data}>{children}</DashThemeContext>;
};
