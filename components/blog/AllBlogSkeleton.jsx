const AllBlogSkeleton = () => {
    return (
        <div className="flex bg-base-200 p-5 rounded-box flex-col gap-4">
            <div className="skeleton aspect-square w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-6 w-full"></div>
            <div className="skeleton h-6 w-full max-w-44"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full max-w-40"></div>
            <div className="flex gap-5">
                <div className="skeleton h-10 w-full"></div>
                <div className="skeleton h-10 w-full"></div>
            </div>
        </div>
    )
}

export default AllBlogSkeleton