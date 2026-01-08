const PlansSkeleton = () => {
    return (
        <div className="bg-base-200 flex p-5 rounded-xl flex-col gap-4">
            <div className="flex gap-5 justify-between">
                <div className="skeleton h-10 max-w-52 w-full"></div>
                <div className="skeleton h-10 w-16"></div>
            </div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
        </div>
    )
}

export default PlansSkeleton