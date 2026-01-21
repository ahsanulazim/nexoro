import PortFilter from "@/components/portfolio/PortFilter"
import PortfolioCategory from "@/components/portfolio/PortfolioCategory"
import GradText from "@/components/ui/GradText"
import TitleBanner from "@/components/ui/TitleBanner"
import { LuSlidersHorizontal } from "react-icons/lu"


const layout = ({ children }) => {

    return (
        <main>
            <TitleBanner>Portfolio</TitleBanner>
            <div className="max-w-[1426px] mx-auto px-5 py-10 sm:py-20">
                <div className="mb-10 flex flex-col gap-5">
                    <h2 className="text-3xl lg:text-5xl font-semibold text-center">
                        Nexoro Solutions <GradText>Portfolio</GradText>
                    </h2>
                    <PortFilter>
                        <label htmlFor="filter" className="btn btn-success lg:hidden"><LuSlidersHorizontal /> Filter</label>
                    </PortFilter>
                </div>
                <section>
                    <div className="grid lg:grid-cols-4 gap-5 items-start">
                        <PortfolioCategory className="col-span-1 rounded-box w-full sticky top-32 max-lg:hidden" />
                        <div className="lg:col-span-3 w-full">
                            {children}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default layout