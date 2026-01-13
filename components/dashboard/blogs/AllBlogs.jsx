'use client'
import { useQuery } from "@tanstack/react-query";
import BlogCard from "./BlogCard"
import { fetchBlogs } from "@/api/fetchBlogs";
import { useRouter, useSearchParams } from "next/navigation";

const AllBlogs = () => {

    const router = useRouter();

    const searchParams = useSearchParams();

    const page = Number(searchParams.get("page") || 1);

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["blogs", page],
        queryFn: fetchBlogs,
        keepPreviousData: true,
    });

    const goToPage = (pageNum) => {
        router.push(`/dashboard/blogs?page=${pageNum}`);
    }


    return (
        <>
            <div className="bg-base-300 p-5 rounded-xl flex flex-col gap-5">
                {isLoading ? <p>Loading...</p> : !data.blogs || data.blogs.length === 0 ? <p className="text-center">No Blogs has been posted yet</p> : data.blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
            </div>
            <div className="divider"></div>
            {!isLoading && <div className="join">
                <button className="join-item btn" disabled={!data.hasPrev} onClick={() => goToPage(page - 1)} >«</button>
                {[...Array(data.totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                        <button
                            key={pageNum}
                            className={`join-item btn ${page === pageNum ? "btn-active btn-success" : ""
                                }`}
                            onClick={() => goToPage(pageNum)}
                        >
                            {pageNum}
                        </button>
                    );
                })}
                <button className="join-item btn" disabled={!data?.hasNext} onClick={() => goToPage(page + 1)}>»</button>
            </div>}
        </>
    )
}

export default AllBlogs