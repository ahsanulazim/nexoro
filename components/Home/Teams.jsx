import GradText from "../ui/GradText";
import TeamCard from "../ui/TeamCard";
import teams from "@/json/teams.json";

const Teams = () => {
  return (
    <section>
      <div className="max-w-[1426px] px-5 py-20 mx-auto z-10">
        <div className="max-w-4xl mx-auto mb-10">
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-balance">
            Meet The Team That Makes <GradText>The Magic</GradText> Happen
          </h1>
        </div>
        <div className="grid grid-cols-3 gap-10">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Teams;
