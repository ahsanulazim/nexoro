import GradText from "../ui/GradText";
import TeamCard from "../ui/TeamCard";
import teams from "@/json/teams.json";

const Teams = () => {
  return (
    <section className="relative">
      <img src="/assets/s2-bg-shape.webp" alt="pattern" className="absolute top-0 -z-1 rotate-180" />
      <div className="max-w-[1426px] px-5 py-10 lg:py-20 mx-auto z-10">
        <div className="max-w-4xl mx-auto mb-10">
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-balance">
            Meet The Team That Makes <GradText>The Magic</GradText> Happen
          </h1>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-10">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </div>
      <img src="/assets/s2-bg-shape.webp" alt="pattern" className="absolute bottom-0 -z-1" />
    </section>
  );
};

export default Teams;
