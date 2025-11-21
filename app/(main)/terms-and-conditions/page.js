import GradText from "@/components/ui/GradText"
import TitleBanner from "@/components/ui/TitleBanner"

const page = () => {
    return (
        <main>
            <TitleBanner>Terms and Conditions</TitleBanner>
            <div className="max-w-[1426px] mx-auto px-5 py-10 sm:py-20">
                <div className="mb-10">
                    <h2 className="text-3xl lg:text-5xl font-semibold text-center mb-3 text-balance max-w-xl mx-auto">
                        Nexoro Solutions <GradText>Terms and Conditions</GradText>
                    </h2>
                    <p className="text-center"><b>Last Updated:</b> 20 November 2025</p>
                </div>
                <div className="bg-base-300 p-5 rounded-xl">
                    <p>Welcome to Nexoro Solutions, a professional digital marketing agency providing a wide range of digital services. By accessing our website and purchasing our services, you agree to the following Terms & Services.</p>
                    <br />
                    <ol className="pl-5 *:list-decimal *:text-2xl *:font-semibold">
                        <li>Services We Provide
                            <ul className="*:font-normal *:text-base *:list-disc text-gray-400">
                                <li>Social Media Management</li>
                                <li>Paid Advertising (Facebook, Instagram, Google Ads)</li>
                                <li>Branding & Logo Design</li>
                                <li>Graphic Design</li>
                                <li>Marketing Strategy & Consultancy</li>
                                <li>Website & Funnel Setup</li>
                            </ul>
                        </li>
                        <br />
                        <li>Client Responsibilities
                            <p className="font-normal text-base text-gray-400">Clients must provide accurate information, submit necessary materials, respond on time, and follow professional communication.</p>
                        </li>
                    </ol>
                </div>
            </div>
        </main>
    )
}

export default page
