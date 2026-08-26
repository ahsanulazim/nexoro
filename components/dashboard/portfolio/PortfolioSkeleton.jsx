const PortfolioSkeleton = () => {
  return (
    <div className="card bg-base-100 overflow-hidden">
      {/* Image skeleton */}
      <div className="w-full aspect-[1.91] skeleton"></div>

      <div className="card-body">
        {/* Badge skeleton */}
        <div className="badge skeleton w-28 h-6"></div>

        {/* Title skeleton */}
        <h2 className="card-title">
          <div className="skeleton h-7 w-full max-w-3xs"></div>
        </h2>

        {/* Author skeleton */}

        <div className="skeleton h-5 w-full"></div>
        <div className="skeleton h-5 w-full max-w-52"></div>

        {/* Date skeleton */}
        <div className="flex items-center gap-2 opacity-50">
          <div className="skeleton h-4 w-24"></div>
        </div>

        {/* Delete button skeleton */}
        <div className="badge skeleton w-20"></div>
      </div>
    </div>
  );
};

export default PortfolioSkeleton;
