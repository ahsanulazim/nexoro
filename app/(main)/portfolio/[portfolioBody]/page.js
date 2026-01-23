import TitleBanner from "@/components/ui/TitleBanner"
import parse from 'html-react-parser';

const page = async ({ params }) => {

    const { portfolioBody } = await params;

    const portfolioData = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/portfolio/${portfolioBody}`).then(res => res.json())

    return (
        <main>
            <TitleBanner subtitle="Portfolio">{portfolioData.title}</TitleBanner>
            <div className="max-w-[1426px] mx-auto px-5 py-10 sm:py-20">
                <div className="mb-10 gap-5 items-start">
                    <div className="overflow-hidden">
                        <h1 className="text-3xl xs:text-5xl font-semibold">{portfolioData.title}</h1>
                        <h2 className="text-xl xs:text-3xl font-semibold">{portfolioData.description}</h2>
                        <div className="divider"></div>
                        <div className="blog-content">{parse(portfolioData.content.replace(/&nbsp;/g, " "))}</div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default page