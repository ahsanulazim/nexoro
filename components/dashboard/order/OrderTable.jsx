'use client'

import { fetchAllOrders } from "@/api/fetchCart";
import { useQuery } from "@tanstack/react-query";

const OrderTable = () => {

    const { data: orders, isLoading, isError } = useQuery({
        queryKey: ["orders"],
        queryFn: fetchAllOrders,
    });

    console.log(orders);


    return (
        <>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Name</th>
                            <th>Service</th>
                            <th>Delivery Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan={7} className="text-center">Loading...</td></tr> : isError ? <tr><td colSpan={7} className="text-center">Error fetching orders</td></tr> : orders.orders.map((order) => (
                            <tr key={order.orderId}>
                                <th>{order.orderId}</th>
                                <td>{order.userName}</td>
                                <td>{order.serviceTitle}</td>
                                <td>{order.status}</td>
                                <td>{order.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default OrderTable