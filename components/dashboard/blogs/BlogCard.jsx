import { LuCalendar, LuHeart, LuMessageCircle, LuTrash2 } from "react-icons/lu"
import DOMPurify from "isomorphic-dompurify"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteBlog } from "@/api/fetchBlogs";

const BlogCard = ({ blog }) => {

    const clean = DOMPurify.sanitize(blog?.content, { USE_PROFILES: { html: true } });

    const queryClient = useQueryClient();

    const { mutate: removeClient, isPending } = useMutation({
        mutationFn: ({ email, public_id }) => deleteBlog(id, public_id),
        onMutate: async ({ email }) => {
            await queryClient.cancelQueries({ queryKey: ["blogs"] });
            const previousClients = queryClient.getQueryData(["blogs"]);
            queryClient.setQueryData(["blogs"], (oldClients) =>
                oldClients.filter((client) => client.email !== email)
            );
            return { previousClients };
        },
        onError: (err, context) => {
            toast.error(err.message);
            queryClient.setQueryData(["blogs"], context.previousClients);
        },
        onSettled: () => {
            toast.success("Blog deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });

    return (
        <div className="card md:flex-row bg-base-100 overflow-hidden">
            <figure className="w-full md:max-w-52 shrink-0">
                <img className="object-cover aspect-square"
                    src={blog.image}
                    alt={blog.title} />
            </figure>
            <div className="card-body">
                <div className="badge badge-success">{blog.category.category}</div>
                <div className="flex max-xs:flex-col xs:gap-2 xs:items-end">
                    <h2 className="card-title text-xl line-clamp-1">{blog.title}</h2>
                    <p className="whitespace-nowrap">by <span className="link link-hover link-info">{blog.author}</span></p>
                </div>
                <p className="line-clamp-2" dangerouslySetInnerHTML={{ __html: clean }} />
                <div>
                    <button className="btn btn-error"><LuTrash2 />Delete</button>
                    <button className="btn btn-ghost btn-secondary"><LuHeart />Like</button>
                    <button className="btn btn-ghost btn-info"><LuMessageCircle />Comments</button>
                    <button className="btn btn-ghost btn-info" disabled><LuCalendar />10th Jan, 2026</button>
                </div>
            </div>
        </div>
    )
}

export default BlogCard