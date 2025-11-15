import LightRays from "../effects/LightRays";
import ServiceStep from "../ui/ServiceStep";

const Services = () => {
  return (
    <section className="relative">
      <LightRays
        raysOrigin="top-center"
        raysColor="#fffff"
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
        <ServiceStep />
      </div>
    </section>
  );
};

export default Services;
