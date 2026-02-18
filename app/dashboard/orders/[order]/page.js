import DashBread from "@/components/dashboard/DashBread"
import { LuBox } from "react-icons/lu"

const Order = async ({ params }) => {

    const { order } = await params;
    const orderData = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/orders/getOrder/${order}`).then(res => res.json());

    console.log(orderData);


    return (
        <main>
            <section className="">
                <DashBread title="Orders" subtitle="Order Details" />
            </section>
            <section className="grid lg:grid-cols-12 gap-5 items-start">
                <div className="p-5 bg-base-300 rounded-box lg:col-span-8">
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2"><LuBox /> Order Details</h1>
                        <p className="opacity-50 text-sm">Created on: {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="divider"></div>
                    <div className="flex gap-5 flex-col xl:flex-row">
                        <div className="bg-base-100 p-5 rounded-box xl:flex-1">
                            <h2 className="text-lg font-semibold uppercase">Items</h2>
                            <div className="opacity-50">
                                <p>Service: {orderData.order.service.title}</p>
                                <p>Plan: {orderData.order.plan.planName} - ${orderData.order.plan.price}</p>
                            </div>
                        </div>
                        <div className="bg-base-100 p-5 rounded-box xl:flex-1">
                            <h2 className="text-lg font-semibold uppercase">Customer Details</h2>
                            <div className="opacity-50">
                                <p>{orderData.order.user.name}</p>
                                <p>Email: {orderData.order.user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-5 bg-base-300 rounded-box lg:col-span-4">
                    <h1 className="font-semibold">Order Actions</h1>
                    <form className="fieldset mt-5">
                        <select className="select w-full mb-5" defaultValue="" name="status">
                            <option value="" disabled={true}>Select Status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                        </select>
                        <div className="flex gap-5">
                            <button type="submit" className="btn btn-success flex-1">Update Status</button>
                            <button className="btn btn-error flex-1">Cancel Order</button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    )
}

export default Order