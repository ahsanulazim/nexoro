"use client";

import { fetchServices } from "@/api/fetchServices";
import GradText from "@/components/ui/GradText";
import PortfolioCard from "@/components/ui/PortfolioCard";
import TitleBanner from "@/components/ui/TitleBanner";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const page = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  return (
    <main>
      <TitleBanner>Services</TitleBanner>
      <section className="bg-base-300" id="services">
        <div className="max-w-[1426px] px-5 py-20 mx-auto z-10">
          <div className="max-w-4xl mx-auto mb-10">
            <h1
              initial="hidden"
              className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-balance"
            >
              Nexoro Offers a Full Suite of
              <GradText>Digital Services</GradText>
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              services?.map((service) => (
                <PortfolioCard key={service.title} service={service} />
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default page;
