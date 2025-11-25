import ClientsTable from "@/components/dashboard/clients/ClientsTable"
import DashBread from "@/components/dashboard/DashBread"

const page = () => {
    return (
        <main className="flex flex-col gap-4">
            <section className="">
                <DashBread title="Clients" />
                <h1 className="text-4xl font-semibold">Clients</h1>
            </section>
            <ClientsTable />
        </main>
    )
}

export default page
