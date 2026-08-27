"use client";
import { getOrder } from "@/api/fetchOrder";
import DashBread from "@/components/dashboard/DashBread";
import OrderAction from "@/components/dashboard/order/OrderAction";
import OrderAssign from "@/components/dashboard/order/OrderAssign";
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
                  <p>Service: {data.order.service.title}</p>
                  <p>
                    Plan: {data.order.plan.planName} - ${data.order.plan.price}
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
                  <div className="">
                    <p className="flex justify-between">
                      Total Amount:{" "}
                      <span className="font-semibold">
                        ${data.order.plan.price}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      Discount:{" "}
                      <span className="font-semibold">
                        ${data.order.discount || 0}
                      </span>
                    </p>
                    {data.order.amount && (
                      <p className="flex justify-between">
                        Paid:{" "}
                        <span className="font-semibold">
                          ${data.order.amount || 0}
                        </span>
                      </p>
                    )}
                    <div className="divider my-0.5"></div>
                    <p className="flex justify-between">
                      Grand Total:{" "}
                      <span className="font-semibold text-primary">
                        $
                        {data.order.plan.price -
                          ((data.order.discount || 0) +
                            (data.order.amount || 0))}
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
                  <p>{data.order.user.name}</p>
                  <p>Email: {data.order.user.email}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="p-5 bg-base-100 rounded-box">
              <h1 className="font-semibold">Order Actions</h1>
              <OrderAction order={data.order} />
            </div>
            <div className="p-5 bg-base-100 rounded-box mt-5">
              {data.order.assignedTo ? (
                <>
                  <div className="flex items-center gap-2">
                    <h1 className="font-semibold">Order Assigned to </h1>
                    <span className="badge badge-success badge-sm">
                      {data.order.assignedMember}
                    </span>
                  </div>
                  <ul className="mt-5 space-y-1 text-sm">
                    {data.order.tasks?.map((task, i) => (
                      <li key={i}>
                        <FaCircleCheck
                          className={`inline-block mr-2 ${task.isCompleted ? "text-success" : "opacity-50"}`}
                        />
                        {task.task}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h1 className="font-semibold">Order Assign</h1>
                  <OrderAssign order={data.order} />
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Order;
