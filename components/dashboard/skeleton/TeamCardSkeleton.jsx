const TeamCardSkeleton = () => {
    return (
        <div className="card bg-base-200 shadow-lg rounded-3xl">
            <figure className="p-2">
                <div className="skeleton h-72 w-full rounded-2xl"></div>
            </figure>
            <div className="card-body">
                <div className="skeleton h-8 w-full"></div>
                <div className="skeleton h-6 w-44"></div>
                <div>
                    <div className="skeleton h-6 w-36 mb-2"></div>
                    <div className="flex gap-2 text-lg">
                        <div className="skeleton h-8 w-full"></div>
                        <div className="skeleton h-8 w-full"></div>
                        <div className="skeleton h-8 w-full"></div>
                        <div className="skeleton h-8 w-full"></div>
                        <div className="skeleton h-8 w-full"></div>
                    </div>
                </div>
                <div className="card-actions flex-row">
                    <div className="skeleton h-12 w-full"></div>
                </div>
            </div>
        </div>
    )
}

export default TeamCardSkeleton
