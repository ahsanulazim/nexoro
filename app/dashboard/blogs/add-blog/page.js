import AddBlog from '@/components/dashboard/blogs/AddBlog'
import DashBread from '@/components/dashboard/DashBread'
import React from 'react'

const page = () => {
    return (
        <main className="flex flex-col gap-4">
            <section className="">
                <DashBread title="Blogs" subtitle="Create Blog" />
                <div className="flex items-center justify-between gap-5">
                    <h1 className="text-4xl font-semibold">Create a Blog</h1>
                </div>
            </section>
            <section>
                <AddBlog />
            </section>
        </main>
    )
}

export default page