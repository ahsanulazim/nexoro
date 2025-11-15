import services from "@/json/services.json";
import BtnNeutral from "../ui/BtnNeutral";

const Services = () => {
  return (
    <section>
      <div className="max-w-[1426px] px-5 py-10 mx-auto">
        <div className="max-w-4xl mx-auto mb-10">
          <h1 className="text-center text-5xl font-semibold text-balance">
            We are Offering the Best Solutions Quickly & Efficiently
          </h1>
        </div>
        <div className="flex gap-5 items-start justify-between">
          <div className="steps steps-vertical shrink-0 sticky top-30">
            {services.map((step) => (
              <nav className="step" key={step.title}>
                {step.title}
              </nav>
            ))}
          </div>
          <div className="bg-base-300 grow p-10 rounded-lg flex flex-col gap-5">
            {services.map((service) => (
              <div
                key={service.title}
                className="flex flex-col gap-5 items-start p-10 border border-base-100 rounded-md"
              >
                <h2 className="text-3xl font-semibold">{service.title}</h2>
                <p className="opacity-50">{service.description}</p>
                <BtnNeutral>Learn More</BtnNeutral>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
