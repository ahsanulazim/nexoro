'use client'

import { fetchCategories } from "@/api/fetchPortfolios";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PortfolioCategory = ({ className }) => {

    const searchParams = useSearchParams();
    const activeCategory = searchParams.get("category") || "";

    const { data, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });


    return (
        <ul className={`${className ? className : ""} menu bg-base-300`}>
            <li><h2 className="menu-title">Categories</h2>
                <ul>
                    {isLoading ? Array.from({ length: 8 }).map((_, index) => (
                        <li key={index} className="skeleton bg-base-200 h-8 w-full mx-0 my-3 opacity-100"></li>
                    )) : !data.allServices || data.allServices.length === 0 ? <li>No Categories</li> :
                        <>
                            <li><Link href="/portfolio" className={activeCategory === "" ? "menu-active" : ""}>All Categories</Link></li>
                            {data.allServices.map((cat) => (
                                <li key={cat.serviceTitle}>
                                    <Link href={`/portfolio?category=${cat._id}`} className={activeCategory === cat._id ? "menu-active" : ""}>
                                        {cat.serviceTitle}
                                    </Link>
                                </li>
                            ))}</>}
                </ul>
            </li>
        </ul>
    )
}

export default PortfolioCategory