"use client";

import { updateService } from "@/api/fetchServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

const ServiceModal = ({ ref }) => {
  const [loading, setLoading] = useState(false);
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
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleService = (e) => {
    e.preventDefault();
    setLoading(true);
    const title = e.target.serviceTitle.value;
    const slug = e.target.slug.value;
    const shortDes = e.target.shortDes.value;
    const longDes = e.target.longDes.value;
    const icon = e.target.icon.files[0];

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("shortDes", shortDes);
    formData.append("longDes", longDes);
    formData.append("folder", "icons");

    //icon condition
    if (icon) {
      const maxSize = 5 * 1024 * 1024;
      if (icon.size <= maxSize) {
        formData.append("icon", icon);
      } else {
        toast.error("Icon size must be less than 5MB");
        return; // stop submit if invalid
      }
    }

    mutationEdit.mutate(formData);
    e.target.reset();
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <form className="fieldset" onSubmit={handleService}>
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

          <label className="label" htmlFor="slug">
            Slug
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="Set a Slug for The Service"
            name="slug"
            defaultValue={isEditing ? selectedService.slug : ""}
            required={isEditing ? false : true}
          />
          <label className="label">Set Icon </label>
          <input
            type="file"
            className="file-input"
            name="icon"
            accept=".svg,image/svg+xml"
            required={isEditing ? false : true}
          />
          <label className="label italic">SVG Only. Max size 5MB</label>
          <label className="label" htmlFor="shortDes">
            Short Description
          </label>
          <textarea
            name="shortDes"
            placeholder="Write a short Description"
            className="textarea w-full"
            defaultValue={isEditing ? selectedService.shortDes : ""}
            required={isEditing ? false : true}
          ></textarea>
          <label className="label" htmlFor="longDes">
            Long Description
          </label>
          <textarea
            name="longDes"
            rows="4"
            placeholder="Write a Long Description"
            className="textarea w-full"
            defaultValue={isEditing ? selectedService.longDes : ""}
            required={isEditing ? false : true}
          ></textarea>

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
              className={`btn btn-primary ${loading ? "" : "btn-nexoro-primary"
                }`}
              disabled={loading ? true : false}
            >
              {loading && <span className="loading loading-spinner"></span>} {isEditing ? "Update" : "Add"} Service
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ServiceModal;
