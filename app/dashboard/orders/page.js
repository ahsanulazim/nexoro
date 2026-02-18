import DashBread from "@/components/dashboard/DashBread"
import OrderTable from "@/components/dashboard/order/OrderTable"
import Link from "next/link"
import { LuPlus } from "react-icons/lu"

const page = () => {
    return (
        <main>
            <section className="">
                <DashBread title="Orders" />
                <div className="flex items-center justify-between gap-5">
                    <h1 className="text-4xl font-semibold">Orders</h1>
                    <Link href="#"><button className="btn btn-primary btn-nexoro-primary"><LuPlus /> Add Order</button></Link>
                </div>
            </section>
            <section className="bg-base-300 rounded-box mt-5">
                <OrderTable />
            </section>
        </main>
    )
}

export default page