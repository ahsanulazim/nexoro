"use client";
import { LuHeadset, LuRefreshCw, LuShieldCheck } from "react-icons/lu";
import GradText from "../ui/GradText";
import PricingCard from "../ui/PricingCard";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "../ui/Loader";
import { fetchPlans } from "@/api/fetchPlans";
import { fetchServices } from "@/api/fetchServices";
import PlansSkeleton from "./PlansSkeleton";

const Plans = () => {

  const { data: services, isLoading: loadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const [selectedSlug, setSelectedSlug] = useState("");


  const { data: plans, isLoading: loadingPlans } = useQuery({
    queryKey: ["plans", selectedSlug],
    queryFn: () => fetchPlans(selectedSlug),
    enabled: !!selectedSlug,
  });

  useEffect(() => {
    if (services?.length > 0 && !selectedSlug) {
      setSelectedSlug(services[0].slug);
    }
  }, [services, selectedSlug]);

  if (loadingServices) {
    return <Loader />;
  }

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
            value={selectedSlug}
            className="select bg-main border-main outline-none rounded-full"
            onChange={(e) => setSelectedSlug(e.target.value)}
          >
            {services?.map((service) => (
              <option key={service.slug} value={service.slug} className="hover:bg-base-100">
                {service.title}
              </option>
            ))}
          </select>

        </fieldset>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loadingPlans ? (
          Array.from({ length: 3 }).map((_, i) => (
            <PlansSkeleton key={i} />
          ))
        ) : (
          Array.isArray(plans) &&
          plans.map((plan) => (
            <PricingCard
              key={plan.id}
              title={plan.planName}
              price={plan.price}
              benefits={plan.benefits.map((b) => b.value)}
            />
          ))
        )}

      </div>
    </div>
  );
};

export default Plans;
