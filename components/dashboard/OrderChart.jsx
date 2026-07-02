import { MyContext } from "@/context/MyProvider";
import { useContext } from "react";
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

const OrderChart = () => {
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
        <Bar dataKey="orders" stackId="a" fill="#00d390" barSize={50} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default OrderChart;
