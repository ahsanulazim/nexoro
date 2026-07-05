"use client";

import DashBread from "@/components/dashboard/DashBread";
import TeamCardSkeleton from "@/components/dashboard/skeleton/TeamCardSkeleton";
import TeamCard from "@/components/dashboard/team/TeamCard";
import TeamModal from "@/components/dashboard/team/TeamModal";
import { MyContext } from "@/context/MyProvider";
import { useContext, useRef, useState } from "react";
import { LuPlus } from "react-icons/lu";

const Team = () => {
  const { team, teamLoading, teamError } = useContext(MyContext);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const memberRef = useRef();

  const onEdit = (member) => {
    setIsEditing(true);
    setSelectedMember(member);
    document.getElementById("teamModal").showModal();
  };

  return (
    <>
      <TeamModal
        ref={memberRef}
        isEditing={isEditing}
        selectedMember={selectedMember}
      />
      <main className="flex flex-col gap-4">
        <section className="">
          <DashBread title="Team" />
          <div className="flex items-center justify-between gap-5">
            <h1 className="text-4xl font-semibold">Team</h1>
            <button
              className="btn btn-primary btn-nexoro-primary"
              onClick={() => {
                document.getElementById("teamModal").showModal();
                setIsEditing(false);
              }}
            >
              <LuPlus /> Add Member
            </button>
          </div>
        </section>
        <section>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {teamLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TeamCardSkeleton key={i} />
              ))
            ) : teamError ? (
              <p className="text-error">Failed to load team</p>
            ) : (
              team.map((member) => (
                <TeamCard
                  key={member.memberName}
                  member={member}
                  setIsEditing={setIsEditing}
                  setSelectedMember={setSelectedMember}
                  onEdit={onEdit}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Team;
