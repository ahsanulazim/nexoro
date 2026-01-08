import DashBread from "@/components/dashboard/DashBread"
import { LuPlus } from "react-icons/lu"

const Blog = () => {
    return (
        <main className="flex flex-col gap-4">
            <section className="">
                <DashBread title="Create Blog" />
                <div className="flex items-center justify-between gap-5">
                    <h1 className="text-4xl font-semibold">Create Blog</h1>
                    <button className="btn btn-primary btn-nexoro-primary"><LuPlus /> Add Blog</button>
                </div>
            </section>
        </main>
    )
}

export default Blog