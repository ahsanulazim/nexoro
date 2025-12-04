"use client";

import { fetchServices } from "@/api/fetchServices";
import DashBread from "@/components/dashboard/DashBread";
import ServiceCard from "@/components/dashboard/services/ServiceCard";
import ServiceModal from "@/components/dashboard/services/ServiceModal";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { LuPlus } from "react-icons/lu";

const Services = () => {
  const addService = useRef();

  const {
    data: services,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  return (
    <>
      <ServiceModal ref={addService} />
      <main className="flex flex-col gap-4">
        <section className="">
          <DashBread title="Services" />
          <div className="flex items-center justify-between gap-5">
            <h1 className="text-4xl font-semibold">Services</h1>
            <button
              className="btn btn-primary btn-nexoro-primary"
              onClick={() =>
                document.getElementById("serviceModal").showModal()
              }
            >
              <LuPlus />
              Add Service
            </button>
          </div>
        </section>
        <section>
          {services?.length === 0 ? (
            <p>No Services Added Yet</p>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {services?.map((service) => (
                <ServiceCard key={service.title} service={service} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Services;
