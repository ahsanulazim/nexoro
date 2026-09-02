import { getRecentOrders } from "@/api/fetchAnalytics";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

const RecentOrderData = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recentOrders"],
    queryFn: getRecentOrders,
  });

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead className="">
          <tr>
            <th>Order ID</th>
            <th>Name</th>
            <th>Service</th>
            <th>Payment Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan="5">Error fetching recent orders</td>
            </tr>
          ) : data?.length === 0 ? (
            <tr>
              <td colSpan="5">No recent orders</td>
            </tr>
          ) : (
            data.map((order) => (
              <tr key={order._id}>
                <td>{order.orderUid}</td>
                <td>{order.userName}</td>
                <td>{order.serviceTitle}</td>
                <td>
                  <span
                    className={`badge ${
                      order.payment === "Success"
                        ? "badge-success"
                        : order.payment === "Partial"
                          ? "badge-warning"
                          : "badge-error"
                    }`}
                  >
                    {order.payment}
                  </span>
                </td>
                <td>{moment(order.createdAt).format("MMM Do, YY")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrderData;
