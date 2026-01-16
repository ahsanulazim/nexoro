import Image from "next/image";
import {
  LuBriefcaseBusiness,
  LuBuilding,
} from "react-icons/lu";
import { motion } from "motion/react";

const TeamCard = ({ member, variants }) => {
  return (
    <motion.div variants={variants} className="hover-3d">
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
          <h2 className="card-title text-lg">
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
    </motion.div>
  );
};

export default TeamCard;
