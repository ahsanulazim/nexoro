"use client";
import { getOrder } from "@/api/fetchOrder";
import DashBread from "@/components/dashboard/DashBread";
import OrderAction from "@/components/dashboard/order/OrderAction";
import OrderTaskManagement from "@/components/dashboard/order/OrderTaskManagement";
import OrderCostManagement from "@/components/dashboard/order/OrderCostManagement";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useParams } from "next/navigation";
import { FaCircleCheck } from "react-icons/fa6";
import { LuBox } from "react-icons/lu";

const Order = () => {
  const { order } = useParams();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["order", order],
    queryFn: getOrder,
    placeholderData: keepPreviousData,
  });

  const orderPrice = Number(
    data?.order?.servicePrice ??
      data?.order?.price ??
      data?.order?.plan?.price ??
      0,
  );
  const discount = Number(data?.order?.discount || 0);
  const paidAmount = Number(data?.order?.amount || 0);
  const totalCost = Number(
    data?.order?.totalCost ??
      (data?.order?.costs?.reduce(
        (acc, c) => acc + (Number(c.amount) || 0),
        0,
      ) || 0),
  );
  const netRevenue = Math.max(0, orderPrice - discount) - totalCost;

  return (
    <main>
      <section className="">
        <DashBread title="Orders" subtitle="Order Details" />
      </section>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error</p>
      ) : (
        <section className="grid lg:grid-cols-12 gap-5 items-start">
          <div className="p-5 bg-base-100 rounded-box lg:col-span-8">
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <LuBox /> Order Details
              </h1>
              <p className="opacity-50 text-sm">
                Created on: {moment(data.order?.createdAt).format("LLL")}
              </p>
            </div>
            <div className="divider"></div>
            <div className="flex gap-5 flex-col xl:flex-row">
              <div className="bg-base-200 p-5 rounded-box xl:flex-1">
                <h2 className="text-lg font-semibold uppercase">Items</h2>
                <div className="opacity-50">
                  <p>
                    Service:{" "}
                    {data.order.service?.title ||
                      data.order.serviceName ||
                      data.order.service}
                  </p>
                  <p>
                    Plan: {data.order.plan?.planName || "Custom Plan"} - ৳
                    {data.order.price ?? data.order.plan?.price ?? 0}
                  </p>
                </div>
                <div className="mt-5 bg-base-300 p-5 rounded-box">
                  <h2 className="text-lg font-semibold uppercase">
                    Payment Details{" "}
                    <span
                      className={`badge badge-sm ${
                        data.order.payment === "Success"
                          ? "badge-success"
                          : data.order.payment === "Pending"
                            ? "badge-error"
                            : "badge-warning"
                      }`}
                    >
                      {data.order.payment}
                    </span>
                  </h2>
                  <div className="space-y-1">
                    <p className="flex justify-between">
                      Total Amount:{" "}
                      <span className="font-semibold">
                        ৳{data.order.price ?? data.order.plan?.price ?? 0}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      Discount:{" "}
                      <span className="font-semibold">
                        ৳{data.order.discount || 0}
                      </span>
                    </p>
                    {data.order.amount ? (
                      <p className="flex justify-between">
                        Paid:{" "}
                        <span className="font-semibold">
                          ৳{data.order.amount || 0}
                        </span>
                      </p>
                    ) : null}
                    <div className="divider my-0.5"></div>
                    <p className="flex justify-between">
                      Due Amount:{" "}
                      <span className="font-semibold text-primary">
                        ৳
                        {Math.max(
                          0,
                          (data.order.price ?? data.order.plan?.price ?? 0) -
                            ((data.order.discount || 0) +
                              (data.order.amount || 0)),
                        )}
                      </span>
                    </p>
                    {totalCost > 0 && (
                      <p className="flex justify-between text-error">
                        Project Cost:{" "}
                        <span className="font-semibold">
                          -৳{totalCost.toLocaleString()}
                        </span>
                      </p>
                    )}
                    <p className="flex justify-between border-t border-base-content/10 pt-1">
                      Net Revenue:{" "}
                      <span
                        className={`font-semibold ${
                          netRevenue >= 0 ? "text-success" : "text-error"
                        }`}
                      >
                        ৳{netRevenue.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-base-200 p-5 rounded-box xl:flex-1">
                <h2 className="text-lg font-semibold uppercase">
                  Customer Details
                </h2>
                <div className="opacity-50">
                  <p>
                    {data.order.user?.name ||
                      data.order.clientName ||
                      data.order.epsData?.CustomerName ||
                      "Unknown User"}
                  </p>
                  <p>Email: {data.order.user?.email || "No email"}</p>
                </div>
              </div>
            </div>

            <div className="divider my-5"></div>

            {/* Project Cost & Revenue Management */}
            <OrderCostManagement order={data.order} />
          </div>
          <div className="lg:col-span-4">
            <div className="p-5 bg-base-100 rounded-box">
              <h1 className="font-semibold">Order Actions</h1>
              <OrderAction order={data.order} />
            </div>
            <div className="p-5 bg-base-100 rounded-box mt-5">
              <OrderTaskManagement order={data.order} />
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Order;
