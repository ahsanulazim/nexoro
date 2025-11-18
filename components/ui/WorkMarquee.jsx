import Marquee from "react-fast-marquee"
import portfolios from "@/json/portfolio.json";

const WorkMarquee = () => {
    return (
        <Marquee>
            {portfolios.map((portfolio) =>
                <div key={portfolio.title} className="border border-gray-800 p-5">
                    <img src={portfolio.image} alt={portfolio.title} className="max-sm:max-w-2xs" />
                    <p className="text-center mt-3">{portfolio.title}</p>
                </div>
            )}
        </Marquee>
    )
}

export default WorkMarquee
