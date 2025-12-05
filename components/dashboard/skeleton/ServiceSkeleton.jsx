import ServiceSkeletonCard from "./ServiceSkeletonCard"

const ServiceSkeleton = () => {
    return (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
                <ServiceSkeletonCard key={i} />
            ))}
        </div>
    )
}

export default ServiceSkeleton
