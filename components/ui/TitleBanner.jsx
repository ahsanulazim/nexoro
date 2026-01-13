import Breadcrums from "./Breadcrums";

const TitleBanner = ({ children, subtitle }) => {
  return (
    <section className="h-64 xs:h-72 lg:h-96 flex flex-col justify-center bg-[url(/assets/Fractal-Glass.webp)] bg-no-repeat bg-cover relative">
      <div className="h-16 xs:h-24 lg:h-36 absolute top-0 bg-linear-to-t from-transparent to-gray-950 w-full"></div>
      <div className="max-w-[1426px] mx-auto p-5 flex flex-col items-center">
        <h1 className="text-3xl lg:text-5xl font-semibold text-center mb-2">
          {children}
        </h1>
        <Breadcrums subtitle={subtitle}>{children}</Breadcrums>
      </div>
    </section>
  );
};

export default TitleBanner;
