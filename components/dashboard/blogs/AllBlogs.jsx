'use client'
import { useQuery } from "@tanstack/react-query";
import BlogCard from "./BlogCard"
import { fetchBlogs } from "@/api/fetchBlogs";
import Link from "next/link";

const AllBlogs = () => {

    const { data: blogs, isLoading } = useQuery({
        queryKey: ["blogs"],
        queryFn: fetchBlogs,
    });

    return (
        <div className="bg-base-300 p-5 rounded-xl flex flex-col gap-5">
            {isLoading ? <p>Loading...</p> : blogs.map((blog) => <Link href={`/dashboard/blogs/${blog.slug}`} key={blog._id}><BlogCard blog={blog} /></Link>)}
        </div>
    )
}

export default AllBlogs