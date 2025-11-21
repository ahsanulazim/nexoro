import GradText from "@/components/ui/GradText"
import TitleBanner from "@/components/ui/TitleBanner"
import { LuMail, LuPhone } from "react-icons/lu"

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
                <div className="bg-base-300 p-5 md:p-10 rounded-xl">
                    <p>Welcome to Nexoro Solutions, a professional digital marketing agency providing a wide range of digital services. By accessing our website and purchasing our services, you agree to the following Terms & Services.</p>
                    <br />
                    <ol className="pl-10 *:list-decimal *:text-2xl *:font-semibold">
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
                        <br />
                        <li>Payment Terms
                            <p className="font-normal text-base text-gray-400">Full payment must be made before project start. Monthly services require advance payment. Additional custom work requires extra charges.</p>
                        </li>
                        <br />
                        <li> Revisions
                            <p className="font-normal text-base text-gray-400">Packages include limited revisions. Extra revisions cost additional fees. Revisions do not include redesign unless agreed.</p>
                        </li>
                        <br />
                        <li> Project Delivery Timeline
                            <p className="font-normal text-base text-gray-400">Timeline begins after receiving all required materials. Client delays extend delivery.</p>
                        </li>
                        <br />
                        <li>Intellectual Property Rights
                            <p className="font-normal text-base text-gray-400">Final design rights transfer to client upon full payment. Source files provided only if included or purchased. Nexoro may use work in portfolio unless requested otherwise.</p>
                        </li>
                        <br />
                        <li> Confidentiality
                            <p className="font-normal text-base text-gray-400">All client information remains confidential.</p>
                        </li>
                        <br />
                        <li> Termination of Services
                            <p className="font-normal text-base text-gray-400">Service may be terminated for unpaid dues, violations, abuse, or unresponsiveness. No refund in such cases.</p>
                        </li>
                        <br />
                        <li> Limitation of Liability
                            <p className="font-normal text-base text-gray-400">Nexoro Solutions is not responsible for platform issues, copyrighted materials from clients, or business losses.</p>
                        </li>
                        <br />
                        <li> Contact Information
                            <ul className="*:font-normal *:text-base *:text-gray-400">
                                <li className="flex items-center gap-2"><LuMail /> your-email@example.com</li>
                                <li className="flex items-center gap-2"><LuPhone /> your-number</li>
                            </ul>
                        </li>
                    </ol>
                </div>
            </div>
        </main>
    )
}

export default page
