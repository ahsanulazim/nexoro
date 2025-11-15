import services from "@/json/services.json";
import BtnNeutral from "../ui/BtnNeutral";
import LightRays from "../effects/LightRays";

const Services = () => {
  return (
    <section className="relative">
      <LightRays
        raysOrigin="top-center"
        raysColor="#ce95fc"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className="custom-rays absolute! top-0 -z-10!"
      />
      <div className="max-w-[1426px] px-5 py-20 mx-auto z-10">
        <div className="max-w-4xl mx-auto mb-10">
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-balance">
            We are Offering the Best Solutions Quickly & Efficiently
          </h1>
        </div>
        <div className="flex gap-5 items-start justify-between">
          <div className="steps steps-vertical shrink-0 sticky top-30 hidden lg:inline-grid">
            {services.map((step) => (
              <nav className="step" key={step.title}>
                {step.title}
              </nav>
            ))}
          </div>
          <div className="bg-base-300 grow p-5 lg:p-10 rounded-lg flex flex-col gap-5">
            {services.map((service) => (
              <div
                key={service.title}
                className="flex flex-col gap-5 items-start p-5 lg:p-10 border border-base-100 rounded-md"
              >
                <h2 className="text-xl md:text-3xl font-semibold">
                  {service.title}
                </h2>
                <p className="opacity-50 text-sm">{service.description}</p>
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
