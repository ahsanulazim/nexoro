'use client'
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchPortfolios } from "@/api/fetchPortfolios";
import PortfolioCard from "./PortfolioCard";

const AllPortfolio = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page") || 1);
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["portfolio", page],
        queryFn: fetchPortfolios,
        keepPreviousData: true,
    });

    const goToPage = (pageNum) => {
        router.push(`/dashboard/portfolio?page=${pageNum}`);
    }


    console.log(data);



    return (
        <>
            <div className="bg-base-300 p-5 rounded-xl flex flex-col gap-5">
                {isLoading ? <p>Loading...</p> : !data.portfolio || data.portfolio.length === 0 ? <p className="text-center">No Portfolio has been added yet</p> : data.portfolio.map((port) => <PortfolioCard key={port._id} portfolio={port} />)}
            </div>
            {isLoading ? <p>Loading...</p> : !data.portfolio || data.portfolio.length === 0 ? <></> :
                <>
                    <div className="divider"></div>
                    <div className="join">
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
                    </div>
                </>}
        </>
    )
}

export default AllPortfolio