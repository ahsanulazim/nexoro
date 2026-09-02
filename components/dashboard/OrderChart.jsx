"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getChart } from "@/api/fetchAnalytics";
import { useSocket } from "@/context/SocketProvider";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RANGES = [
  { id: "1month", label: "1 Month" },
  { id: "6month", label: "6 Months" },
  { id: "1year", label: "1 Year" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const orders = payload.find((p) => p.dataKey === "orders")?.value || 0;

    return (
      <div className="bg-base-100/95 backdrop-blur-md border border-base-content/10 shadow-2xl rounded-xl p-3 text-xs min-w-[130px] space-y-1.5 z-50">
        <p className="font-semibold text-base-content/80 border-b border-base-content/10 pb-1">
          {label}
        </p>
        <div className="flex items-center justify-between gap-3 text-[#00d390]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00d390]"></span>
            Orders:
          </span>
          <span className="font-bold text-sm">{orders}</span>
        </div>
      </div>
    );
  }
  return null;
};

const OrderChart = () => {
  const [range, setRange] = useState("1month");
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const {
    data: chartResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["chartData", "orders", range],
    queryFn: () => getChart(range),
    staleTime: 1000 * 60 * 5,
  });

  // Real-time chart invalidation on socket broadcasts
  useEffect(() => {
    if (!socket) return;

    const handleChartUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["chartData"] });
    };

    socket.on("chartDataUpdate", handleChartUpdate);
    socket.on("dashboardStatsUpdate", handleChartUpdate);

    return () => {
      socket.off("chartDataUpdate", handleChartUpdate);
      socket.off("dashboardStatsUpdate", handleChartUpdate);
    };
  }, [socket, queryClient]);

  const chartData = Array.isArray(chartResponse)
    ? chartResponse
    : chartResponse?.data || [];

  const summary = chartResponse?.summary || {
    totalOrders: chartData.reduce((acc, curr) => acc + (curr.orders || 0), 0),
  };

  const maxBarSize = range === "1month" ? 14 : range === "6month" ? 36 : 24;
  const xAxisInterval = range === "1month" ? 3 : 0;

  return (
    <div className="w-full flex flex-col justify-between">
      {/* Chart Top Controls & KPIs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div>
          <div className="badge badge-soft badge-accent text-xs font-semibold px-2.5 py-2">
            Total: {summary.totalOrders} Orders
          </div>
        </div>

        {/* Range Filter Buttons */}
        <div className="join bg-base-300/50 p-0.5 rounded-lg border border-base-content/10">
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`join-item btn btn-xs border-0 ${
                range === r.id
                  ? "btn-accent shadow-xs font-semibold text-white"
                  : "btn-ghost opacity-70 hover:opacity-100"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-80">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="loading loading-spinner loading-md text-accent"></span>
            <span className="text-xs opacity-60">
              Loading orders analytics...
            </span>
          </div>
        ) : isError ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-error">
            <span className="text-sm">Failed to load orders data</span>
            <button
              onClick={() => refetch()}
              className="btn btn-xs btn-outline btn-error"
            >
              Retry
            </button>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 15, right: 10, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d390" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#00d390" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="currentColor"
                className="opacity-10"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                interval={xAxisInterval}
                tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: "10px", fontSize: "12px" }}
              />
              <Bar
                dataKey="orders"
                name="Orders"
                fill="url(#ordersGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={maxBarSize}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default OrderChart;
