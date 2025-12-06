'use client'

import { FaBehance, FaGithub, FaLinkedinIn } from "react-icons/fa6"
import { LuBriefcase, LuGlobe, LuSquarePen, LuTrash2 } from "react-icons/lu"
import { MdMail } from "react-icons/md"

const TeamCard = ({ member }) => {
    return (
        <div className="card bg-base-300 shadow-lg rounded-3xl">
            <figure className="p-2">
                <img src="/assets/team/6.jpg" alt="Ahsanul Azim Plabon" className="rounded-2xl" />
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
                    <button className="btn btn-primary btn-nexoro-primary grow"><LuSquarePen /> Edit</button>
                    <button className="btn btn-square btn-error"><LuTrash2 /></button>
                </div>
            </div>
        </div>
    )
}

export default TeamCard
