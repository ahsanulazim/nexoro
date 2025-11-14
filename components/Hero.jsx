import CardsMarquee from "./CardsMarquee";
import MarketingMarquee from "./MarketingMarquee";
import Button from "./ui/Button";
import { IoIosArrowForward } from "react-icons/io";

export default function Hero() {
  return (
    <div className="py-44 relative overflow-hidden flex flex-col justify-center">
      <div className="h-52 absolute top-0 bg-linear-to-t from-transparent to-gray-950 w-full"></div>
      <MarketingMarquee />
      <CardsMarquee className="-right-[200px]" />
      <CardsMarquee direction="right" className="-right-[565px]" />

      <div className="p-5 max-w-[1426px] mx-auto w-full">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold text-balance">
            Creative strategy that drives real results
          </h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <Button>Get Started</Button>
          <button className="btn btn-lg btn-link no-underline text-white hover:text-main shadow-none">
            Portfolio <IoIosArrowForward className="size-5 text-main" />
          </button>
        </div>
      </div>
    </div>
  );
}
