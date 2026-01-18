'use client'

import Link from "next/link"
import CatModal from "./CatModal"
import { Controller, useForm } from "react-hook-form"
import { LuArrowLeft, LuCirclePlus } from "react-icons/lu"
import ReactQuill from "react-quill-new"
import { useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { updateBlog } from "@/api/fetchBlogs"
import { fetchServices } from "@/api/fetchServices"

const EditPortfolio = ({ work }) => {

    //Category Fetch
    const { data: services, isLoading } = useQuery({
        queryKey: ["services"],
        queryFn: fetchServices,
    });

    //Tanstack Mutation
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, blogData }) => updateBlog(id, blogData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            toast.success("Blog Updated successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const { register, handleSubmit, control, formState: { errors, isDirty } } = useForm({
        defaultValues: {
            portfolioTitle: work.title,
            portfolioDescription: work.description,
            content: work.content,
            service: work.serviceId,
            visibility: `${work.visibility}`,
            image: null,
            author: work.author,
        }
    })

    const catRef = useRef();

    const onSubmit = (data) => {
        mutation.mutate({ id: blog._id, blogData: data })

    }

    return (
        <>
            <div className="mb-5 w-fit">
                <Link href="/dashboard/portfolio"><button className="text-lg flex items-center gap-4 cursor-pointer font-bold"><LuArrowLeft />Back to Portfolio</button></Link>
            </div>
            <form className="grid lg:grid-cols-4 gap-5 items-start" onSubmit={handleSubmit(onSubmit)}>
                <div className="fieldset lg:col-span-3 bg-base-200 border-base-300 rounded-box border p-5 max-lg:order-2">
                    <label htmlFor="portfolioTitle" className="label">Title <span className="text-red-600">*</span></label>
                    <input type="text" className="input w-full" placeholder="e.g. This Blog is about the services." {...register("portfolioTitle", { required: "Portfolio Title is required" })} />
                    {errors.portfolioTitle && <p className="text-red-600">{errors.portfolioTitle.message}</p>}
                    <label htmlFor="portfolioDescription" className="label">Short Description <span className="text-red-600">*</span></label>
                    <textarea className="textarea w-full" placeholder="Write a short description" {...register("portfolioDescription", { required: "Portfolio Description is required" })}></textarea>
                    {errors.portfolioDescription && <p className="text-red-600">{errors.portfolioDescription.message}</p>}
                    <label htmlFor="content" className="label">Content <span className="text-red-600">*</span></label>
                    <Controller
                        name="content"
                        rules={{ required: "Content is required" }}
                        control={control}
                        render={({ field }) => <ReactQuill theme="snow" className="border border-gray-600 rounded-md" {...field} />}
                    />
                    {errors.content && <p className="text-red-600">{errors.content.message}</p>}
                    <button className="btn btn-success mt-4" type="submit" disabled={mutation.isPending || !isDirty}>{mutation.isPending && <span className="loading loading-spinner"></span>} Update Portfolio</button>
                </div>
                <div className="flex flex-col gap-5 max-lg:order-1 sticky top-20">
                    <div className="fieldset bg-base-200 border-base-300 rounded-box border p-5">
                        <label className="label">Author</label>
                        <input type="text" className="input w-full" placeholder="Author Name" disabled {...register("author")} />
                    </div>

                    <div className="fieldset bg-base-200 border-base-300 rounded-box border p-5">
                        <label className="label" htmlFor="service">Select a Service<span className="text-red-600">*</span>
                        </label>
                        <select className="select w-full" defaultValue="" {...register("service", { required: "Service is required" })}>
                            <option value="" disabled={true}>Select Service</option>
                            {isLoading ? <option>Loading...</option> : services.map((service) => <option key={service._id} value={service._id}>{service.title}</option>)}
                        </select>
                        {errors.service && <p className="text-red-600">{errors.service.message}</p>}
                    </div>
                    <div className="fieldset bg-base-200 border-base-300 rounded-box border p-5">
                        <label htmlFor="visibility" className="label">Visibility <span className="text-red-600">*</span></label>
                        <div className="flex gap-3 items-center"><input type="radio" value={true} id="visible" className="radio radio-xs radio-success" {...register("visibility", { required: "Visibility is required" })} /><label htmlFor="visible">Visible</label></div>
                        <div className="flex gap-3 items-center"><input type="radio" value={false} id="hidden" className="radio radio-xs radio-success" {...register("visibility", { required: "Visibility is required" })} /><label htmlFor="hidden">Hidden</label></div>
                        {errors.visibility && <p className="text-red-600">{errors.visibility.message}</p>}
                    </div>
                    <div className="fieldset bg-base-200 border-base-300 rounded-box border p-5">
                        <label className="label">Portfolio Thumbnail <span className="text-red-600">*</span></label>
                        <img className="w-full rounded-md" src={work.image} alt={work.title} />
                        <input type="file" className="file-input w-full" accept="image/png, image/jpg, image/webp, image/avif, image/jpeg" {...register("image", {
                            validate: {
                                lessThan2MB: (files) => !files || files.length === 0 || files[0].size <= 2 * 1024 * 1024 || "File size must be less than 2MB"
                            }
                        })} />
                        {errors.image && <p className="text-red-600">{errors.image.message}</p>}
                        <label className="label">Max size 2MB</label>
                    </div>
                </div>
            </form>
        </>
    )
}

export default EditPortfolio