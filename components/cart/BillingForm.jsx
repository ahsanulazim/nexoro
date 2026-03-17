"use client";
import { fetchPaymentRequest } from "@/api/fetchEps";
import auth from "@/firebase/firebase.config.js";
import { useMutation } from "@tanstack/react-query";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { LuArrowRight } from "react-icons/lu";
import { toast } from "react-toastify";

const BillingForm = ({ slug, plan }) => {
  const [user] = useAuthState(auth);

  const mutation = useMutation({
    mutationFn: fetchPaymentRequest,
    onSuccess: (data) => {
      // window.location.href = data.RedirectURL;
      toast.success("Payment initialized successfully.");
    },
    onError: (error) => {
      toast.error("Failed to initialize payment. Please try again.");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      fullname: "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      zip: "",
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({ slug, plan, ...data });
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

      <label htmlFor="email" className="label">
        Email
      </label>
      <input
        name="email"
        type="email"
        className="input w-full"
        placeholder="ex: john.doe@example.com"
        {...register("email", { required: "Please add an Email Address" })}
      />

      {errors.email && <p className="text-red-600">{errors.email.message}</p>}

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
