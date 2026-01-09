'use client'

import { Controller, useForm } from "react-hook-form";
import { LuArrowLeft } from "react-icons/lu"
import 'react-quill-new/dist/quill.snow.css';
import ReactQuill from "react-quill-new";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "@/firebase/firebase.config.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postBlog } from "@/api/fetchBlogs";
import { toast } from "react-toastify";

const AddBlog = () => {

    //get user
    const [user] = useAuthState(auth);

    const { register, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            blogTitle: "",
            slug: "",
            blogDescription: "",
            content: "",
            category: "",
            visibility: "",
            image: null,
            author: user?.displayName || "",
        },
    });

    //Tanstack Mutation

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: postBlog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            toast.success("Blog Posted successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    }


    return (
        <>
            <div className="mb-5">
                <button className="text-lg flex items-center gap-4 cursor-pointer font-bold"><LuArrowLeft />Add A Blog Post</button>
            </div>
            <form className="grid lg:grid-cols-4 gap-5 items-start" onSubmit={handleSubmit(onSubmit)}>
                <div className="fieldset lg:col-span-3 bg-base-200 border-base-300 rounded-box border p-5 max-lg:order-2">
                    <label htmlFor="blogTitle" className="label">Title <span className="text-red-600">*</span></label>
                    <input type="text" className="input w-full" placeholder="e.g. This Blog is about the services." {...register("blogTitle", { required: "Blog Title is required" })} />
                    {errors.blogTitle && <p className="text-red-600">{errors.blogTitle.message}</p>}
                    <label htmlFor="slug" className="label">Slug <span className="text-red-600">*</span></label>
                    <input type="text" className="input w-full" placeholder="e.g. this-blog-is-about-the-services." {...register("slug", { required: "Slug is required" })} />
                    {errors.slug && <p className="text-red-600">{errors.slug.message}</p>}
                    <label htmlFor="blogDescription" className="label">Short Description <span className="text-red-600">*</span></label>
                    <textarea className="textarea w-full" placeholder="Write a short description" {...register("blogDescription", { required: "Blog Description is required" })}></textarea>
                    {errors.blogDescription && <p className="text-red-600">{errors.blogDescription.message}</p>}
                    <label htmlFor="content" className="label">Content <span className="text-red-600">*</span></label>
                    <Controller
                        name="content"
                        rules={{ required: "Content is required" }}
                        control={control}
                        render={({ field }) => <ReactQuill theme="snow" className="border border-gray-600 rounded-md" {...field} />}
                    />
                    {errors.content && <p className="text-red-600">{errors.content.message}</p>}
                    <button className="btn btn-success mt-4" type="submit" disabled={mutation.isPending}>{mutation.isPending && <span className="loading loading-spinner"></span>} Post Blog</button>
                </div>
                <div className="flex flex-col gap-5 max-lg:order-1 sticky top-20">
                    <div className="fieldset bg-base-200 border-base-300 rounded-box border p-5">
                        <label className="label">Author</label>
                        <input type="text" className="input w-full" placeholder="Author Name" disabled {...register("author")} />
                    </div>

                    <div className="fieldset bg-base-200 border-base-300 rounded-box border p-5">
                        <label className="label" htmlFor="category">Select a Category<span className="text-red-600">*</span>
                        </label>
                        <select className="select w-full" defaultValue="" {...register("category", { required: "Category is required" })}>
                            <option value="" disabled={true}>Select Category</option>
                            <option value="Technology">Technology</option>
                            <option value="Business">Business</option>
                            <option value="Design">Design</option>
                        </select>
                        {errors.category && <p className="text-red-600">{errors.category.message}</p>}
                    </div>
                    <div className="fieldset bg-base-200 border-base-300 rounded-box border p-5">
                        <label htmlFor="visibility" className="label">Visibility <span className="text-red-600">*</span></label>
                        <div className="flex gap-3 items-center"><input type="radio" value={true} id="visible" className="radio radio-xs radio-success" {...register("visibility", { required: "Visibility is required" })} /><label htmlFor="visible">Visible</label></div>
                        <div className="flex gap-3 items-center"><input type="radio" value={false} id="hidden" className="radio radio-xs radio-success" {...register("visibility", { required: "Visibility is required" })} /><label htmlFor="hidden">Hidden</label></div>
                        {errors.visibility && <p className="text-red-600">{errors.visibility.message}</p>}
                    </div>
                    <div className="fieldset bg-base-200 border-base-300 rounded-box border p-5">
                        <label className="label">Upload Blog Thumbnail <span className="text-red-600">*</span></label>
                        <input type="file" className="file-input w-full" accept="image/png, image/jpg, image/webp, image/avif, image/jpeg" {...register("image", { required: "Blog image is required" })} />
                        {errors.image && <p className="text-red-600">{errors.image.message}</p>}
                        <label className="label">Max size 2MB</label>
                    </div>
                </div>
            </form>
        </>
    )
}

export default AddBlog