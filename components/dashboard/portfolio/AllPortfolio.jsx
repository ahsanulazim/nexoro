'use client'
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchPortfolios } from "@/api/fetchPortfolios";
import PortfolioCard from "./PortfolioCard";

const AllPortfolio = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page") || 1);
    const { data: portfolios, isLoading } = useQuery({
        queryKey: ["portfolios", page],
        queryFn: fetchPortfolios,
        keepPreviousData: true,
    });

    const goToPage = (pageNum) => {
        router.push(`/dashboard/portfolio?page=${pageNum}`);
    }

    return (
        <>
            <div className="grid grid-cols-3 rounded-xl gap-5">
                {isLoading ? <p>Loading...</p> : !portfolios || portfolios.portfolios.length === 0 ? <p className="text-center">No Portfolio has been added yet</p> : portfolios.portfolios.map((port) => <PortfolioCard client={false} key={port._id} portfolio={port} />)}
            </div>
            {isLoading ? <p>Loading...</p> : !portfolios || portfolios.portfolios.length === 0 ? <></> :
                <>
                    <div className="divider"></div>
                    <div className="join">
                        <button className="join-item btn" disabled={!portfolios.hasPrev} onClick={() => goToPage(page - 1)} >«</button>
                        {[...Array(portfolios.totalPages)].map((_, i) => {
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
                        <button className="join-item btn" disabled={!portfolios?.hasNext} onClick={() => goToPage(page + 1)}>»</button>
                    </div>
                </>}
        </>
    )
}

export default AllPortfolio