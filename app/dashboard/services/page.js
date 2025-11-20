import DashBread from "@/components/dashboard/DashBread";
import ServiceCard from "@/components/dashboard/services/ServiceCard";
import portfolios from "@/json/portfolio.json";

const Services = () => {
  return (
    <main className="flex flex-col gap-4">
      <section className="">
        <DashBread title="Services" />
        <h1 className="text-4xl font-semibold">Services</h1>
      </section>
      <section>
        <div className="">
          {portfolios.map((project) => (
            <ServiceCard key={project.title} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Services;
