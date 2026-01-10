import BlogCard from "./BlogCard"

const AllBlogs = () => {
    return (
        <div className="bg-base-300 p-5 rounded-xl flex flex-col gap-5">
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
        </div>
    )
}

export default AllBlogs