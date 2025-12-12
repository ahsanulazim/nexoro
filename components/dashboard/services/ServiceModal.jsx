import { updateService } from "@/api/fetchServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ServiceModal = ({ ref, service }) => {

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      serviceTitle: service?.title,
      slug: service?.slug,
      shortDes: service?.shortDes,
      longDes: service?.longDes,
      icon: null,
    }
  });

  const queryClient = useQueryClient();

  //Edit Mutation
  const mutationEdit = useMutation({
    mutationFn: ({ id, formData }) => updateService(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      ref.current.close();
      toast.success("Service updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleService = (data) => {
    mutationEdit.mutate({ id: service._id, formData: data });
    ref.current.close();
    reset();
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <form className="fieldset" onSubmit={handleSubmit(handleService)}>
          <h1 className="text-xl font-semibold">Edit Service</h1>

          <label className="label" htmlFor="serviceTitle">
            Service Title
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="Write Service Title"
            {...register("serviceTitle", {
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Only letters and spaces are allowed",
              },

            })}
          />
          {errors.serviceTitle && <p className="text-red-600">{errors.serviceTitle.message}</p>}
          <label className="label" htmlFor="slug">
            Slug
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="Set a Slug for The Service"
            {...register("slug", {
              pattern: {
                value: /^(?![0-9-]+$)(?:[a-z]{2,}-?|[0-9]-?)+(?<!-)$/,
                message: "Wrong Slug Pattern",
              },
            })}
          />
          <p className="italic">Only letters and hyphens are allowed</p>
          {errors.slug && <p className="text-red-600">{errors.slug.message}</p>}
          <label className="label">Set Icon </label>
          <input
            type="file"
            className="file-input"
            accept=".svg,image/svg+xml"
            {...register("icon", {
              validate: {
                lessThan5MB: (files) => !files || files.length === 0 || files[0].size <= 5 * 1024 * 1024 || "File size must be less than 5MB"
              }
            })}
          />
          <p className="italic">SVG Only. Max size 5MB</p>
          {errors.icon && <p className="text-red-600">{errors.icon.message}</p>}
          <label className="label" htmlFor="shortDes">
            Short Description
          </label>
          <textarea
            placeholder="Write a short Description"
            className="textarea w-full"
            {...register("shortDes", {
              minLength: {
                value: 50,
                message: "Write at least 50 Characters"
              }
            })}
          ></textarea>
          {errors.shortDes && <p className="text-red-600">{errors.shortDes.message}</p>}
          <label className="label" htmlFor="longDes">
            Long Description
          </label>
          <textarea
            rows="4"
            placeholder="Write a Long Description"
            className="textarea w-full"
            {...register("longDes", {
              minLength: {
                value: 250,
                message: "Write at least 250 Characters"
              }
            })}
          ></textarea>
          {errors.longDes && <p className="text-red-600">{errors.longDes.message}</p>}


          <div className="modal-action">
            <button
              type="button"
              className="btn btn-error"
              onClick={() => ref.current.close()}
            >
              Close
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${mutationEdit.isPending || !isDirty ? "" : "btn-nexoro-primary"
                }`}
              disabled={mutationEdit.isPending || !isDirty ? true : false}
            >
              {mutationEdit.isPending && <span className="loading loading-spinner"></span>} Update Service</button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ServiceModal;
