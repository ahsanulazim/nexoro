'use client'

import { fetchMembers } from "@/api/fetchTeam";
import DashBread from "@/components/dashboard/DashBread"
import TeamCard from "@/components/dashboard/team/TeamCard"
import TeamModal from "@/components/dashboard/team/TeamModal";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { LuPlus } from "react-icons/lu";

const Team = () => {

    const [isEditing, setIsEditing] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const memberRef = useRef();

    const { data: team, isLoading, isError } = useQuery({
        queryKey: ["team"],
        queryFn: fetchMembers,
    });

    const onEdit = (member) => {
        setIsEditing(true);
        setSelectedMember(member);
        document.getElementById("teamModal").showModal();
    }

    return (
        <>
            <TeamModal ref={memberRef} isEditing={isEditing} selectedMember={selectedMember} />
            <main className="flex flex-col gap-4">
                <section className="">
                    <DashBread title="Team" />
                    <div className="flex items-center justify-between gap-5">
                        <h1 className="text-4xl font-semibold">Team</h1>
                        <button className="btn btn-primary btn-nexoro-primary" onClick={() => {
                            document.getElementById("teamModal").showModal();
                            setIsEditing(false);
                        }}><LuPlus /> Add Member</button>
                    </div>
                </section>
                <section>
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {team?.map((member) => <TeamCard key={member.memberName} member={member} setIsEditing={setIsEditing} setSelectedMember={setSelectedMember} onEdit={onEdit} />)}
                    </div>
                </section>
            </main>
        </>
    )
}

export default Team
