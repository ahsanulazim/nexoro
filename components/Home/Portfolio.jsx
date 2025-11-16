import GradText from "../ui/GradText";
import portfolios from "@/json/portfolio.json";
import PortfolioCard from "../ui/PortfolioCard";

const Portfolio = () => {
  return (
    <section className="bg-base-300">
      <div className="max-w-[1426px] px-5 py-20 mx-auto z-10">
        <div className="max-w-4xl mx-auto mb-10">
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-balance">
            Nexoro Offers a Full Suite of <GradText>Digital Services</GradText>
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {portfolios.map((project) => (
            <PortfolioCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
