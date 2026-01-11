import EditBlog from '@/components/dashboard/blogs/EditBlog'
import DashBread from '@/components/dashboard/DashBread'

const Blog = async ({ params }) => {

    const { blog } = await params;

    const blogData = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/blogs/${blog}`).then(res => res.json())

    console.log(blogData);


    return (
        <main className="flex flex-col gap-4">
            <section className="">
                <DashBread title="Blogs" subtitle="Edit Blog" />
                <div className="flex items-center justify-between gap-5">
                    <h1 className="text-4xl font-semibold">Edit Blog</h1>
                </div>
            </section>
            <section>
                {/* Edit Blog */}
                <EditBlog blog={blogData} />
            </section>
        </main>
    )
}

export default Blog