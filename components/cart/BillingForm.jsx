"use client";
import { fetchCountries } from "@/api/fetchCart";
import { fetchPaymentRequest } from "@/api/fetchEps";
import auth from "@/firebase/firebase.config.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthState } from "react-firebase-hooks/auth";
import { Controller, useForm } from "react-hook-form";
import { LuArrowRight } from "react-icons/lu";
import { toast } from "react-toastify";
import Select from "react-select";

const BillingForm = ({ slug, plan }) => {
  const [user] = useAuthState(auth);

  const mutation = useMutation({
    mutationFn: fetchPaymentRequest,
    onSuccess: (data) => {
      window.location.href = data.RedirectURL;
      console.log(data);
      toast.success("Payment initialized successfully.");
    },
    onError: (error) => {
      toast.error("Failed to initialize payment. Please try again.");
    },
  });

  const {
    data: countries,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      fullname: "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      zip: "",
      country: "",
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({ slug, plan, ...data });
    localStorage.setItem("orderData", JSON.stringify({ slug, plan }));
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

      <div className="flex max-xs:flex-col xs:gap-5">
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
          <label htmlFor="state" className="label">
            State
          </label>
          <input
            name="state"
            type="text"
            className="input w-full"
            placeholder="ex: Dhaka"
            {...register("state", { required: "State is required" })}
          />
          {errors.state && (
            <p className="text-red-600">{errors.state.message}</p>
          )}
        </div>
      </div>
      <div className="flex max-xs:flex-col xs:gap-5">
        <div className="fieldset flex-1">
          <label htmlFor="zip" className="label">
            Zip code
          </label>
          <input
            name="zip"
            type="text"
            className={`input ${errors.zip ? "input-error" : ""} w-full`}
            placeholder="ex: 0000"
            {...register("zip", { required: "Zip Code is required" })}
          />
          {errors.zip && <p className="text-red-600">{errors.zip.message}</p>}
        </div>
        <div className="fieldset flex-1">
          <label htmlFor="country" className="label">
            Country
          </label>
          <Controller
            name="country"
            control={control}
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={countries || []}
                isLoading={isLoading}
                isSearchable
                isClearable={true}
                captureMenuScroll={true}
                placeholder="Select a Country"
                classNames={{
                  control: (state) =>
                    `!bg-base-100 !border !border-white/25 !rounded-md !p-0.5 ${
                      errors.country ? "!border-error" : "!border-base-300"
                    }`,
                  menu: () =>
                    "!bg-base-100 !rounded-lg !border !border-base-300",
                  option: ({ isFocused, isSelected }) =>
                    `!cursor-pointer ${
                      isSelected
                        ? "!bg-primary !text-primary-content"
                        : isFocused
                          ? "!bg-base-200"
                          : ""
                    }`,
                  singleValue: () => "!text-base-content",
                  input: () => "!text-base-content",
                }}
                styles={{
                  control: (base) => ({ ...base, boxShadow: "none" }), // Remove default blue outline
                }}
              />
            )}
          />
          {errors.country && (
            <p className="text-red-600">{errors.country.message}</p>
          )}
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
