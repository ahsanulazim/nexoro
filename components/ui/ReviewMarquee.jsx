"use client";

import Marquee from "react-fast-marquee";
import ReviewCard from "./ReviewCard";
import { useQuery } from "@tanstack/react-query";
import { fetchReview } from "@/api/fetchReview";

const ReviewMarquee = ({ direction }) => {
  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReview,
  });

  return (
    <Marquee
      gradient={true}
      gradientColor="#15191e"
      autoFill={true}
      direction={direction}
    >
      {reviews?.map((review) => (
        <ReviewCard
          controller={false}
          className="bg-base-100 max-xs:w-2xs w-sm mr-4 min-h-44"
          key={review.clientName}
          review={review}
        />
      ))}
    </Marquee>
  );
};

export default ReviewMarquee;
