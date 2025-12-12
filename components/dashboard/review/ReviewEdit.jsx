import { fetchClients } from "@/api/fetchClients";
import { updateReview } from "@/api/fetchReview";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaRegStar, FaStar, FaStarHalfStroke } from "react-icons/fa6";
import { toast } from "react-toastify";

const ReviewEdit = ({ ref, review }) => {

    //react hook form
    const { register, handleSubmit, watch, reset, formState: { errors, isDirty } } = useForm({
        defaultValues: {
            clientName: review.clientName,
            rating: parseFloat(review.rating),
            review: review.review,
        }
    });

    const rating = watch("rating");

    //client data for select
    const { data: clientData, isLoading } = useQuery({
        queryKey: ["clientData"],
        queryFn: fetchClients,
    });

    //rating logics
    const ratingSystem = [...Array(5)].map((_, i) => {
        const starValue = i + 1;
        if (rating >= starValue) {
            return <FaStar key={i} className="text-orange-400" />;
        } else if (rating >= starValue - 0.5) {
            return <FaStarHalfStroke key={i} className="text-orange-400" />;
        } else {
            return <FaRegStar key={i} className="text-orange-400" />;
        }
    }
    )

    //Review adding logic
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, data }) => updateReview(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            ref.current.close();
            toast.success("Review updated successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const handleReviewEdit = (data) => {
        mutation.mutate({ id: review._id, data });
    }

    const handleClose = () => {
        reset();
        ref.current.close();
    };

    return (
        <dialog ref={ref} id="reviewModal" className="modal">
            <div className="modal-box">
                <form className="fieldset" onSubmit={handleSubmit(handleReviewEdit)}>
                    <h1 className="text-xl font-semibold">Edit Review</h1>

                    <label className="label" htmlFor="clientName">
                        Select Client
                    </label>
                    <select className="select w-full" {...register("clientName", {
                    })}>
                        <option value="" disabled>Select Client</option>
                        {isLoading ? <option>Loading...</option> : clientData.map((client) => <option key={client.client} value={client.client}>{client.client}</option>)}
                    </select>
                    {errors.clientName && <p className="text-red-600">{errors.clientName.message}</p>}
                    <label className="label" htmlFor="rating">
                        Rating
                    </label>
                    <div className="flex items-center gap-5">
                        <input className="input max-w-15" type="number" step="0.1" min="0" max="5" {...register("rating", {
                            required: "Rating is required",
                            validate: (value) =>
                                value > 0 && value <= 5 || "Rating must be at least 0.1 and maximum 5"
                        })}
                        />

                        <div className="flex items-center gap-1 text-lg">
                            {ratingSystem}
                        </div>
                    </div>
                    {errors.rating && <p className="text-red-600">{errors.rating.message}</p>}
                    <label className="label" htmlFor="review">
                        Full Review
                    </label>
                    <textarea
                        placeholder="Write a Short Review"
                        className="textarea w-full"
                        {...register("review", {
                            required: "Give a Short Review",
                        })}
                    ></textarea>
                    {errors.review && <p className="text-red-600">{errors.review.message}</p>}
                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn btn-error"
                            onClick={handleClose}
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className={`btn btn-primary ${mutation.isPending || !isDirty ? "" : "btn-nexoro-primary"
                                }`}
                            disabled={mutation.isPending || !isDirty ? true : false}
                        >
                            {mutation.isPending && <span className="loading loading-spinner"></span>} Update Review
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    )
}

export default ReviewEdit
