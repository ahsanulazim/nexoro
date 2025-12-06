"use client";

import { addService, updateService } from "@/api/fetchServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

const ServiceModal = ({ ref, isEditing, selectedService }) => {
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

  //Add Mutation
  const mutation = useMutation({
    mutationFn: addService,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["services"],
      });
      ref.current.close();
      toast.success("Service added successfully");
    },
    onError: (error) => {
      toast.error(error.massage);
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

    if (!icon) {
      setLoading(false);
      return;
    } else {
      const maxSize = 5 * 1024 * 1024;
      if (icon.size <= maxSize) {
        formData.append("icon", icon);
      } else {
        toast.error("Icon size must be less than 5MB");
        setLoading(false);
        return;
      }
    }

    if (isEditing) {
      mutationEdit.mutate({ id: selectedService._id, formData });
      return;
    }
    mutation.mutate(formData);
    e.target.reset();
  };

  return (
    <dialog ref={ref} id="serviceModal" className="modal">
      <div className="modal-box">
        <form className="fieldset" onSubmit={handleService}>
          <h1 className="text-xl font-semibold">{isEditing ? "Edit" : "Add"} Service</h1>

          <label className="label" htmlFor="serviceTitle">
            Service Title<span className={isEditing ? "hidden" : "text-red-600"}>*</span>
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="Write Service Title"
            name="serviceTitle"
            defaultValue={isEditing ? selectedService.title : ""}
            required={isEditing ? false : true}
          />
          <label className="label" htmlFor="slug">
            Slug<span className={isEditing ? "hidden" : "text-red-600"}>*</span>
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="Set a Slug for The Service"
            name="slug"
            defaultValue={isEditing ? selectedService.slug : ""}
            required={isEditing ? false : true}
          />
          <label className="label">Set Icon<span className={isEditing ? "hidden" : "text-red-600"}>*</span></label>
          <input
            type="file"
            className="file-input"
            name="icon"
            accept=".svg,image/svg+xml"
            required={isEditing ? false : true}
          />
          <label className="label italic">SVG Only. Max size 5MB</label>
          <label className="label" htmlFor="shortDes">
            Short Description<span className={isEditing ? "hidden" : "text-red-600"}>*</span>
          </label>
          <textarea
            name="shortDes"
            placeholder="Write a short Description"
            className="textarea w-full"
            defaultValue={isEditing ? selectedService.shortDes : ""}
            required={isEditing ? false : true}
          ></textarea>
          <label className="label" htmlFor="longDes">
            Long Description<span className={isEditing ? "hidden" : "text-red-600"}>*</span>
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
