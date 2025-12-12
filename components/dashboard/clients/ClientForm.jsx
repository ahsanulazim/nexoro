import { addClient } from "@/api/fetchClients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ClientForm = ({ ref }) => {


  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      clientName: "",
      company: "",
      clientRole: "",
      clientEmail: "",
      clientPhone: "",
      country: "",
      logo: null
    },
  });

  const countries = ["Bangladesh", "United States", "Canada", "United Kingdom", "Australia", "Brazil", "Finland", "France", "Germany", "Europe"];

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addClient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientData"],
      });
      ref.current.close();
      toast.success("Client added successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      reset();
    }
  });

  const handleClient = (data) => {
    mutation.mutate(data);

  };

  const handleClose = () => {
    ref.current.close();
    reset();
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <form className="fieldset" onSubmit={handleSubmit(handleClient)}>
          <h1 className="text-xl font-semibold">Add Client Details</h1>

          <label className="label" htmlFor="clientName">
            Client Name<span className="text-red-600">*</span>
          </label>
          <input type="text" className="input w-full" placeholder="Write Client's Name" {...register("clientName", { required: "Client Name is required", minLength: { value: 3, message: "Client Name must be at least 3 characters long" } })} />
          {errors.clientName && <p className="text-red-600">{errors.clientName.message}</p>}

          <label className="label" htmlFor="company">
            Company Name<span className="text-red-600">*</span>
          </label>
          <input type="text" className="input w-full" placeholder="Write Client's Name" {...register("company", { required: "Company Name is required", minLength: { value: 3, message: "Company Name must be at least 3 characters long" } })} />
          {errors.company && <p className="text-red-600">{errors.company.message}</p>}

          <label className="label" htmlFor="clientRole">
            Client Role<span className="text-red-600">*</span>
          </label>
          <input type="text" className="input w-full" placeholder="Write client's role in the Brand" {...register("clientRole", { required: "Client Role is required", minLength: { value: 3, message: "Client Role must be at least 3 characters long" } })} />
          {errors.clientRole && <p className="text-red-600">{errors.clientRole.message}</p>}

          <label className="label" htmlFor="clientPhone">Phone</label>
          <input type="text" className="input w-full" placeholder="Write client's Phone Number" {...register("clientPhone", { required: false, pattern: { value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, message: "Invalid phone number format" } })} />
          {errors.clientPhone && <p className="text-red-600">{errors.clientPhone.message}</p>}

          <label className="label" htmlFor="clientEmail">
            Email<span className="text-red-600">*</span>
          </label>
          <input type="email" className="input w-full" placeholder="Write client's Email Address" {...register("clientEmail", { required: "Client's Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" } })} />
          {errors.clientEmail && <p className="text-red-600">{errors.clientEmail.message}</p>}

          <label className="label" htmlFor="country">
            Country<span className="text-red-600">*</span>
          </label>
          <select className="select w-full" {...register("country", { required: "Country is required" })}>
            <option value="" disabled={true}>Select Country</option>
            {countries.map((country) => <option key={country} value={country}>{country}</option>)}
          </select>
          {errors.country && <p className="text-red-600">{errors.country.message}</p>}

          <label className="label" htmlFor="logo">
            Upload Logo <span className="text-red-600">*</span>
          </label>
          <input type="file" className="file-input" accept="image/*" {...register("logo", {
            required: "Logo is required", validate: {
              lessThan5MB: (files) => files[0].size <= 5 * 1024 * 1024 || "File size must be less than 5MB"
            }
          })}
          />
          <p className="italic">Size limit 5MB</p>
          {errors.logo && <p className="text-red-600">{errors.logo.message}</p>}
          <div className="modal-action">
            <button type="button" className="btn btn-error" onClick={handleClose}>
              Close
            </button>
            <button type="submit" className={`btn btn-primary ${mutation.isPending ? "" : "btn-nexoro-primary"}`} disabled={mutation.isPending ? true : false}>
              {mutation.isPending && <span className="loading loading-spinner"></span>} Add Client </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ClientForm;
