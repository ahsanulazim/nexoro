const PortSkeleton = () => {
    return (
        <div className="relative">
            <div className="skeleton h-[800px] w-full"></div>
            <div className=" sm:absolute w-full sm:bottom-0 sm:p-6 text-gray-900 mt-5">
                <div className="bg-base-100 rounded-lg p-5 gap-5 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between sm:shadow-lg">
                    <div className="skeleton h-14 w-64"></div>
                    <div className="flex max-xs:flex-col xs:items-center gap-3 xs:gap-10">
                        <div>
                            <div className="skeleton h-8 w-32 mb-5"></div>
                            <div className="skeleton h-8 w-56"></div>
                        </div>
                        <div>
                            <div className="skeleton h-8 w-32 mb-5"></div>
                            <div className="skeleton h-8 w-56"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PortSkeleton