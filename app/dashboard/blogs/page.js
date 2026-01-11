import AllBlogs from "@/components/dashboard/blogs/AllBlogs"
import DashBread from "@/components/dashboard/DashBread"
import Link from "next/link"
import { LuPlus } from "react-icons/lu"

const Blogs = () => {
    return (
        <main className="flex flex-col gap-4">
            <section className="">
                <DashBread title="Blogs" />
                <div className="flex items-center justify-between gap-5">
                    <h1 className="text-4xl font-semibold">Blogs</h1>
                    <Link href="/dashboard/blogs/add-blog"><button className="btn btn-primary btn-nexoro-primary"><LuPlus /> Post Blog</button></Link>
                </div>
            </section>
            <section>
                <AllBlogs />
            </section>
        </main>
    )
}

export default Blogs