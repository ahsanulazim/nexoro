const PortfolioSkeleton = () => {
    return (
        <div className="card bg-base-200 rounded-box">
            <figure className="p-2">
                <div className="skeleton h-64 w-full rounded-lg"></div>
            </figure>
            <div className="card-body">
                <div className="skeleton h-8 w-full max-w-36"></div>
                <div className="skeleton h-8 w-full"></div>
            </div>
        </div>
    )
}

export default PortfolioSkeleton