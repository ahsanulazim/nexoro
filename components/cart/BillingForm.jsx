"use client";
import { useForm } from "react-hook-form";
import { LuArrowRight } from "react-icons/lu";

const BillingForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form className="fieldset" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="fullname" className="label">
        Full Name
      </label>
      <input
        name="fullname"
        type="text"
        className="input w-full"
        placeholder="ex: John Doe"
        {...register("fullname", { required: "Enter Your Full Name" })}
      />

      {errors.fullname && (
        <p className="text-red-600">{errors.fullname.message}</p>
      )}

      <label htmlFor="phone" className="label">
        Phone
      </label>
      <input
        name="phone"
        type="tel"
        className="input w-full"
        placeholder="00000000"
        {...register("phone", { required: "Please add a Phone Number" })}
      />

      {errors.phone && <p className="text-red-600">{errors.phone.message}</p>}

      <label htmlFor="address" className="label">
        Address
      </label>
      <input
        name="address"
        type="text"
        className="input w-full"
        placeholder="ex: Holding/Road/House/Block"
        {...register("address", { required: "Write your address here" })}
      />
      {errors.address && (
        <p className="text-red-600">{errors.address.message}</p>
      )}

      <div className="flex gap-5 items-center">
        <div className="fieldset flex-1">
          <label htmlFor="city" className="label">
            City
          </label>
          <input
            name="city"
            type="text"
            className="input w-full"
            placeholder="ex: Dhaka"
            {...register("city", { required: "City is required" })}
          />
          {errors.city && <p className="text-red-600">{errors.city.message}</p>}
        </div>
        <div className="fieldset flex-1">
          <label htmlFor="zip" className="label">
            Zip code
          </label>
          <input
            name="zip"
            type="text"
            className="input w-full"
            placeholder="ex: 0000"
            {...register("zip", { required: "Zip Code is required" })}
          />
          {errors.zip && <p className="text-red-600">{errors.zip.message}</p>}
        </div>
      </div>

      <button
        disabled={!isDirty}
        className={`btn btn-primary ${isDirty ? "btn-nexoro-primary" : ""} mt-4`}
      >
        Checkout <LuArrowRight />
      </button>
    </form>
  );
};

export default BillingForm;
