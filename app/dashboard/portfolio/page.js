import DashBread from "@/components/dashboard/DashBread"
import AllPortfolio from "@/components/dashboard/portfolio/AllPortfolio"
import Link from "next/link"
import { LuPlus } from "react-icons/lu"

const Portfolio = () => {
    return (
        <main className="flex flex-col gap-4">
            <section className="">
                <DashBread title="Portfolio" />
                <div className="flex items-center justify-between gap-5">
                    <h1 className="text-4xl font-semibold">Portfolio</h1>
                    <Link href="/dashboard/portfolio/add-portfolio"><button className="btn btn-primary btn-nexoro-primary"><LuPlus /> Add Portfolio</button></Link>
                </div>
            </section>
            <section>
                <AllPortfolio />
            </section>
        </main>
    )
}

export default Portfolio