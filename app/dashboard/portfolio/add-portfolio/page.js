import DashBread from '@/components/dashboard/DashBread'
import AddPortfolio from '@/components/dashboard/portfolio/AddPortfolio'

const page = () => {
    return (
        <main className="flex flex-col gap-4">
            <section className="">
                <DashBread title="Portfolio" subtitle="Add Portfolio" />
                <div className="flex items-center justify-between gap-5">
                    <h1 className="text-4xl font-semibold">Add a Portfolio</h1>
                </div>
            </section>
            <section>
                <AddPortfolio />
            </section>
        </main>
    )
}

export default page