import DashBread from "@/components/dashboard/DashBread";
import ServiceCard from "@/components/dashboard/services/ServiceCard";
import services from "@/json/services.json";

const Services = () => {
  return (
    <main className="flex flex-col gap-4">
      <section className="">
        <DashBread title="Services" />
        <h1 className="text-4xl font-semibold">Services</h1>
      </section>
      <section>
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Services;
