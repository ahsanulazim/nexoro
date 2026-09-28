"use client";

import { LuBuilding2, LuGlobe, LuSparkles, LuUsers } from "react-icons/lu";

const ClientStats = ({
  clients = [],
  filteredCount = 0,
  isFiltered = false,
  statsData = null,
}) => {
  const totalClients = statsData?.totalClients ?? clients.length;

  const totalCompanies =
    statsData?.totalCompanies ??
    new Set(
      clients.map((c) => c?.company?.trim()?.toLowerCase()).filter(Boolean),
    ).size;

  const totalCountries =
    statsData?.totalCountries ??
    new Set(
      clients.map((c) => c?.country?.trim()?.toLowerCase()).filter(Boolean),
    ).size;

  // New clients added in the last 30 days
  const recentClients =
    statsData?.recentClients ??
    clients.filter((c) => {
      const dateStr = c.joined || c.createdAt;
      if (!dateStr) return false;
      const date = new Date(dateStr);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date >= thirtyDaysAgo;
    }).length;

  const stats = [
    {
      title: "Total Clients",
      value: totalClients,
      subtitle: isFiltered
        ? `${filteredCount} currently shown`
        : "All registered clients",
      icon: <LuUsers className="size-5" />,
      colorClass: "bg-primary/10 text-primary",
      borderColor: "border-primary/20",
    },
    {
      title: "Companies",
      value: totalCompanies,
      subtitle: "Unique organizations",
      icon: <LuBuilding2 className="size-5" />,
      colorClass: "bg-blue-500/10 text-blue-500",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Global Reach",
      value: totalCountries,
      subtitle: "Countries represented",
      icon: <LuGlobe className="size-5" />,
      colorClass: "bg-emerald-500/10 text-emerald-500",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Recently Added",
      value: recentClients,
      subtitle: "In the last 30 days",
      icon: <LuSparkles className="size-5" />,
      colorClass: "bg-amber-500/10 text-amber-500",
      borderColor: "border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-base-100 p-4 rounded-2xl border border-base-200/80 shadow-xs hover:shadow-md transition-shadow duration-200 flex items-center justify-between gap-3"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-base-content/60">
              {stat.title}
            </p>
            <h3 className="text-2xl font-bold text-base-content mt-0.5">
              {stat.value}
            </h3>
            <p className="text-[11px] text-base-content/50 mt-0.5">
              {stat.subtitle}
            </p>
          </div>
          <div
            className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${stat.colorClass}`}
          >
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientStats;
