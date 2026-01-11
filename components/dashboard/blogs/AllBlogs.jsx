'use client'
import { useQuery } from "@tanstack/react-query";
import BlogCard from "./BlogCard"
import { fetchBlogs } from "@/api/fetchBlogs";

const AllBlogs = () => {

    const { data: blogs, isLoading } = useQuery({
        queryKey: ["blogs"],
        queryFn: fetchBlogs,
    });

    return (
        <div className="bg-base-300 p-5 rounded-xl flex flex-col gap-5">
            {isLoading ? <p>Loading...</p> : !blogs || blogs.length === 0 ? <p className="text-center">No Blogs has been posted yet</p> : blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        </div>
    )
}

export default AllBlogs