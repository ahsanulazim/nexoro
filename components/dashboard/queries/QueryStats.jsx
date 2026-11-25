"use client";

import {
  LuCircleCheck,
  LuClock,
  LuMailQuestion,
  LuPhoneCall,
  LuStar,
} from "react-icons/lu";

export default function QueryStats({ counts = {}, activeFilter, onSelectFilter }) {
  const stats = [
    {
      id: "all",
      label: "Total Queries",
      value: counts.all || 0,
      icon: LuMailQuestion,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      id: "unread",
      label: "Needs Attention",
      value: counts.unread || 0,
      icon: LuClock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      badge: counts.unread > 0 ? "New" : null,
    },
    {
      id: "contacted",
      label: "Contacted",
      value: counts.contacted || 0,
      icon: LuPhoneCall,
      color: "text-info",
      bg: "bg-info/10",
      border: "border-info/20",
    },
    {
      id: "resolved",
      label: "Resolved",
      value: counts.resolved || 0,
      icon: LuCircleCheck,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/20",
    },
    {
      id: "starred",
      label: "Starred",
      value: counts.starred || 0,
      icon: LuStar,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      {stats.map((item) => {
        const Icon = item.icon;
        const isActive = activeFilter === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectFilter(item.id)}
            className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all text-left group cursor-pointer ${
              isActive
                ? "bg-base-100 border-primary ring-2 ring-primary/20 shadow-sm"
                : "bg-base-100/70 hover:bg-base-100 border-base-300 hover:border-base-content/20 shadow-2xs"
            }`}
          >
            <div
              className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${item.bg} ${item.color} transition-transform group-hover:scale-105`}
            >
              <Icon className="size-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs text-base-content/60 font-medium truncate">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="badge badge-xs badge-warning font-semibold">
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="text-xl font-bold text-base-content mt-0.5 tracking-tight">
                {item.value}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
