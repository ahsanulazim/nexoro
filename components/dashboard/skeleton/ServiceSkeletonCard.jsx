const ServiceSkeletonCard = () => {
    return (
        <div className="flex w-full flex-col gap-4 bg-base-200 p-5 rounded-xl">
            <div className="flex items-center justify-between gap-4">
                <div className="flex gap-4">
                    <div className="skeleton size-12 shrink-0 rounded-full"></div>
                    <div className="skeleton h-12 w-28"></div>
                </div>
                <div className="skeleton size-12 justify-self-end"></div>
            </div>
            <div className="skeleton h-4 w-36"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-40"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
        </div>
    )
}

export default ServiceSkeletonCard
