'use client'

import { addMember } from "@/api/fetchTeam";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaBehance, FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { LuGlobe } from "react-icons/lu";
import { MdEmail } from "react-icons/md";
import { toast } from "react-toastify";

const TeamModal = ({ ref, isEditing }) => {

    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    //Add Mutation
    const mutation = useMutation({
        mutationFn: addMember,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["team"],
            });
            ref.current.close();
            toast.success("Member added successfully");
        },
        onError: (error) => {
            toast.error(error.massage);
        },
        onSettled: () => {
            setLoading(false);
        },
    });

    const handleTeam = (e) => {
        e.preventDefault();
        setLoading(true);
        const profilePic = e.target.profilePic.files[0]
        const formData = new FormData();
        formData.append("memberName", e.target.memberName.value);
        formData.append("role", e.target.role.value);
        if (e.target.website.value) {
            formData.append("website", `https://${e.target.website.value}`);
        }
        if (e.target.email.value) {
            formData.append("email", e.target.email.value);
        }
        if (e.target.behance.value) {
            formData.append("behance", `https://behance.net/${e.target.behance.value}`);
        }
        if (e.target.github.value) {
            formData.append("github", `https://github.com/${e.target.github.value}`);
        }
        if (e.target.linkedin.value) {
            formData.append("linkedin", `https://linkedin.com/in/${e.target.linkedin.value}`);
        }

        formData.append("folder", "profilePic");

        //Profile Pic condition
        if (profilePic) {
            const maxSize = 5 * 1024 * 1024;
            if (profilePic.size <= maxSize) {
                formData.append("profilePic", profilePic);
            } else {
                toast.error("Icon size must be less than 5MB");
                return; // stop submit if invalid
            }
        }

        mutation.mutate(formData)
        e.target.reset();

    }

    return (
        <dialog ref={ref} id="teamModal" className="modal">
            <div className="modal-box">
                <form className="fieldset" onSubmit={handleTeam}>
                    <h1 className="text-xl font-semibold">{isEditing ? "Edit" : "Add"} Member</h1>

                    <label className="label" htmlFor="memberName">
                        Member Name<span className={isEditing ? "hidden" : "text-red-600"}>*</span>
                    </label>
                    <input
                        type="text"
                        className="input w-full"
                        placeholder="Member Full Name"
                        name="memberName"
                        defaultValue={isEditing ? selectedService.title : ""}
                        required={isEditing ? false : true}
                    />
                    <label className="label" htmlFor="role">
                        Role<span className={isEditing ? "hidden" : "text-red-600"}>*</span>
                    </label>
                    <input
                        type="text"
                        className="input w-full"
                        placeholder="Set a Role of the Member"
                        name="role"
                        defaultValue={isEditing ? selectedService.slug : ""}
                        required={isEditing ? false : true}
                    />
                    <label className="label">Set Profile Pic<span className={isEditing ? "hidden" : "text-red-600"}>*</span></label>
                    <input
                        type="file"
                        className="file-input"
                        name="profilePic"
                        accept="image/jpg, image/jpeg, image/webp, image/avif, image/png"
                        required={isEditing ? false : true}
                    />
                    <label className="label italic">Max size 5MB</label>
                    <label className="label">Important Links</label>
                    <label className="input w-full">
                        <span className="label"><LuGlobe /></span>
                        <input type="text" placeholder="website.com" name="website" />
                    </label>
                    <label className="input w-full">
                        <span className="label"><MdEmail /></span>
                        <input type="text" placeholder="member@email.com" name="email" />
                    </label>
                    <label className="input w-full">
                        <span className="label"><FaBehance /></span>
                        <input type="text" placeholder="username" name="behance" />
                    </label>
                    <label className="input w-full">
                        <span className="label"><FaGithub /></span>
                        <input type="text" placeholder="username" name="github" />
                    </label>
                    <label className="input w-full">
                        <span className="label"><FaLinkedinIn /></span>
                        <input type="text" placeholder="username" name="linkedin" />
                    </label>
                    <div className="modal-action">
                        <button type="button" className="btn btn-error" onClick={() => ref.current.close()}>Close</button>
                        <button type="submit"
                            className={`btn btn-primary ${loading ? "" : "btn-nexoro-primary"
                                }`}
                            disabled={loading ? true : false}
                        >
                            {loading && <span className="loading loading-spinner"></span>} {isEditing ? "Update" : "Add"} Member
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    )
}

export default TeamModal
