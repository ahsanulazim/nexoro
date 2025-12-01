import { IoIosArrowForward } from "react-icons/io"
import Button from "./ui/Button"
import HeroMarquee from "./HeroMarquee"
import Badge from "./Badge"

const HeroTwo = () => {
    return (
        <section className=" bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat pt-28 md:pt-40">
            <div className="hero mb-10 md:mb-20">
                <div className="hero-content text-center">
                    <div className="">
                        <Badge />
                        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-balance">
                            Creative Strategy that Drives Real Results
                        </h1>
                        <p className="py-6 md:text-xl text-balance max-w-3xl mx-auto">
                            We&apos;re a team of expert who&apos;ve been delivering digital success for more than a decade. Discover why businesses trust us to drive their growth.
                        </p>
                        <div className="max-xs:mt-5">
                            <Button>Get Started</Button>
                            <button className="btn sm:btn-lg btn-link no-underline text-white hover:text-main shadow-none">
                                Portfolio <IoIosArrowForward className="size-5 text-main" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            <div className="max-w-[1426px] mx-auto px-5 -mb-5">
                <HeroMarquee />
            </div>
        </section>
    )
}

export default HeroTwo
