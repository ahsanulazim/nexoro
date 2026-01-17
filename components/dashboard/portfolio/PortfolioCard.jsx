import { LuCalendar, LuHeart, LuMessageCircle, LuTrash2 } from "react-icons/lu"
import DOMPurify from "isomorphic-dompurify"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteBlog } from "@/api/fetchBlogs";
import Link from "next/link";

const PortfolioCard = ({ portfolio }) => {

    const clean = DOMPurify.sanitize(portfolio?.content, { USE_PROFILES: { html: true } });

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
            <Link href={`/dashboard/portfolio/${portfolio.slug}`} className="w-full md:max-w-52 shrink-0">
                <img className="object-cover aspect-square"
                    src={portfolio.image}
                    alt={portfolio.title} />
            </Link>
            <div className="card-body">
                <Link href={`/dashboard/portfolio/${portfolio.slug}`} className="card-body p-0">
                    <div className="badge badge-success">{portfolio.service.title}</div>
                    <div className="flex max-xs:flex-col xs:gap-2 xs:items-end">
                        <h2 className="card-title text-xl line-clamp-1">{portfolio.title}</h2>
                        <p className="whitespace-nowrap">by <span className="link link-hover link-info">{portfolio.author}</span></p>
                    </div>
                    <p className="line-clamp-2" dangerouslySetInnerHTML={{ __html: clean }} />
                </Link>
                <div>
                    <button className="btn btn-error" onClick={() => mutation.mutate({ id: portfolio._id, public_id: portfolio.public_id })} disabled={mutation.isPending}><LuTrash2 />Delete</button>
                    <button className="btn btn-ghost btn-secondary"><LuHeart />Like</button>
                    <button className="btn btn-ghost btn-info"><LuMessageCircle />Comments</button>
                    <button className="btn btn-ghost btn-info" disabled><LuCalendar />{new Date(portfolio.added).toLocaleString("en-BD", {
                        timeZone: "Asia/Dhaka",
                        dateStyle: "medium",
                        timeStyle: "short",
                    })}</button>
                </div>
            </div>
        </div>
    )
}

export default PortfolioCard