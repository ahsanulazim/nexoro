import Image from "next/image";
import { LuBriefcaseBusiness, LuBuilding, LuGithub, LuMail } from "react-icons/lu";

const TeamCard = ({ team }) => {
  return (
    <div className="hover-3d">
      <div className="card bg-base-300 shadow-sm">
        <figure>
          <Image
            width={600}
            height={600}
            className="w-full"
            src={team.image}
            alt={team.name}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title max-xs:text-xl text-lg sm:text-2xl">{team.name}</h2>
          <p className="flex items-center gap-2">
            <LuBriefcaseBusiness /> {team.post}
          </p>
          <p className="flex items-center gap-2"><LuBuilding />{team.company}</p>
          <div className="flex gap-2">
            {team.social?.email && (
              <a
                href={`mailto:${team.social.email}`}
                className="btn btn-square btn-primary bg-main border-main"
              >
                <LuMail />
              </a>
            )}
            {team.social?.github && (
              <a
                href={team.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-square btn-primary bg-main border-main"
              >
                <LuGithub />
              </a>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
