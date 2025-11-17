import { LuHeadset, LuRefreshCw, LuShieldCheck } from "react-icons/lu";
import GradText from "../ui/GradText";
import services from "@/json/services.json";
import PricingCard from "../ui/PricingCard";

const Plans = () => {
  return (
    <div className="max-w-[1426px] mx-auto px-5 py-20">
      <div className="mb-10">
        <h2 className="text-3xl lg:text-5xl font-semibold text-center mb-3">
          Nexoro Solutions <GradText>Pricing</GradText>
        </h2>
        <ul className="flex justify-center gap-10 *:flex *:items-center *:gap-2">
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
      <div className="text-center flex justify-center mb-10">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Select Services</legend>
          <select defaultValue="Facebook Ads Campaigns" className="select">
            {services.map((service) => (
              <option key={service.title}>{service.title}</option>
            ))}
          </select>
        </fieldset>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <PricingCard />
        <PricingCard />
        <PricingCard />
      </div>
    </div>
  );
};

export default Plans;
