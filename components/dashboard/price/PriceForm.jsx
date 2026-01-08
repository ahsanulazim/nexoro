import { createPlan } from "@/api/fetchPlans";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";

const PriceForm = ({ slug, onCancel, initialData }) => {

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      planName: initialData?.planName || "",
      price: initialData?.price || "",
      benefits: initialData?.benefits || [{ value: "" }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefits",
  });

  //query client
  const queryClient = useQueryClient();

  //Mutate Service Plans
  const planMutation = useMutation({
    mutationFn: async (data) => {
      if (initialData) {
        return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/plans/${slug}/${initialData.id}`, {
          method: "PUT",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
      } else return createPlan(data, slug);
    },
    onSuccess: () => {
      reset();
      if (onCancel) onCancel();
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success(initialData ? "Plan Updated Successfully" : "Plan Added Successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  })

  const onSubmit = (data) => {
    planMutation.mutate(data);
  };

  return (
    <form
      className="fieldset bg-base-300 p-5 min-w-xs w-full rounded-lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-xl font-bold">Plan Details</h1>
      <label className="label" htmlFor="planName">
        Plan Name
      </label>
      <input
        type="text"
        className="input w-full"
        placeholder="Enter a Plan Name"
        {...register("planName", {
          required: "Plan name is required",
          minLength: { value: 3, message: "Minimum 3 Characters Required" },
        })}
      />
      {errors.planName && (
        <p className="text-red-600">{errors.planName.message}</p>
      )}
      <label className="label" htmlFor="price">
        Set Price
      </label>
      <input
        type="number"
        className="input w-full"
        placeholder="Set Price"
        min="0"
        {...register("price", {
          required: "Price is required",
          min: { value: 0, message: "Price must be a positive number" },
        })}
      />
      {errors.price && <p className="text-red-600">{errors.price.message}</p>}
      <h3 className="text-base font-bold">Plan Benefits</h3>
      {fields.map((field, index) => (
        <React.Fragment key={field.id}>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              placeholder={`Benefit ${index + 1}`}
              className="input w-full"
              {...register(`benefits.${index}.value`, {
                required: "Benefit is required",
              })}
            />
            <button
              className="btn btn-square btn-error"
              type="button"
              onClick={() => remove(index)}
            >
              <FaTrash />
            </button>
          </div>
          {errors.benefits && errors.benefits[index] && (
            <p className="text-red-600">
              {errors.benefits[index]?.value?.message}
            </p>
          )}
        </React.Fragment>
      ))}
      <button
        className="btn btn-primary btn-outline btn-nexoro-primary-outline mt-2"
        type="button"
        onClick={() => append({ value: "" })}
      >
        <FaPlus /> Add Benefit
      </button>
      <div className="mt-4 flex items-center gap-5">
        <button type="button" className="btn btn-error rounded-full grow" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-success rounded-full grow" disabled={planMutation.isPending || !isDirty}>{planMutation.isPending && <span className="loading loading-spinner"></span>} Save</button>
      </div>
    </form>
  );
};

export default PriceForm;
