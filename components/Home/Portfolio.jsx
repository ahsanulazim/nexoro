"use client";

import GradText from "../ui/GradText";
import PortfolioCard from "../ui/PortfolioCard";
import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/api/fetchServices";
import Link from "next/link";

const Portfolio = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  return (
    <section className="bg-base-300" id="services">
      <div className="max-w-[1426px] px-5 py-20 mx-auto z-10">
        <div className="max-w-4xl mx-auto mb-10">
          <h1
            initial="hidden"
            className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-balance"
          >
            Nexoro Offers a Full Suite of <GradText>Digital Services</GradText>
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            services
              ?.slice(0, 6)
              .map((service) => (
                <PortfolioCard key={service.title} service={service} />
              ))
          )}
        </div>
        <Link href="/services">
          <button className="btn btn-primary btn-nexoro-primary rounded-full mt-10 block mx-auto">
            View All Services
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Portfolio;
