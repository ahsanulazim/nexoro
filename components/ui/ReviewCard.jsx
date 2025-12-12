'use client'

import { LuSquarePen, LuTrash2 } from "react-icons/lu";
import Rating from "./Rating";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview } from "@/api/fetchReview";
import { toast } from "react-toastify";
import { useRef } from "react";
import ReviewEdit from "../dashboard/review/ReviewEdit";

const ReviewCard = ({ review, className, controller }) => {

  const editReview = useRef();
  const queryClient = useQueryClient();

  const { mutate: removeReview, isPending } = useMutation({
    mutationFn: ({ id }) => deleteReview(id),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["reviews"] });
      const previousReviews = queryClient.getQueryData(["reviews"]);
      queryClient.setQueryData(["reviews"], (oldReviews) =>
        oldReviews.filter((review) => review.id !== id)
      );
      return { previousReviews };
    },
    onError: (err, id, context) => {
      toast.error(err.message);
      queryClient.setQueryData(["reviews"], context.previousReviews);
    },
    onSettled: () => {
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });

  return (
    <>
      {controller && <ReviewEdit ref={editReview} review={review} />}
      <div className={`card ${className}`}>
        <div className="card-body">
          <p>
            {review?.review || "This is a very versatile WordPress theme. Many features combined with Elementor and solid support."}
          </p>
          <div className="card-actions max-xs:flex-col-reverse xs:items-center gap-5 justify-between mt-5">
            <div className="card-title text-sm">
              <div className="avatar avatar-placeholder">
                <div className="bg-neutral text-neutral-content w-10 rounded-full">
                  <span className="text-xs">CN</span>
                </div>
              </div>
              <div>
                <h2>{review?.clientName || "Customer Name"}</h2>
              </div>

            </div>
            <Rating rating={review?.rating} />
          </div>
          {review && <>
            <div className="divider m-0"></div>
            <div className="flex items-center justify-between">
              <p className="text-xs opacity-50">{new Date(review?.added).toLocaleString("en-BD", {
                timeZone: "Asia/Dhaka",
                dateStyle: "medium",
                timeStyle: "short",
              })}</p>
              <div className="flex items-center gap-2">
                <button className="btn btn-sm btn-square btn-soft btn-error" onClick={() => removeReview({ id: review._id })} disabled={isPending}><LuTrash2 /></button>
                <button className="btn btn-sm btn-square btn-soft btn-primary" onClick={() => editReview.current.showModal()}><LuSquarePen /></button>
              </div>
            </div></>}
        </div>
      </div >
    </>
  );
};

export default ReviewCard;
