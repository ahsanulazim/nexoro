import GradText from "@/components/ui/GradText";
import PricingCard from "@/components/ui/PricingCard";
import TitleBanner from "@/components/ui/TitleBanner";
import { LuHeadset, LuRefreshCw, LuShieldCheck } from "react-icons/lu";
import { fetchPlans } from "@/api/fetchPlans";
import { fetchService } from "@/api/fetchServices";
import { notFound } from "next/navigation";

const page = async ({ params }) => {
  const { prices } = await params;

  const service = await fetchService(prices);
  const plans = await fetchPlans(prices);

  if (!service || !plans) {
    return notFound();
  }

  return (
    <main>
      <TitleBanner>{service?.title}</TitleBanner>
      <div className="max-w-[1426px] mx-auto px-5 py-10 sm:py-20">
        <div className="mb-10">
          <h2 className="text-3xl lg:text-5xl font-semibold text-center mb-3">
            {service?.title} <GradText>Pricing</GradText>
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
          {plans?.map((plan) => (
            <PricingCard
              key={plan.id}
              title={plan.planName}
              price={plan.price}
              benefits={plan.benefits.map(b => b.value)}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default page;
