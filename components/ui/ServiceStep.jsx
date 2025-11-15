"use client";

import { useInView } from "react-intersection-observer";
import BtnNeutral from "../ui/BtnNeutral";
import services from "@/json/services.json";
import { useEffect, useState } from "react";
import ServiceNav from "./ServiceNav";

const ServiceStep = () => {
  const [activeId, setActiveId] = useState("Facebook Ads Campaigns");

  return (
    <div className="flex gap-5 items-start justify-between">
      <ServiceNav services={services} activeId={activeId} />
      <div className="bg-base-300 grow p-5 lg:p-10 rounded-lg flex flex-col gap-5">
        {services.map((service) => {
          const { ref, inView } = useInView({
            threshold: 1,
          });

          useEffect(() => {
            if (inView) {
              setActiveId(service.title);
            }
          }, [inView, service.title]);

          return (
            <div
              key={service.title}
              id={service.title}
              ref={ref}
              className="flex flex-col gap-5 items-start p-5 lg:p-10 border border-base-100 rounded-md"
            >
              <h2 className="text-xl md:text-3xl font-semibold">
                {service.title}
              </h2>
              <p className="opacity-50 max-md:text-sm text-lg">
                {service.description}
              </p>
              <BtnNeutral>Learn More</BtnNeutral>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceStep;
