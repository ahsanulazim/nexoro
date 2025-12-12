// add a review
export const addReview = async (data) => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const review = await res.json();
    if (!res.ok) {
        throw new Error(review.message || "Failed to add review");
    }
    return review;
};

//get all reviews
export const fetchReview = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/reviews`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch reviews");
    }

    return res.json();
};

//delete a review
export const deleteReview = async (id) => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/reviews/${id}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    if (!res.ok) {
        throw new Error("Failed to delete review");
    }
    return res.json();
};

// Update existing Review
export const updateReview = async (id, data) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/reviews/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const review = await res.json();
    if (!res.ok) {
        throw new Error(review.message || "Failed to update review");
    }
    return review;
};