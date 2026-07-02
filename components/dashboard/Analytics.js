import {
  LuBanknote,
  LuBox,
  LuCircleDollarSign,
  LuLayers,
  LuPackageCheck,
  LuUser,
} from "react-icons/lu";
import { TbFileShredder } from "react-icons/tb";

const calcComparison = (current, previous) => {
  if (!previous || previous === 0) {
    return current > 0 ? "100" : "0";
  }
  const diff = ((current - previous) / previous) * 100;
  return diff.toFixed(1); // দশমিকের পর ১ ঘর ফিক্সড
};

export const transformAnalytics = (data) => {
  if (!data) return [];

  return [
    {
      id: "total",
      title: "Total Orders",
      count: data?.current?.total || 0,
      comparison: calcComparison(data?.current?.total, data?.previous?.total),
      grow: data?.current?.total >= data?.previous?.total,
      isGoodNews: data?.current?.total >= data?.previous?.total, // পজিটিভ গ্রোথ
      icon: <LuBox />,
    },
    {
      id: "pending",
      title: "Pending Orders",
      count: data?.current?.pending || 0,
      comparison: calcComparison(
        data?.current?.pending,
        data?.previous?.pending,
      ),
      grow: data?.current?.pending !== data?.previous?.pending,
      isGoodNews: data?.current?.pending <= data?.previous?.pending, // পেন্ডিং কমা ভালো
      icon: <LuLayers />,
    },
    {
      id: "completed",
      title: "Completed Orders",
      count: data?.current?.completed || 0,
      comparison: calcComparison(
        data?.current?.completed,
        data?.previous?.completed,
      ),
      grow: data?.current?.completed >= data?.previous?.completed,
      isGoodNews: data?.current?.completed >= data?.previous?.completed, // কমপ্লিটেড বাড়া ভালো
      icon: <LuPackageCheck />,
    },
    {
      id: "cancelled",
      title: "Cancelled Orders",
      count: data?.current?.cancelled || 0,
      comparison: calcComparison(
        data?.current?.cancelled,
        data?.previous?.cancelled,
      ),
      grow: data?.current?.cancelled !== data?.previous?.cancelled,
      isGoodNews: data?.current?.cancelled <= data?.previous?.cancelled, // ক্যান্সেল কমা ভালো
      icon: <TbFileShredder />,
    },
    {
      id: "earning",
      title: "Total Earning",
      count: `$${data?.current?.totalEarning || 0}`,
      comparison: calcComparison(
        data?.current?.totalEarning,
        data?.previous?.totalEarning,
      ),
      grow: data?.current?.totalEarning >= data?.previous?.totalEarning,
      isGoodNews: data?.current?.totalEarning >= data?.previous?.totalEarning,
      icon: <LuCircleDollarSign />,
    },
    {
      id: "due",
      title: "Total Dues",
      count: `$${data?.current?.dueAmount || 0}`,
      comparison: calcComparison(
        data?.current?.dueAmount,
        data?.previous?.dueAmount,
      ),
      grow: data?.current?.dueAmount !== data?.previous?.dueAmount,
      isGoodNews: data?.current?.dueAmount <= data?.previous?.dueAmount, // ডিউ কমা ভালো
      icon: <LuBanknote />,
    },
    {
      id: "users",
      title: "Total Users",
      count: data?.users || 0,
      icon: <LuUser />,
    },
  ];
};
