'use client'

import DashBread from "@/components/dashboard/DashBread";
import ReviewModal from "@/components/dashboard/review/ReviewModal";
import ReviewCard from "@/components/ui/ReviewCard";
import { useRef, useState } from "react";
import { LuPlus } from "react-icons/lu";

const Review = () => {

    const [isEditing, setIsEditing] = useState(false);
    const [selectedReview, setSelectedReview] = useState(false);
    const addReview = useRef();

    return (
        <>
            <ReviewModal ref={addReview} isEditing={isEditing} selectedReview={selectedReview} />
            <main className="flex flex-col gap-4">
                <section className="">
                    <DashBread title="Reviews" />
                    <div className="flex items-center justify-between gap-5">
                        <h1 className="text-4xl font-semibold">Reviews</h1>
                        <button className="btn btn-primary btn-nexoro-primary" onClick={() => {
                            document.getElementById("reviewModal").showModal();
                            setIsEditing(false);
                        }}><LuPlus /> Add Review</button>
                    </div>
                </section>
                <section>
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        <ReviewCard className="bg-base-300" />
                    </div>
                </section>
            </main>
        </>
    )
}

export default Review
