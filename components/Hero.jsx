import CardsMarquee from "./CardsMarquee";
import Button from "./ui/Button";

export default function Hero() {
    return (
        <div className="hero min-h-screen relative overflow-hidden">
            {/* <MarketingMarquee /> */}
            <div className="h-52 w-60 bg-red-500 absolute rotate-80 right-0"></div>
            <div className="absolute rotate-80 -z-10 grid grid-rows-2 gap-5 overflow-hidden">
                <div>
                    <CardsMarquee />
                </div>
                <div>
                    <CardsMarquee direction="right" />
                </div>
            </div>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <img
                    src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                    className="max-w-sm rounded-lg"
                />
                <div>
                    <h1 className="text-5xl font-bold text-balance">Creative strategy that drives real results</h1>
                    <p className="py-6">
                        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                        quasi. In deleniti eaque aut repudiandae et a id nisi.
                    </p>
                    <Button>Get Started</Button>
                </div>
            </div>
        </div>
    )
}
