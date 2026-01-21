export const postPortfolio = async (portfolioData) => {
    const portfolioInfo = new FormData();
    portfolioInfo.append("author", portfolioData.author);
    portfolioInfo.append("title", portfolioData.portfolioTitle);
    portfolioInfo.append("description", portfolioData.portfolioDescription);
    portfolioInfo.append("content", portfolioData.content);
    portfolioInfo.append("service", portfolioData.service);
    portfolioInfo.append("visibility", portfolioData.visibility);
    portfolioInfo.append("folder", "portfolio");
    portfolioInfo.append("image", portfolioData.image[0]);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/portfolio`, {
        method: "POST",
        body: portfolioInfo,
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to Post Portfolio");
    }
    return data;
};

export const fetchPortfolios = async ({ queryKey }) => {

    const [_key, page, category] = queryKey

    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE}/portfolio/allPortfolios`);
    url.searchParams.append("page", page);
    url.searchParams.append("limit", 6);
    if (category) {
        url.searchParams.append("category", category);
    }

    const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to Get Portfolios");
    }

    return res.json();
}

export const fetchCategories = async () => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/portfolio/categories`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) {
        throw new Error("Failed to Get Categories");
    }
    return res.json();
}

export const fetchPortfolioFrontend = async ({ queryKey }) => {

    const [_key, page] = queryKey

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/portfolio/allPortfolios?page=${page}&limit=12`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to Get Blogs");
    }

    return res.json();
}

export const deletePortfolio = async ({ id, public_id }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/portfolio/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id }),
    })
    if (!res.ok) {
        throw new Error("Failed to Delete Portfolio");
    }
    return res.json();
}

export const updatePortfolio = async (id, portfolioData) => {
    const portfolioInfo = new FormData();
    portfolioInfo.append("author", portfolioData.author);
    portfolioInfo.append("title", portfolioData.portfolioTitle);
    portfolioInfo.append("slug", portfolioData.slug);
    portfolioInfo.append("description", portfolioData.portfolioDescription);
    portfolioInfo.append("content", portfolioData.content.replace(/&nbsp;/g, " "));
    portfolioInfo.append("service", portfolioData.service);
    portfolioInfo.append("visibility", portfolioData.visibility);
    portfolioInfo.append("folder", "portfolio");
    if (portfolioData.image) {
        portfolioInfo.append("image", portfolioData.image[0]);
    }


    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/portfolio/${id}`, {
        method: "PUT",
        body: portfolioInfo,
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to Update Portfolio");
    }
    return data;
};