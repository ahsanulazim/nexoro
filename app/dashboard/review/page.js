'use client'

import { fetchReview } from "@/api/fetchReview";
import DashBread from "@/components/dashboard/DashBread";
import ReviewModal from "@/components/dashboard/review/ReviewModal";
import ReviewCard from "@/components/ui/ReviewCard";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { LuPlus } from "react-icons/lu";

const Review = () => {

    const addReview = useRef();

    const { data: reviews, isLoading, isError } = useQuery({
        queryKey: ["reviews"],
        queryFn: fetchReview,
    });

    return (
        <>
            <ReviewModal ref={addReview} />
            <main className="flex flex-col gap-4">
                <section className="">
                    <DashBread title="Reviews" />
                    <div className="flex items-center justify-between gap-5">
                        <h1 className="text-4xl font-semibold">Reviews</h1>
                        <button className="btn btn-primary btn-nexoro-primary" onClick={() => addReview.current.showModal()}><LuPlus /> Add Review</button>
                    </div>
                </section>
                <section>
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {reviews?.map((review) => <ReviewCard key={review._id} controller={true} review={review} className="bg-base-300 shadow-xl" />)}
                    </div>
                </section>
            </main>
        </>
    )
}

export default Review
