const ClientSkeleton = () => {
    return (
        <div className="card bg-base-200 shadow-lg rounded-3xl">
            <div className="card-body">
                <div className="flex items-center justify-between gap-5">
                    <div className="flex items-center gap-2">
                        <div className="skeleton size-14"></div>
                        <div className="flex flex-col gap-1">
                            <div className="skeleton h-6 w-32"></div>
                            <div className="skeleton h-6 w-24"></div>
                        </div>
                    </div>
                    <div className="skeleton size-10"></div>
                </div>
                <div className="divider my-0"></div>
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <div className="skeleton h-4 w-32 mb-2"></div>
                        <div className="skeleton h-4 w-full mb-2"></div>
                        <div className="skeleton h-4 w-32 mb-2"></div>
                        <div className="skeleton h-4 w-full"></div>
                    </div>
                    <div>
                        <div className="skeleton h-4 w-32 mb-2"></div>
                        <div className="skeleton h-4 w-full mb-2"></div>
                        <div className="skeleton h-4 w-32 mb-2"></div>
                        <div className="skeleton h-4 w-full"></div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ClientSkeleton