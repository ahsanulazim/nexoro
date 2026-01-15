const HeroCardSkeleton = () => {
    return (
        <div className="card border border-white/10 backdrop-blur-xl bg-main/10 rounded-2xl mx-3 max-w-sm min-h-80">
            <div className="card-body p-8">
                <figure className="bg-main/10 rounded-2xl size-16 mb-3">
                    <div></div>
                </figure>
                <div className="bg-main/10 rounded-lg h-7 w-full"></div>
                <div className="bg-main/10 rounded-lg h-7 w-full max-w-44"></div>
                <div className="bg-main/10 rounded-lg h-4 w-full"></div>
                <div className="bg-main/10 rounded-lg h-4 w-full max-w-52"></div>
                <div className="card-actions">
                    <div className="bg-main/10 rounded-lg h-10 w-full max-w-32"></div>
                </div>
            </div>
        </div>
    )
}

export default HeroCardSkeleton