'use client'

import { fetchLatestBlogs } from "@/api/fetchBlogs";
import { useQuery } from "@tanstack/react-query"
import moment from "moment"
import Link from "next/link";
import { LuCalendar } from "react-icons/lu"

const LatestBlogs = () => {

    const { data: latestBlogs, isLoading } = useQuery({
        queryKey: ["latestBlogs"],
        queryFn: fetchLatestBlogs
    });

    console.log(latestBlogs);


    return (
        <div className="bg-base-300 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold">Latest Blogs</h2>
            <div className="divider"></div>
            <div>
                {isLoading ? Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                        <div className="skeleton bg-base-200 h-6 w-1/3 mb-2"></div>
                        <div className="skeleton bg-base-200 h-6 w-full mb-2"></div>
                        <div className="skeleton bg-base-200 h-6 w-full mb-2"></div>
                        <div className="skeleton bg-base-200 h-4 w-1/2"></div>
                    </div>
                )) : !latestBlogs || latestBlogs.length === 0 ? <p>No Blogs</p> : latestBlogs.map((blog) => (
                    <div key={blog._id} className="mb-6 last:mb-0">
                        <div className="badge badge-success">{blog.category.category}</div>
                        <Link href={`/articles/${blog.slug}`} className="link link-hover"><h3 className="font-bold text-xl line-clamp-3">{blog.title}</h3></Link>
                        <p className="opacity-50 text-sm flex items-center gap-2 mt-3"><LuCalendar /> {moment(blog.added).format('lll')}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LatestBlogs