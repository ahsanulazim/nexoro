import { fetchClients } from "@/api/fetchClients";
import { addReview } from "@/api/fetchReview";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaRegStar, FaStar, FaStarHalfStroke } from "react-icons/fa6";
import { toast } from "react-toastify";

const ReviewModal = ({ ref }) => {

    //react hook form
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
        defaultValues: {
            clientName: "",
            rating: "",
            review: "",
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
        mutationFn: addReview,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["reviews"],
            });
            ref.current.close();
            toast.success("Review added successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
        onSettled: () => {
            reset();
        },
    });

    const handleReview = (data) => {
        mutation.mutate(data);
    }

    const handleClose = () => {
        reset();
        ref.current.close();
    };

    return (
        <dialog ref={ref} id="reviewModal" className="modal">
            <div className="modal-box">
                <form className="fieldset" onSubmit={handleSubmit(handleReview)}>
                    <h1 className="text-xl font-semibold">Add Review</h1>

                    <label className="label" htmlFor="selectClient">
                        Select Client <span className="text-red-600">*</span>
                    </label>
                    <select className="select w-full" {...register("clientName", {
                        required: "Select Client",
                    })}>
                        <option value="" disabled>Select Client</option>
                        {isLoading ? <option>Loading...</option> : clientData.map((client) => <option key={client.client} value={client.client}>{client.client}</option>)}
                    </select>
                    {errors.clientName && <p className="text-red-600">{errors.clientName.message}</p>}
                    <label className="label" htmlFor="rating">
                        Rating <span className="text-red-600">*</span>
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
                        Full Review <span className="text-red-600">*</span>
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
                            className={`btn btn-primary ${mutation.isPending ? "" : "btn-nexoro-primary"
                                }`}
                            disabled={mutation.isPending ? true : false}
                        >
                            {mutation.isPending && <span className="loading loading-spinner"></span>} Add Review
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    )
}

export default ReviewModal
