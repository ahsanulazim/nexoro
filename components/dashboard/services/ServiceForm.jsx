import { addService } from "@/api/fetchServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { toast } from "react-toastify";

const ServiceForm = ({ ref }) => {

    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    //Add Mutation
    const mutation = useMutation({
        mutationFn: addService,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["services"],
            });
            ref.current.close();
            toast.success("Service added successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
        onSettled: () => {
            setLoading(false);
        }
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            serviceTitle: "",
            slug: "",
            shortDes: "",
            longDes: "",
            icon: null,
        }
    });

    const handleService = (data) => {
        setLoading(true);
        mutation.mutate(data);
    }

    const handleClose = () => {
        reset();
        ref.current.close();
    };


    return (
        <dialog ref={ref} id="serviceForm" className="modal">
            <div className="modal-box">
                <form className="fieldset" onSubmit={handleSubmit(handleService)} disabled={loading}>
                    <h1 className="text-xl font-semibold">Service Details</h1>

                    <label className="label" htmlFor="serviceTitle">
                        Service Title<span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        className="input w-full"
                        placeholder="Write Service Title"
                        {...register("serviceTitle", {
                            required: "Service Title is Required",
                            pattern: {
                                value: /^[A-Za-z\s]+$/,
                                message: "Only letters and spaces are allowed",
                            },

                        })}
                    />
                    {errors.serviceTitle && <p className="text-red-600">{errors.serviceTitle.message}</p>}
                    <label className="label" htmlFor="slug">
                        Slug<span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        className="input w-full"
                        placeholder="Set a Slug for The Service"
                        {...register("slug", {
                            required: "Slug is Required",
                            pattern: {
                                value: /^(?![0-9-]+$)(?:[a-z]{2,}-?|[0-9]-?)+(?<!-)$/,
                                message: "Wrong Slug Pattern",
                            },
                        })}
                    />
                    {errors.slug && <p className="text-red-600">{errors.slug.message}</p>}
                    <label className="label">Set Icon<span className="text-red-600">*</span></label>
                    <input
                        type="file"
                        className="file-input"
                        accept=".svg,image/svg+xml"
                        {...register("icon", {
                            required: "Upload an Icon",
                            validate: {
                                lessThan5MB: (files) => files[0].size <= 5 * 1024 * 1024 || "File size must be less than 5MB"
                            }
                        })}
                    />
                    <label className="label italic">SVG Only. Max size 5MB</label>
                    {errors.icon && <p className="text-red-600">{errors.icon.message}</p>}
                    <label className="label" htmlFor="shortDes">
                        Short Description<span className="text-red-600">*</span>
                    </label>
                    <textarea
                        placeholder="Write a short Description"
                        className="textarea w-full"
                        {...register("shortDes", {
                            required: "Give a Short Description",
                            minLength: {
                                value: 50,
                                message: "Write at least 50 Characters"
                            }
                        })}
                    ></textarea>
                    {errors.shortDes && <p className="text-red-600">{errors.shortDes.message}</p>}
                    <label className="label" htmlFor="longDes">
                        Long Description<span className="text-red-600">*</span>
                    </label>
                    <textarea
                        rows="4"
                        placeholder="Write a Long Description"
                        className="textarea w-full"
                        {...register("longDes", {
                            required: "Give a Long Description",
                            minLength: {
                                value: 250,
                                message: "Write at least 250 Characters"
                            }
                        })}
                    ></textarea>
                    {errors.longDes && <p className="text-red-600">{errors.longDes.message}</p>}

                    <div className="modal-action">
                        <button type="button" className="btn btn-error" onClick={handleClose}>Close</button>
                        <button
                            type="submit"
                            className={`btn btn-primary ${!loading ? "btn-nexoro-primary" : ""}`}
                            disabled={loading}
                        >
                            {loading && <span className="loading loading-spinner"></span>} Add Service
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    )
}

export default ServiceForm
