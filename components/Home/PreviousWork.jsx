import GradText from "../ui/GradText";
import WorkMarquee from "../ui/WorkMarquee";

const PreviousWork = () => {
  return (
    <section className="bg-base-300" id="portfolio">
      <div className=" py-10 lg:py-20">
        <div className="max-w-4xl mx-auto mb-10">
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-balance">
            We Combine <GradText> Creative</GradText> Storytelling Strategy
          </h1>
        </div>
        <div>
          <WorkMarquee />
        </div>
      </div>
    </section>
  );
};

export default PreviousWork;
