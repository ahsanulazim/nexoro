import { createCategory } from '@/api/fetchCategory';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { useForm } from 'react-hook-form'
import { LuClipboardPlus, LuLink2 } from 'react-icons/lu'
import { toast } from 'react-toastify';

const CatModal = ({ ref }) => {

    const { register, reset, handleSubmit, formState: { errors } } = useForm();

    //Tanstack Mutation

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category Added successfully");
            reset()
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const onAdd = (data) => {
        mutation.mutate(data);
    }

    return (
        <dialog ref={ref} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-3">Add a Category</h3>
                {/* Category Input */}
                <form className="fieldset" onSubmit={handleSubmit(onAdd)}>
                    <label htmlFor="category" className='label'>Category Name</label>
                    <label htmlFor='category' className="input w-full">
                        <LuClipboardPlus className='opacity-50 size-4' />
                        <input type="text" placeholder="e.g. Digital Marketing" {...register("category", { required: "Field cannot be Empty" })} />
                    </label>
                    {errors.category && <p className='text-red-600'>{errors.category.message}</p>}
                    <label htmlFor="slug" className='label'>Slug</label>
                    <label htmlFor='slug' className="input w-full">
                        <LuLink2 className='opacity-50 size-4' />
                        <input type="text" placeholder="e.g. digital-marketing" {...register("slug", { required: "Slug is Required" })} />
                    </label>
                    {errors.slug && <p className='text-red-600'>{errors.slug.message}</p>}
                    <label htmlFor="description" className='label'>Write Description</label>
                    <textarea className='w-full textarea' placeholder="Write Description for this Category" {...register("description")}></textarea>
                    <div className='flex gap-5 mt-4'>
                        <button type='submit' className="btn btn-success grow">Add</button>
                        <button type='button' onClick={() => { ref.current.close(); reset(); }} className="btn btn-error grow">Close</button>
                    </div>
                </form>
            </div>
        </dialog>
    )
}

export default CatModal