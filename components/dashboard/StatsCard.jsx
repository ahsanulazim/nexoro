import Link from "next/link";
import { LuArrowDownRight, LuArrowUpRight, LuArrowRight } from "react-icons/lu";

const StatsCard = ({ status }) => {
  // বিজনেস ট্রেন্ড অনুযায়ী টেক্সট ও আইকন কালার ডিফাইন করা
  const trendColor = status.isGoodNews ? "text-success" : "text-error";
  const badgeColor = status.isGoodNews
    ? "bg-success/10 text-success"
    : "bg-error/10 text-error";

  return (
    <div className="border p-5 rounded-box border-base-300 bg-base-200 relative flex flex-col justify-between min-h-[160px]">
      <div>
        <h3 className="opacity-50 uppercase text-sm font-semibold tracking-wider">
          {status.title}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-3xl xl:text-4xl font-bold my-2 text-base-content">
            {status.count}
          </p>

          {status.comparison !== undefined && status.grow !== undefined && (
            <p
              className={`${trendColor} flex items-center text-sm font-medium gap-0.5`}
            >
              {status.grow ? <LuArrowUpRight /> : <LuArrowDownRight />}
              {Math.abs(status.comparison)}%
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Link
          href="#"
          className="link link-hover text-primary text-sm flex gap-1.5 items-center w-fit font-medium"
        >
          View All <LuArrowRight className="size-4" />
        </Link>
      </div>

      {/* আইকন কন্টেইনার এখন ডাইনামিক থিম কালার সাপোর্ট করবে */}
      <div
        className={`size-10 flex items-center justify-center rounded-box absolute top-5 right-5 ${badgeColor} font-semibold text-lg`}
      >
        {status.icon}
      </div>
    </div>
  );
};

export default StatsCard;
