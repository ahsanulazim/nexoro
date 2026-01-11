'use client'

import Link from "next/link"
import CatModal from "./CatModal"
import { Controller, useForm } from "react-hook-form"
import { LuArrowLeft, LuCirclePlus } from "react-icons/lu"
import ReactQuill from "react-quill-new"
import { useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchCategories } from "@/api/fetchCategory"
import { toast } from "react-toastify"
import { updateBlog } from "@/api/fetchBlogs"

const EditBlog = ({ blog }) => {

    //Category Fetch
    const { data: categories, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
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
            blogTitle: blog.title,
            slug: blog.slug,
            blogDescription: blog.description,
            content: blog.content,
            category: blog.categoryId,
            visibility: `${blog.visibility}`,
            image: null,
            author: blog.author,
        }
    })

    const catRef = useRef();

    const onSubmit = (data) => {
        mutation.mutate({ id: blog._id, blogData: data })

    }

    return (
        <>
            <div className="mb-5 w-fit">
                <Link href="/dashboard/blogs"><button className="text-lg flex items-center gap-4 cursor-pointer font-bold"><LuArrowLeft />Back to Blogs</button></Link>
            </div>
            <CatModal ref={catRef} />
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
                    <button className="btn btn-success mt-4" type="submit" disabled={mutation.isPending || !isDirty}>{mutation.isPending && <span className="loading loading-spinner"></span>} Update Blog</button>
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
                            {isLoading ? <option>Loading...</option> : categories.map((category) => <option key={category._id} value={category._id}>{category.category}</option>)}
                        </select>
                        <button type="button" onClick={() => catRef.current.show()} className="btn btn-primary btn-nexoro-primary"><LuCirclePlus className="size-4" /> Add New Category</button>
                        {errors.category && <p className="text-red-600">{errors.category.message}</p>}
                    </div>
                    <div className="fieldset bg-base-200 border-base-300 rounded-box border p-5">
                        <label htmlFor="visibility" className="label">Visibility <span className="text-red-600">*</span></label>
                        <div className="flex gap-3 items-center"><input type="radio" value={true} id="visible" className="radio radio-xs radio-success" {...register("visibility", { required: "Visibility is required" })} /><label htmlFor="visible">Visible</label></div>
                        <div className="flex gap-3 items-center"><input type="radio" value={false} id="hidden" className="radio radio-xs radio-success" {...register("visibility", { required: "Visibility is required" })} /><label htmlFor="hidden">Hidden</label></div>
                        {errors.visibility && <p className="text-red-600">{errors.visibility.message}</p>}
                    </div>
                    <div className="fieldset bg-base-200 border-base-300 rounded-box border p-5">
                        <label className="label">Blog Thumbnail <span className="text-red-600">*</span></label>
                        <img className="w-full rounded-md" src={blog.image} alt={blog.title} />
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

export default EditBlog