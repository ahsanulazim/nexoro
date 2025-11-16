import GradText from "../ui/GradText";
import ReviewMarquee from "../ui/ReviewMarquee";

const Review = () => {
  return (
    <section className="bg-base-300">
      <div className="max-w-[1426px] max-sm:py-10 px-5 py-20 mx-auto z-10">
        <div className="max-w-4xl mx-auto mb-10">
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-balance">
            The Best Reviews from <GradText>Clients</GradText>
          </h1>
        </div>
        <div className="flex flex-col gap-4">
          <ReviewMarquee direction="left" />
          <ReviewMarquee direction="right" />
        </div>
      </div>
    </section>
  );
};

export default Review;
