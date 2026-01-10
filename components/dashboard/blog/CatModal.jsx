import React from 'react'
import { useForm } from 'react-hook-form'
import { LuAlignJustify, LuClipboardPlus, LuLink2 } from 'react-icons/lu'

const CatModal = ({ ref }) => {

    const { register, reset, handleSubmit, formState: { errors } } = useForm();

    const onAdd = (data) => {
        console.log(data);

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
                    <label htmlFor="catDes" className='label'>Write Description</label>
                    <textarea className='w-full textarea' placeholder="Write Description for this Category" {...register("catDes")}></textarea>
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