'use client'

import { deleteMember } from "@/api/fetchTeam"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { FaBehance, FaGithub, FaLinkedinIn } from "react-icons/fa6"
import { LuBriefcase, LuGlobe, LuSquarePen, LuTrash2 } from "react-icons/lu"
import { MdMail } from "react-icons/md"

const TeamCard = ({ member, setSelectedMember, onEdit }) => {

    const { _id, public_id } = member;

    const queryClient = useQueryClient();

    const { mutate: removeMember, isPending } = useMutation({
        mutationFn: ({ _id, public_id }) => deleteMember(_id, public_id),
        onMutate: async ({ _id }) => {
            await queryClient.cancelQueries({ queryKey: ["team"] });
            const previousMember = queryClient.getQueryData(["team"]);
            queryClient.setQueryData(["team"], (oldMembers) =>
                oldMembers.filter((member) => member._id !== _id)
            );
            return { previousMember };
        },
        onError: (err, slug, context) => {
            queryClient.setQueryData(["team"], context.previousMember);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["team"] });
        },
    });

    return (
        <div className="card bg-base-300 shadow-lg rounded-3xl">
            <figure className="p-2">
                <Image width={500} height={500} src={member.profilePic} alt={member.memberName} className="rounded-2xl" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{member.memberName}</h2>
                <p className="flex items-center gap-2"><LuBriefcase className="text-lg" />{member.role}</p>
                <div>
                    <h3 className="mb-2 opacity-50">Important Links</h3>
                    <div className="flex gap-2 text-lg">
                        {member.website && <a href={member.website}><LuGlobe /></a>}
                        {member.email && <a href={`mailto:${member.email}`}><MdMail /></a>}
                        {member.behance && <a href={member.behance}><FaBehance /></a>}
                        {member.github && <a href={member.github}><FaGithub /></a>}
                        {member.linkedin && <a href={member.linkedin}><FaLinkedinIn /></a>}
                    </div>
                </div>
                <div className="card-actions flex-row">
                    <button className="btn btn-primary btn-nexoro-primary grow" onClick={() => onEdit(member)}><LuSquarePen /> Edit</button>
                    <button className="btn btn-square btn-error" onClick={() => removeMember({ _id, public_id })}><LuTrash2 /></button>
                </div>
            </div>
        </div>
    )
}

export default TeamCard
