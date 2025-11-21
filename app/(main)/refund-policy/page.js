import GradText from "@/components/ui/GradText"
import TitleBanner from "@/components/ui/TitleBanner"

const page = () => {
    return (
        <main>
            <TitleBanner>Refund Policy</TitleBanner>
            <div className="max-w-[1426px] mx-auto px-5 py-10 sm:py-20">
                <div className="mb-10">
                    <h2 className="text-3xl lg:text-5xl font-semibold text-center mb-3 text-balance max-w-xl mx-auto">
                        Nexoro Solutions <GradText>Refund</GradText> Policy
                    </h2>
                    <p className="text-center"><b>Last Updated:</b> 20 November 2025</p>
                </div>
            </div>
        </main>
    )
}

export default page
