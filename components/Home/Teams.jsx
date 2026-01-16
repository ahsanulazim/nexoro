"use client";

import { useQuery } from "@tanstack/react-query";
import GradText from "../ui/GradText";
import TeamCard from "../ui/TeamCard";
import { fetchMembers } from "@/api/fetchTeam";
import { useEffect, useRef } from "react";
import { useAnimation, useInView, motion } from "motion/react";

const teamVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const gridVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2, // each card delayed by 0.2s
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Teams = () => {

  //animation started

  const teamRef = useRef();
  const inView = useInView(teamRef, {
    once: true,
    amount: 0.2,
  });
  const teamControls = useAnimation();
  const cardControls = useAnimation();

  useEffect(() => {
    async function sequence() {
      if (inView) {
        await teamControls.start("visible");
        await cardControls.start("visible");
      }
    }
    sequence();
  }, [inView, teamControls]);

  //animation ended

  const {
    data: team,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["team"],
    queryFn: fetchMembers,
  });

  return (
    <section ref={teamRef} className="relative" id="team">
      <img
        src="/assets/s2-bg-shape.webp"
        alt="pattern"
        className="absolute top-0 -z-1 rotate-180"
      />
      <div className="max-w-[1426px] px-5 py-10 lg:py-20 mx-auto z-10">
        <div className="max-w-4xl mx-auto mb-10">
          <motion.h1 initial="hidden" variants={teamVariant} animate={teamControls} className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-balance">
            Meet The Team That Makes <GradText>The Magic</GradText> Happen
          </motion.h1>
        </div>
        <motion.div variants={gridVariant} initial="hidden" animate={cardControls} className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 lg:gap-10">
          {team?.map((member) => (
            <TeamCard key={member.memberName} member={member} variants={cardVariant} />
          ))}
        </motion.div>
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
