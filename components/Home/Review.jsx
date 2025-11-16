import GradText from "../ui/GradText";
import ReviewCard from "../ui/ReviewCard";

const Review = () => {
  return (
    <section className="bg-base-300">
      <div className="max-w-[1426px] px-5 py-20 mx-auto z-10">
        <div className="max-w-4xl mx-auto mb-10">
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-balance">
            The Best Reviews from
            <GradText>Clients</GradText>
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <ReviewCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Review;
