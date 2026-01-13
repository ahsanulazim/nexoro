import { LuCalendar, LuHeart, LuMessageCircle, LuTrash2 } from "react-icons/lu"
import DOMPurify from "isomorphic-dompurify"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteBlog } from "@/api/fetchBlogs";
import Link from "next/link";

const BlogCard = ({ blog }) => {

    const clean = DOMPurify.sanitize(blog?.content, { USE_PROFILES: { html: true } });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteBlog,
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey: ["blogs"] });
            const previousBlogs = queryClient.getQueryData(["blogs"]);
            queryClient.setQueryData(["blogs"], (oldBlogs) =>
                oldBlogs.filter((blog) => blog._id !== id)
            );
            return { previousBlogs };
        },
        onError: (err, context) => {
            toast.error(err.message);
            queryClient.setQueryData(["blogs"], context.previousBlogs);
        },
        onSettled: () => {
            toast.success("Blog deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });

    return (
        <div className="card md:flex-row bg-base-100 overflow-hidden">
            <Link href={`/dashboard/blogs/${blog.slug}`} className="w-full md:max-w-52 shrink-0">
                <img className="object-cover aspect-square"
                    src={blog.image}
                    alt={blog.title} />
            </Link>
            <div className="card-body">
                <Link href={`/dashboard/blogs/${blog.slug}`} className="card-body p-0">
                    <div className="badge badge-success">{blog.category.category}</div>
                    <div className="flex max-xs:flex-col xs:gap-2 xs:items-end">
                        <h2 className="card-title text-xl line-clamp-1">{blog.title}</h2>
                        <p className="whitespace-nowrap">by <span className="link link-hover link-info">{blog.author}</span></p>
                    </div>
                    <p className="line-clamp-2" dangerouslySetInnerHTML={{ __html: clean }} />
                </Link>
                <div>
                    <button className="btn btn-error" onClick={() => mutation.mutate({ id: blog._id, public_id: blog.public_id })} disabled={mutation.isPending}><LuTrash2 />Delete</button>
                    <button className="btn btn-ghost btn-secondary"><LuHeart />Like</button>
                    <button className="btn btn-ghost btn-info"><LuMessageCircle />Comments</button>
                    <button className="btn btn-ghost btn-info" disabled><LuCalendar />{new Date(blog.added).toLocaleString("en-BD", {
                        timeZone: "Asia/Dhaka",
                        dateStyle: "medium",
                        timeStyle: "short",
                    })}</button>
                </div>
            </div>
        </div>
    )
}

export default BlogCard