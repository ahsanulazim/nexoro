export const postBlog = async (blogData) => {
    const blogInfo = new FormData();
    blogInfo.append("author", blogData.author);
    blogInfo.append("title", blogData.blogTitle);
    blogInfo.append("slug", blogData.slug);
    blogInfo.append("description", blogData.blogDescription);
    blogInfo.append("content", blogData.content.replace(/&nbsp;/g, " "));
    blogInfo.append("category", blogData.category);
    blogInfo.append("visibility", blogData.visibility);
    blogInfo.append("folder", "blogs");
    blogInfo.append("image", blogData.image[0]);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/blogs`, {
        method: "POST",
        body: blogInfo,
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to Post Blog");
    }
    return data;
};

export const fetchBlogs = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/blogs/allBlogs`, {
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

export const deleteBlog = async ({ id, public_id }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/blogs/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id }),
    })
    if (!res.ok) {
        throw new Error("Failed to Delete Blog");
    }
    return res.json();
}

export const updateBlog = async (id, blogData) => {
    const blogInfo = new FormData();
    blogInfo.append("author", blogData.author);
    blogInfo.append("title", blogData.blogTitle);
    blogInfo.append("slug", blogData.slug);
    blogInfo.append("description", blogData.blogDescription);
    blogInfo.append("content", blogData.content.replace(/&nbsp;/g, " "));
    blogInfo.append("category", blogData.category);
    blogInfo.append("visibility", blogData.visibility);
    blogInfo.append("folder", "blogs");
    if (blogData.image) {
        blogInfo.append("image", blogData.image[0]);
    }


    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/blogs/${id}`, {
        method: "PUT",
        body: blogInfo,
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to Update Blog");
    }
    return data;
};