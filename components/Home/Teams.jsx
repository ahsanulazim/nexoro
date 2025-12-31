"use client";

import { useQuery } from "@tanstack/react-query";
import GradText from "../ui/GradText";
import TeamCard from "../ui/TeamCard";
import { fetchMembers } from "@/api/fetchTeam";

const Teams = () => {
  const {
    data: team,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["team"],
    queryFn: fetchMembers,
  });

  return (
    <section className="relative">
      <img
        src="/assets/s2-bg-shape.webp"
        alt="pattern"
        className="absolute top-0 -z-1 rotate-180"
      />
      <div className="max-w-[1426px] px-5 py-10 lg:py-20 mx-auto z-10">
        <div className="max-w-4xl mx-auto mb-10">
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-balance">
            Meet The Team That Makes <GradText>The Magic</GradText> Happen
          </h1>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 lg:gap-10">
          {team?.map((member) => (
            <TeamCard key={member.memberName} member={member} />
          ))}
        </div>
      </div>
      <img
        src="/assets/s2-bg-shape.webp"
        alt="pattern"
        className="absolute bottom-0 -z-1"
      />
    </section>
  );
};

export default Teams;
