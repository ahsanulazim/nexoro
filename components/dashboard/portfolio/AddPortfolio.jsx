'use client'

import { Controller, useForm } from "react-hook-form";
import { LuArrowLeft } from "react-icons/lu"
import ReactQuill from "react-quill-new";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "@/firebase/firebase.config.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRef } from "react";
import Link from "next/link";
import { fetchServices } from "@/api/fetchServices";
import { imageHandler } from "@/utils/imageHandler";
import { postPortfolio } from "@/api/fetchPortfolios";

const AddPortfolio = () => {

    //get user
    const [user] = useAuthState(auth);

    const quillRef = useRef();

    const { register, control, reset, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            portfolioTitle: "",
            portfolioDescription: "",
            content: "",
            service: "",
            visibility: "",
            image: null,
            author: user?.displayName || "",
        },
    });

    //Tanstack Mutation

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: postPortfolio,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            toast.success("Portfolio Posted successfully");
            reset();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    //Category Fetch
    const { data: services, isLoading } = useQuery({
        queryKey: ["services"],
        queryFn: fetchServices,
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    }

    //quill formats
    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'list', 'align',
        'blockquote', 'code-block',
        'link', 'image'
    ];

    const modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],   // Heading options
                ['bold', 'italic', 'underline', 'strike'], // Text styles
                [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Lists
                [{ 'align': [] }], // Alignment
                ['blockquote', 'code-block'], // Block styles
                ['link', 'image'], // Links & Images
                ['clean'] // Remove formatting
            ],
            handlers: {
                image: () => {
                    imageHandler(quillRef);
                },
            }
        }
    };


    return (
        <>
            <div className="mb-5 w-fit">
                <Link href="/dashboard/portfolio"><button className="text-lg flex items-center gap-4 cursor-pointer font-bold"><LuArrowLeft />Back to Portfolio</button></Link>
            </div>
            <form className="grid lg:grid-cols-4 gap-5 items-start" onSubmit={handleSubmit(onSubmit)}>
                <div className="fieldset lg:col-span-3 bg-base-200 border-base-300 rounded-box border p-5 max-lg:order-2">
                    <label htmlFor="portfolioTitle" className="label">Title <span className="text-red-600">*</span></label>
                    <input type="text" className="input w-full" placeholder="e.g. Logo Design" {...register("portfolioTitle", { required: "Portfolio Title is required" })} />
                    {errors.portfolioTitle && <p className="text-red-600">{errors.portfolioTitle.message}</p>}
                    <label htmlFor="portfolioDescription" className="label">Short Description <span className="text-red-600">*</span></label>
                    <textarea className="textarea w-full" placeholder="Write a short description" {...register("portfolioDescription", { required: "Portfolio Description is required" })}></textarea>
                    {errors.portfolioDescription && <p className="text-red-600">{errors.portfolioDescription.message}</p>}
                    <label htmlFor="content" className="label">Content <span className="text-red-600">*</span></label>
                    <Controller
                        name="content"
                        rules={{ required: "Content is required" }}
                        control={control}
                        render={({ field }) => <ReactQuill ref={quillRef} className="border border-gray-600 rounded-md" {...field} modules={modules} formats={formats} />}
                    />
                    {errors.content && <p className="text-red-600">{errors.content.message}</p>}
                    <button className="btn btn-success mt-4" type="submit" disabled={mutation.isPending}>{mutation.isPending && <span className="loading loading-spinner"></span>} Post Portfolio</button>
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
                        <label className="label">Upload Portfolio Image <span className="text-red-600">*</span></label>
                        <input type="file" className="file-input w-full" accept="image/png, image/jpg, image/webp, image/avif, image/jpeg" {...register("image", { required: "Portfolio image is required" })} />
                        {errors.image && <p className="text-red-600">{errors.image.message}</p>}
                        <label className="label">Max size 2MB</label>
                    </div>
                </div>
            </form>
        </>
    )
}

export default AddPortfolio