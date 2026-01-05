import { createPlan } from "@/api/fetchPlans";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa6";

const PriceForm = ({ title, slug }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefits",
  });

  const onSubmit = (data) => {
    createPlan(data, slug);
  };

  return (
    <form
      className="fieldset bg-base-300 p-5 min-w-xs w-full rounded-lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-xl font-bold">{title} Plan</h1>
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
              className="btn btn-square btn-sm btn-error"
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
      <button
        type="submit"
        className="btn btn-primary btn-nexoro-primary rounded-full mt-4"
      >
        Save
      </button>
    </form>
  );
};

export default PriceForm;
