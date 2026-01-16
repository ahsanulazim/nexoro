"use client";

import { fetchBlogsFrontend } from "@/api/fetchBlogs";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import BlogCard from "./BlogCard";
import AllBlogSkeleton from "./AllBlogSkeleton";

const AllBlogs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["blogs", page],
    queryFn: fetchBlogsFrontend,
    keepPreviousData: true,
  });

  const goToPage = (pageNum) => {
    router.push(`/articles?page=${pageNum}`);
  };

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <AllBlogSkeleton key={i} />
          ))
        ) : !data.blogs || data.blogs.length === 0 ? (
          <p className="text-center">No Blogs has been posted yet</p>
        ) : (
          data.blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        )}
      </div>
      <div className="divider"></div>
      {!isLoading && (
        <div className="flex justify-between items-center">
          <div className="join">
            <button
              className="join-item btn"
              disabled={!data.hasPrev}
              onClick={() => goToPage(page - 1)}
            >
              «
            </button>
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
            <button
              className="join-item btn"
              disabled={!data?.hasNext}
              onClick={() => goToPage(page + 1)}
            >
              »
            </button>
          </div>
          <p className="text-sm hidden md:block">
            Showing {data.start} to {data.end} of {data.totalBlogs} Blogs (
            {data.totalPages} Pages)
          </p>
        </div>
      )}
    </>
  );
};

export default AllBlogs;
