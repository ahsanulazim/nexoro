"use client";
import { fetchServices } from "@/api/fetchServices";
import PriceCard from "@/components/dashboard/price/PriceCard";
import PriceForm from "@/components/dashboard/price/PriceForm";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const Pricing = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const [prices, setPrices] = useState("");

  useEffect(() => {
    if (services?.length > 0 && !prices) {
      setPrices(services[0].title);
    }
  }, [services, prices]);

  const selectedService = services?.find((s) => s.title === prices);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const existingPlans = selectedService?.plans?.length || 0;
  const formsToShow = Math.max(0, 3 - existingPlans);

  return (
    <>
      <div className="mb-5">
        <h1 className="text-center text-3xl font-bold">
          Pricing and Plans for each services
        </h1>
      </div>

      <section>
        <div className="text-center flex justify-center mb-10 bg-base-300 p-5 rounded-lg max-w-72 mx-auto">
          <fieldset className="fieldset">
            <legend className=" text-sm">Select Services</legend>
            <select
              value={prices}
              className="select bg-main border-main outline-none rounded-full"
              onChange={(e) => setPrices(e.target.value)}
            >
              {services?.map((service) => (
                <option key={service.title} className="hover:bg-base-100">
                  {service.title}
                </option>
              ))}
            </select>
          </fieldset>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 items-start md:grid-cols-2 lg:grid-cols-3 gap-5">
          {selectedService?.plans?.map((plan) => (
            <PriceCard key={plan.id} plan={plan} slug={selectedService.slug} />
          ))}

          {Array.from({ length: formsToShow }).map((_, i) => (
            <PriceForm key={i} slug={selectedService?.slug} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Pricing;