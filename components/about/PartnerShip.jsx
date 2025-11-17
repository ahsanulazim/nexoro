import ClientLogo from "../ClientLogo";

const PartnerShip = () => {
  return (
    <>
      <section data-theme="light">
        <div className="max-w-[1426px] mx-auto pt-10">
          <h3 className="text-main text-center font-bold sm:text-lg">
            A True Partnership
          </h3>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-balance text-center">
            We work hand-in-hand with our clients to turn ideas into real
            results.
          </h2>
        </div>
      </section>
      <ClientLogo />
    </>
  );
};

export default PartnerShip;
