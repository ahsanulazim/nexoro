"use client";
import { LuHeadset, LuRefreshCw, LuShieldCheck } from "react-icons/lu";
import GradText from "../ui/GradText";
import services from "@/json/services.json";
import PricingCard from "../ui/PricingCard";
import { useState } from "react";

const Plans = () => {
  const [prices, setPrices] = useState(services[0].title);

  const serviceData = services.find((service) => service.title === prices);

  return (
    <div className="max-w-[1426px] mx-auto px-5 py-10 sm:py-20">
      <div className="mb-10">
        <h2 className="text-3xl lg:text-5xl font-semibold text-center mb-3">
          Nexoro Solutions <GradText>Pricing</GradText>
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
      <div className="text-center flex justify-center mb-10 bg-base-300 p-5 rounded-lg max-w-72 mx-auto cardAnimation">
        <fieldset className="fieldset">
          <legend className=" text-sm">Select Services</legend>
          <select
            defaultValue={prices}
            className="select bg-main border-main outline-none rounded-full"
            onChange={(e) => setPrices(e.target.value)}
          >
            {services.map((service) => (
              <option key={service.title} className="hover:bg-base-100">
                {service.title}
              </option>
            ))}
          </select>
        </fieldset>
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
  );
};

export default Plans;
