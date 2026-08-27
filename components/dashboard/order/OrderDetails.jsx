import moment from "moment";
import { LuBox } from "react-icons/lu";
import OrderAction from "./OrderAction";
import OrderAssign from "./OrderAssign";

const OrderDetails = () => {
  return (
    <section className="grid lg:grid-cols-12 gap-5 items-start">
      <div className="p-5 bg-base-100 rounded-box lg:col-span-8">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <LuBox /> Order Details
          </h1>
          <p className="opacity-50 text-sm">
            Created on: {moment(orderData.order?.createdAt).format("LLL")}
          </p>
        </div>
        <div className="divider"></div>
        <div className="flex gap-5 flex-col xl:flex-row">
          <div className="bg-base-200 p-5 rounded-box xl:flex-1">
            <h2 className="text-lg font-semibold uppercase">Items</h2>
            <div className="opacity-50">
              <p>Service: {orderData.order.service.title}</p>
              <p>
                Plan: {orderData.order.plan.planName} - $
                {orderData.order.plan.price}
              </p>
            </div>
            <div className="mt-5 bg-base-300 p-5 rounded-box">
              <h2 className="text-lg font-semibold uppercase">
                Payment Details{" "}
                <span
                  className={`badge badge-sm ${
                    orderData.order.payment === "Success"
                      ? "badge-success"
                      : orderData.order.payment === "Pending"
                        ? "badge-error"
                        : "badge-warning"
                  }`}
                >
                  {orderData.order.payment}
                </span>
              </h2>
              <div className="">
                <p className="flex justify-between">
                  Total Amount:{" "}
                  <span className="font-semibold">
                    ${orderData.order.plan.price}
                  </span>
                </p>
                <p className="flex justify-between">
                  Discount:{" "}
                  <span className="font-semibold">
                    ${orderData.order.discount || 0}
                  </span>
                </p>
                {orderData.order.amount && (
                  <p className="flex justify-between">
                    Paid:{" "}
                    <span className="font-semibold">
                      ${orderData.order.amount || 0}
                    </span>
                  </p>
                )}
                <div className="divider my-0.5"></div>
                <p className="flex justify-between">
                  Grand Total:{" "}
                  <span className="font-semibold text-primary">
                    $
                    {orderData.order.plan.price -
                      ((orderData.order.discount || 0) +
                        (orderData.order.amount || 0))}
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
              <p>{orderData.order.user.name}</p>
              <p>Email: {orderData.order.user.email}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-4">
        <div className="p-5 bg-base-100 rounded-box">
          <h1 className="font-semibold">Order Actions</h1>
          <OrderAction order={orderData.order} />
        </div>
        <div className="p-5 bg-base-100 rounded-box mt-5">
          {orderData.order.assignedTo ? (
            <>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold">Order Assigned to </h1>
                <span className="badge badge-success badge-sm">
                  {orderData.order.assignedMember}
                </span>
              </div>
              <ul className="mt-5 space-y-1 text-sm">
                {orderData.order.tasks?.map((task, i) => (
                  <li key={i}>{task.task}</li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h1 className="font-semibold">Order Assign</h1>
              <OrderAssign order={orderData.order} />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default OrderDetails;
