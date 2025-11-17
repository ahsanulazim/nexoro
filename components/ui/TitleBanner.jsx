import Breadcrums from "./Breadcrums";

const TitleBanner = ({ children, link }) => {
  return (
    <section className="h-96 flex flex-col justify-center bg-[url(/assets/Fractal-Glass.webp)] bg-no-repeat bg-cover relative">
      <div className="h-36 absolute top-0 bg-linear-to-t from-transparent via-gray-900 to-gray-950 w-full"></div>
      <div className="max-w-[1426px] mx-auto p-5 flex flex-col items-center">
        <h1 className="text-5xl font-semibold text-center">{children}</h1>
        <Breadcrums>{children}</Breadcrums>
      </div>
    </section>
  );
};

export default TitleBanner;
