import { MyContext } from "@/context/MyProvider";
import { useContext } from "react";
import {
  Area,
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

const RevenueChart = () => {
  const { chartData, chartDataLoading, chartDataError } = useContext(MyContext);

  if (chartDataLoading) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (chartDataError) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center text-error">
        Failed to load chart data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart
        className="w-full max-h-100 aspect-[1.1618] mt-7.5 mb-1.5"
        data={chartData}
      >
        <CartesianGrid strokeDasharray="8" vertical={false} />
        <XAxis dataKey="name" axisLine={false} />
        <YAxis width="auto" axisLine={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="earnings" stackId="a" fill="#8c00ff" barSize={50} />
        <Line dataKey="dues" stroke="#ff637d" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
