import { createSubService } from "@/api/fetchCategory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { LuClipboardPlus, LuLink2 } from "react-icons/lu";
import { toast } from "react-toastify";

const CatModal = ({ ref }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm();

  //Tanstack Mutation

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createSubService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subServices"] });
      toast.success("Sub Service Added successfully");
      reset();
      ref.current.close();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onAdd = (data) => {
    mutation.mutate(data);
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-3">Add a Sub Service</h3>
        {/* Category Input */}
        <form className="fieldset" onSubmit={handleSubmit(onAdd)}>
          <label htmlFor="subService" className="label">
            Sub Service Name<span className="text-red-600">*</span>
          </label>
          <label htmlFor="subService" className="input w-full">
            <LuClipboardPlus className="opacity-50 size-4" />
            <input
              type="text"
              placeholder="e.g. Google Ads"
              {...register("subService", { required: "Field cannot be Empty" })}
            />
          </label>
          {errors.subService && (
            <p className="text-red-600">{errors.subService.message}</p>
          )}
          <label htmlFor="slug" className="label">
            Slug<span className="text-red-600">*</span>
          </label>
          <label htmlFor="slug" className="input w-full">
            <LuLink2 className="opacity-50 size-4" />
            <input
              type="text"
              placeholder="e.g. google-ads"
              {...register("slug", { required: "Slug is Required" })}
            />
          </label>
          {errors.slug && <p className="text-red-600">{errors.slug.message}</p>}
          <label htmlFor="description" className="label">
            Write Description
          </label>
          <textarea
            className="w-full textarea"
            placeholder="Write Description for this Category"
            {...register("description")}
          ></textarea>
          <div className="flex gap-5 mt-4">
            <button
              type="submit"
              className="btn btn-success grow"
              disabled={mutation.isPending || !isDirty}
            >
              {mutation.isPending && (
                <span className="loading loading-spinner"></span>
              )}{" "}
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                ref.current.close();
                reset();
              }}
              className="btn btn-error grow"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default CatModal;
