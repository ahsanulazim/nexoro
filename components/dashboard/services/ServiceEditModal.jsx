'use client'

import { updateService } from "@/api/fetchServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const ServiceEditModal = ({ ref, service }) => {

    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, formData }) => updateService(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
            ref.current.close();
            toast.success("Service updated successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
        onSettled: () => {
            setLoading(false);
        },
    });

    const handleEdit = (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("title", e.target.serviceTitle.value);
        formData.append("slug", e.target.slug.value);
        formData.append("shortDes", e.target.shortDes.value);
        formData.append("longDes", e.target.longDes.value);
        formData.append("folder", "icons");

        const icon = e.target.icon.files[0];
        if (icon) {
            const maxSize = 5 * 1024 * 1024;
            if (icon.size <= maxSize) {
                formData.append("icon", icon);
            } else {
                toast.error("Icon size must be less than 5MB");
                setLoading(false);
                return;
            }
        }

        mutation.mutate({ id: service._id, formData });
    };

    return (
        <dialog ref={ref} id="editServiceModal" className="modal">
            <div className="modal-box">
                <form className="fieldset" onSubmit={handleEdit}>
                    <h1 className="text-xl font-semibold">Edit Service</h1>

                    <label className="label">Service Title</label>
                    <input
                        type="text"
                        name="serviceTitle"
                        defaultValue={service?.title}
                        className="input w-full"
                        required
                    />

                    <label className="label">Slug</label>
                    <input
                        type="text"
                        name="slug"
                        defaultValue={service?.slug}
                        className="input w-full"
                        required
                    />

                    <label className="label">Set Icon</label>
                    <input type="file" className="file-input" name="icon" />
                    <label className="label italic">Max size 5MB</label>

                    <label className="label">Short Description</label>
                    <textarea
                        name="shortDes"
                        defaultValue={service?.shortDes}
                        className="textarea w-full"
                    />

                    <label className="label">Long Description</label>
                    <textarea
                        name="longDes"
                        defaultValue={service?.longDes}
                        rows="4"
                        className="textarea w-full"
                    />

                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn btn-error"
                            onClick={() => ref.current.close()}
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className={`btn btn-primary ${loading ? "" : "btn-nexoro-primary"}`}
                            disabled={loading}
                        >
                            {loading && <span className="loading loading-spinner"></span>} Update Service
                        </button>
                    </div>
                </form>
            </div>
        </dialog>

    )
}

export default ServiceEditModal
