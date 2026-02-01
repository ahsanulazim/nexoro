import Link from "next/link"
import { LuArrowDownRight, LuArrowRight, LuArrowUpRight } from "react-icons/lu"

const StatsCard = ({ status }) => {
    return (
        <div className="border p-5 rounded-box border-base-300 bg-base-200 relative">
            <h3 className="opacity-50 uppercase text-sm font-semibold">{status.title}</h3>
            <div className="flex items-center gap-2">
                <p className="text-4xl font-semibold my-2">{status.count}</p>
                <p className={`${status.grow ? "text-success" : "text-error"} flex items-center`}>{status.grow ? <LuArrowUpRight /> : <LuArrowDownRight />}{status.comparison}%</p>
            </div>
            <Link href="#" className="link link-hover link-success text-sm flex gap-2 items-center">View All <LuArrowRight /></Link>
            <div className="bg-success text-success-content size-10 flex items-center justify-center rounded-box absolute top-5 right-5">{status.icon}</div>
        </div>
    )
}

export default StatsCard