import { useDashTheme } from "@/context/DashThemeProvider";
import { LuArrowDown, LuArrowUp } from "react-icons/lu";

const StatsCard = ({
  title,
  count,
  stat,
  icon,
  isLoading = false,
  inverseTone = false, // if true, decrease is good (e.g., expenses or pending)
  isCurrency = false, // if true, formats with ৳ and locale numbers
  subtext, // optional custom subtext / breakdown
  badgeText, // optional custom badge text override
  badgeVariant, // optional badge variant override ("success" | "error" | "warning" | "info")
  highlight, // optional card highlight border/shadow ("success" | "error" | "primary")
}) => {
  const { isDark } = useDashTheme();

  if (isLoading) {
    return (
      <div className="card card-border bg-base-100 animate-pulse">
        <div className="p-5 sm:p-6">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-3 flex-1">
              <div className="h-4 bg-base-300 rounded w-24"></div>
              <div className="h-7 bg-base-300 rounded w-28"></div>
              <div className="h-3 bg-base-300 rounded w-36"></div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-base-300"></div>
          </div>
        </div>
      </div>
    );
  }

  const rawValue = count ?? stat?.total ?? 0;
  const numValue = Number(rawValue) || 0;

  // Format main stat value
  let formattedValue;
  if (isCurrency) {
    if (numValue < 0) {
      formattedValue = `-৳${Math.abs(numValue).toLocaleString()}`;
    } else {
      formattedValue = `৳${numValue.toLocaleString()}`;
    }
  } else {
    formattedValue = typeof rawValue === "number" ? rawValue.toLocaleString() : rawValue;
  }

  const isIncrease = stat?.isIncrease ?? true;
  const percentage = stat?.text || "0%";

  // Decide badge styling: usually up is success, unless inverseTone is true
  const isPositive = inverseTone ? !isIncrease : isIncrease;
  const defaultBadgeClass = isPositive ? "badge-success" : "badge-error";
  const finalBadgeClass = badgeVariant ? `badge-${badgeVariant}` : defaultBadgeClass;

  // Highlight border classes
  let highlightClass = "";
  if (highlight === "success") {
    highlightClass = "border-success/30 hover:border-success/60 shadow-success/5";
  } else if (highlight === "error") {
    highlightClass = "border-error/30 hover:border-error/60 shadow-error/5";
  } else if (highlight === "primary") {
    highlightClass = "border-primary/30 hover:border-primary/60 shadow-primary/5";
  }

  return (
    <div
      className={`card card-border bg-base-100 hover:shadow-md transition-all duration-200 ${highlightClass}`}
    >
      <div className="p-5 sm:p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <h2 className="text-xs sm:text-sm font-medium text-base-content/70 truncate">
              {title}
            </h2>

            <h3 className="card-title text-xl sm:text-2xl font-bold tracking-tight truncate">
              {formattedValue}
            </h3>

            <div className="text-xs text-base-content/60 flex items-center gap-1.5 flex-wrap">
              <span
                className={`badge ${finalBadgeClass} badge-sm badge-soft gap-1 font-semibold`}
              >
                {!badgeText && (isIncrease ? <LuArrowUp /> : <LuArrowDown />)}
                {badgeText || percentage}
              </span>
              {!badgeText && <span>since last month</span>}
            </div>

            {subtext && (
              <p className="text-[11px] text-base-content/50 truncate pt-0.5 border-t border-base-200/60 mt-1.5">
                {subtext}
              </p>
            )}
          </div>

          <div className="avatar avatar-placeholder shrink-0">
            <div
              className={`w-11 h-11 rounded-xl text-lg flex items-center justify-center ${
                isDark
                  ? "bg-main-dark/20 text-main-light"
                  : "bg-main-light/20 text-main-dark"
              }`}
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

