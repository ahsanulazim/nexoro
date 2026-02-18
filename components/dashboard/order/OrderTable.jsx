'use client'

import { fetchAllOrders } from "@/api/fetchCart";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { LuEye, LuTrash2 } from "react-icons/lu";

const OrderTable = () => {

    const { data: orders, isLoading, isError } = useQuery({
        queryKey: ["orders"],
        queryFn: fetchAllOrders,
    });

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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan={7} className="text-center">Loading...</td></tr> : isError ? <tr><td colSpan={7} className="text-center">Error fetching orders</td></tr> : orders.orders.map((order) => (
                            <tr key={order.orderId}>
                                <th><Link className="link link-hover" href={`/dashboard/orders/${order.orderId}`}>{order.orderUid}</Link></th>
                                <td>{order.userName}</td>
                                <td>
                                    <h2>{order.serviceTitle}</h2>
                                    <p className="font-semibold">{order.planName} - ${order.planPrice}</p>
                                </td>
                                <td><p className="badge badge-info">{order.status}</p></td>
                                <td>{moment(order.createdAt).format("Do MMM, YYYY")}</td>
                                <td>
                                    <Link href={`/dashboard/orders/${order.orderId}`}><button className="btn btn-success btn-soft btn-circle"><LuEye /></button></Link>
                                    <button className="btn btn-error btn-soft btn-circle ml-2"><LuTrash2 /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default OrderTable