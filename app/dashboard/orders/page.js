import OrderTable from "@/components/dashboard/order/OrderTable"

const page = () => {
    return (
        <main>
            <h2 className="font-semibold text-2xl">Orders</h2>
            <section className="bg-base-300 rounded-box mt-5">
                <OrderTable />
            </section>
        </main>
    )
}

export default page