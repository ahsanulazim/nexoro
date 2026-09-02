import { useDashTheme } from "@/context/DashThemeProvider";
import { LuArrowDown, LuArrowUp } from "react-icons/lu";

const StatsCard = ({
  title,
  count,
  stat,
  icon,
  isLoading = false,
  inverseTone = false, // if true, decrease is good (e.g., expenses or pending)
}) => {
  const { isDark } = useDashTheme();
  if (isLoading) {
    return (
      <div className="card card-border bg-base-100 animate-pulse">
        <div className="p-6">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-3 flex-1">
              <div className="h-4 bg-base-300 rounded w-24"></div>
              <div className="h-7 bg-base-300 rounded w-16"></div>
              <div className="h-4 bg-base-300 rounded w-32"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-base-300"></div>
          </div>
        </div>
      </div>
    );
  }

  const isIncrease = stat?.isIncrease ?? true;
  const percentage = stat?.text || "0%";

  // Decide badge styling: usually up is success, unless inverseTone is true
  const isPositive = inverseTone ? !isIncrease : isIncrease;
  const badgeClass = isPositive ? "badge-success" : "badge-error";

  return (
    <div className="card card-border bg-base-100 hover:shadow-md transition-all duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start gap-5">
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-base-content/70">
              {title}
            </h2>

            <h3 className="card-title text-2xl font-bold tracking-tight">
              {count ?? stat?.total ?? 0}
            </h3>

            <p className="text-xs text-base-content/60 flex items-center gap-1.5 flex-wrap">
              <span
                className={`badge ${badgeClass} badge-sm badge-soft gap-1 font-semibold`}
              >
                {isIncrease ? <LuArrowUp /> : <LuArrowDown />}
                {percentage}
              </span>
              <span>since last month</span>
            </p>
          </div>

          <div className="avatar avatar-placeholder shrink-0">
            <div
              className={`w-11 h-11 rounded-xl ${isDark ? "bg-main-dark/20 text-main-light" : "bg-main-light/20 text-main-dark"}`}
            >
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
