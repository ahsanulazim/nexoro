import { LuCalendar, LuTrash2 } from "react-icons/lu"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Link from "next/link";
import { deletePortfolio } from "@/api/fetchPortfolios";

const PortfolioCard = ({ portfolio }) => {

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deletePortfolio,
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey: ["portfolios"] });
            const previousPortfolios = queryClient.getQueryData(["portfolios"]);
            queryClient.setQueryData(["portfolios"], (oldPortfolios = []) =>
                oldPortfolios.filter((port) => port._id !== id)
            );
            return { previousPortfolios };
        },
        onError: (err, context) => {
            toast.error(err.message);
            queryClient.setQueryData(["portfolios"], context.previousPortfolios);
        },
        onSuccess: () => {
            toast.success("Portfolio deleted successfully");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolios"] });
        },
    });


    const handleDelete = (id, public_id) => {
        mutation.mutate({ id, public_id });
    }

    return (
        <div className="card bg-base-100 overflow-hidden">
            <Link href={`/dashboard/portfolio/${portfolio.slug}`}>
                <img className="w-full"
                    src={portfolio.image}
                    alt={portfolio.title} />
            </Link>
            <div className="card-body">
                <Link href={`/dashboard/portfolio/${portfolio.slug}`} className="card-body p-0 gap-1">
                    <div className="badge badge-success">{portfolio.service.title}</div>
                    <h2 className="card-title text-xl line-clamp-1">{portfolio.title}</h2>
                    <p className="whitespace-nowrap">by <span className="link link-hover link-info">{portfolio.author}</span></p>
                    <p className="flex items-center gap-2 opacity-50"><LuCalendar />{new Date(portfolio.added).toLocaleString("en-BD", {
                        timeZone: "Asia/Dhaka",
                        dateStyle: "medium",
                        timeStyle: "short",
                    })}</p>
                </Link>
                <div>
                    <button className="btn btn-error" onClick={() => handleDelete(portfolio._id, portfolio.public_id)} disabled={mutation.isPending}>
                        {mutation.isPending ? <><span className="loading loading-spinner"></span> Deleting</> : <><LuTrash2 /> Delete</>}
                    </button>

                </div>
            </div>
        </div>
    )
}

export default PortfolioCard