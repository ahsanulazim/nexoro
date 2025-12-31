import Image from "next/image";
import {
  LuBriefcaseBusiness,
  LuBuilding,
  LuGithub,
  LuMail,
} from "react-icons/lu";

const TeamCard = ({ member }) => {
  return (
    <div className="hover-3d">
      <div className="card bg-base-300 shadow-sm">
        <figure>
          <Image
            width={600}
            height={600}
            className="w-full"
            src={member.profilePic}
            alt={member.memberName}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title max-xs:text-xl text-lg sm:text-2xl">
            {member.memberName}
          </h2>
          <div>
            <p className="flex items-center gap-2">
              <LuBriefcaseBusiness /> {member.role}
            </p>
            <p className="flex items-center gap-2">
              <LuBuilding />
              Nexoro Solution
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
