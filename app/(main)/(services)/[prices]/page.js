import GradText from "@/components/ui/GradText";
import PricingCard from "@/components/ui/PricingCard";
import TitleBanner from "@/components/ui/TitleBanner";
import { LuHeadset, LuRefreshCw, LuShieldCheck } from "react-icons/lu";
import services from "@/json/services.json";

const page = async ({ params }) => {
  const { prices } = await params;

  const serviceData = services.find((service) => service.link === prices);

  return (
    <main>
      <TitleBanner>{serviceData.title}</TitleBanner>
      <div className="max-w-[1426px] mx-auto px-5 py-10 sm:py-20">
        <div className="mb-10">
          <h2 className="text-3xl lg:text-5xl font-semibold text-center mb-3">
            {serviceData.title} <GradText>Pricing</GradText>
          </h2>
          <ul className="flex justify-center gap-y-2 gap-x-3 max-md:text-sm md:gap-x-8 md:gap-y-5 *:flex *:items-center *:gap-2 flex-wrap">
            <li>
              <LuHeadset />
              24/7 support
            </li>
            <li>
              <LuShieldCheck />
              30-day money-back guarantee
            </li>
            <li>
              <LuRefreshCw />
              Cancel anytime
            </li>
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {serviceData.plans.map((plan) => (
            <PricingCard
              key={plan.title}
              title={plan.title}
              price={plan.price}
              benefits={plan.benefits}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default page;
