'use client'

import { fetchClients } from "@/api/fetchClients";
import { addReview } from "@/api/fetchReview";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaRegStar, FaStar, FaStarHalfStroke } from "react-icons/fa6";
import { toast } from "react-toastify";

const ReviewModal = ({ ref, isEditing, selectedReview }) => {

    const [loading, setLoading] = useState(false);
    const [selectedClient, setSelectedClient] = useState("");
    const [rating, setRating] = useState(0);

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
            setLoading(false);
        },
        onSettled: () => {
            setLoading(false);
        },
    });

    const handleReview = (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("clientName", e.target.selectClient.value);
        formData.append("rating", e.target.rating.value);
        formData.append("review", e.target.review.value);
        mutation.mutate(formData);
        e.target.reset();
    }

    return (
        <dialog ref={ref} id="reviewModal" className="modal">
            <div className="modal-box">
                <form className="fieldset" onSubmit={handleReview}>
                    <h1 className="text-xl font-semibold">{isEditing ? "Edit" : "Add"} Review</h1>

                    <label className="label" htmlFor="selectClient">
                        Select Client<span className={isEditing ? "hidden" : "text-red-600"}>*</span>
                    </label>
                    <select
                        className="select w-full"
                        name="selectClient"
                        value={isEditing ? selectedReview?.clientName || "" : selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        required={!isEditing}
                    >
                        <option value="" disabled>Select Client</option>
                        {isLoading ? <option>Loading...</option> : clientData.map((client) => <option key={client.client} value={client.client}>{client.client}</option>)}
                    </select>
                    <label className="label" htmlFor="rating">
                        Rating<span className={isEditing ? "hidden" : "text-red-600"}>*</span>
                    </label>
                    <div className="flex items-center gap-5">
                        <input
                            type="number"
                            className="input max-w-15"
                            name="rating"
                            min="0" max="5"
                            step="0.1"
                            onChange={(e) => setRating(Math.max(0, Math.min(5, Number(e.target.value))))}
                            defaultValue={isEditing ? selectedReview.rating : rating}
                            required={!isEditing}
                        />
                        <div className="flex items-center gap-1 text-lg">
                            {ratingSystem}
                        </div>
                    </div>
                    <label className="label" htmlFor="review">
                        Full Review<span className={isEditing ? "hidden" : "text-red-600"}>*</span>
                    </label>
                    <textarea
                        name="review"
                        placeholder="Write Review"
                        className="textarea w-full"
                        defaultValue={isEditing ? selectedReview.shortDes : ""}
                        required={!isEditing}
                    ></textarea>
                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn btn-error"
                            onClick={() => ref.current.close()}
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className={`btn btn-primary ${loading ? "" : "btn-nexoro-primary"
                                }`}
                            disabled={loading ? true : false}
                        >
                            {loading && <span className="loading loading-spinner"></span>} {isEditing ? "Update" : "Add"} Review
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    )
}

export default ReviewModal
