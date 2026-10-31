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
  Line,
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
    const earnings = payload.find((p) => p.dataKey === "earnings")?.value || 0;
    const expenses = payload.find((p) => p.dataKey === "expenses")?.value || 0;
    const dues = payload.find((p) => p.dataKey === "dues")?.value || 0;
    const netProfit = earnings - expenses;

    return (
      <div className="bg-base-100/95 backdrop-blur-md border border-base-content/10 shadow-2xl rounded-xl p-3 text-xs min-w-[170px] space-y-1.5 z-50">
        <p className="font-semibold text-base-content/80 border-b border-base-content/10 pb-1">
          {label}
        </p>
        <div className="flex items-center justify-between gap-3 text-primary">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#8c00ff]"></span>
            Revenue:
          </span>
          <span className="font-bold">৳{Number(earnings).toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-error">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f43f5e]"></span>
            Expenses:
          </span>
          <span className="font-bold">৳{Number(expenses).toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-base-content/80 border-t border-base-content/5 pt-1">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                netProfit >= 0 ? "bg-success" : "bg-error"
              }`}
            ></span>
            Net Profit:
          </span>
          <span
            className={`font-bold ${
              netProfit >= 0 ? "text-success" : "text-error"
            }`}
          >
            {netProfit >= 0 ? "+" : "-"}৳{Math.abs(netProfit).toLocaleString()}
          </span>
        </div>
        {dues > 0 && (
          <div className="flex items-center justify-between gap-3 text-warning">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
              Dues:
            </span>
            <span className="font-bold">৳{Number(dues).toLocaleString()}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const RevenueChart = ({ startDate = null, endDate = null, dateLabel = null }) => {
  const [range, setRange] = useState("1month");
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const isCustomActive = Boolean(startDate);

  const {
    data: chartResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["chartData", "revenue", range, startDate, endDate],
    queryFn: () => getChart(range, startDate, endDate),
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
    totalEarnings: chartData.reduce(
      (acc, curr) => acc + (curr.earnings || 0),
      0
    ),
    totalExpenses: chartData.reduce(
      (acc, curr) => acc + (curr.expenses || 0),
      0
    ),
    totalDues: chartData.reduce((acc, curr) => acc + (curr.dues || 0), 0),
    netProfit: chartData.reduce(
      (acc, curr) => acc + ((curr.earnings || 0) - (curr.expenses || 0)),
      0
    ),
  };

  const netProfit =
    summary.netProfit ??
    summary.totalEarnings - (summary.totalExpenses || 0);

  const maxBarSize =
    isCustomActive && chartData.length > 20
      ? 14
      : range === "1month"
      ? 14
      : range === "6month"
      ? 36
      : 24;

  const xAxisInterval =
    chartData.length > 25 ? 3 : chartData.length > 14 ? 1 : 0;

  return (
    <div className="w-full flex flex-col justify-between">
      {/* Chart Top Controls & KPIs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="badge badge-soft badge-primary text-xs font-semibold px-2.5 py-2">
            Revenue: ৳{(summary.totalEarnings || 0).toLocaleString()}
          </div>
          <div className="badge badge-soft badge-error text-xs font-semibold px-2.5 py-2">
            Expenses: ৳{(summary.totalExpenses || 0).toLocaleString()}
          </div>
          <div
            className={`badge badge-soft text-xs font-semibold px-2.5 py-2 ${
              netProfit >= 0 ? "badge-success" : "badge-error"
            }`}
          >
            Net: {netProfit >= 0 ? "+" : "-"}৳
            {Math.abs(netProfit).toLocaleString()}
          </div>
        </div>

        {/* Range Filter Buttons or Active Filter Pill */}
        {isCustomActive ? (
          <div className="badge badge-outline badge-primary text-xs font-medium px-2 py-1">
            📅 {dateLabel || "Custom Range"}
          </div>
        ) : (
          <div className="join bg-base-300/50 p-0.5 rounded-lg border border-base-content/10">
            {RANGES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={`join-item btn btn-xs border-0 ${
                  range === r.id
                    ? "btn-primary shadow-xs font-semibold"
                    : "btn-ghost opacity-70 hover:opacity-100"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div className="w-full h-80">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="loading loading-spinner loading-md text-primary"></span>
            <span className="text-xs opacity-60">
              Loading financial analytics...
            </span>
          </div>
        ) : isError ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-error">
            <span className="text-sm">Failed to load revenue data</span>
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
                <linearGradient
                  id="earningsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#8c00ff" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#8c00ff" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient
                  id="expensesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.3} />
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
                tickFormatter={(val) =>
                  val >= 1000000
                    ? `${(val / 1000000).toFixed(1)}M`
                    : val >= 1000
                    ? `${(val / 1000).toFixed(0)}k`
                    : val
                }
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
                dataKey="earnings"
                name="Revenue"
                fill="url(#earningsGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={maxBarSize}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="url(#expensesGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={maxBarSize}
              />
              <Line
                type="monotone"
                dataKey="dues"
                name="Dues"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 2.5, fill: "#f59e0b" }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
