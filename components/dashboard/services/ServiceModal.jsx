"use client";

import { useState } from "react";
import { toast } from "react-toastify";

const ServiceModal = ({ ref, onServiceAdded }) => {
  const [loading, setLoading] = useState(false);

  const handleService = (e) => {
    e.preventDefault();
    setLoading(true);
    const title = e.target.serviceTitle.value;
    const slug = e.target.slug.value;
    const bdtPrice = e.target.bdt.value;
    const usdPrice = e.target.usd.value;
    const shortDes = e.target.shortDes.value;
    const longDes = e.target.longDes.value;
    const icon = e.target.icon.files[0];

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("bdtPrice", bdtPrice);
    formData.append("usdPrice", usdPrice);
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
    //send data to server
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/services`, {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        return data;
      })
      .then((data) => {
        setLoading(false);
        ref.current.close();
        onServiceAdded(data);
        e.target.reset();
        toast.success("Service added successfully");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.message);
        toast.error(error.message);
      });
  }

  return (
    <dialog ref={ref} id="serviceModal" className="modal">
      <div className="modal-box">
        <form className="fieldset" onSubmit={handleService}>
          <h1 className="text-xl font-semibold">Service Details</h1>

          <label className="label" htmlFor="serviceTitle">
            Service Title<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="Write Service Title"
            name="serviceTitle"
            required
          />
          <label className="label" htmlFor="slug">
            Slug<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="Set a Slug for The Service"
            name="slug"
            required
          />
          <label className="label">
            Price<span className="text-red-600">*</span>
          </label>
          <div className="flex items-center gap-5">
            <label className="input">
              <span className="label">BDT</span>
              <input
                type="number"
                className="w-full"
                placeholder="Set BDT Price"
                name="bdt"
                required
              />
            </label>
            <label className="input">
              <span className="label">USD</span>
              <input
                type="number"
                className="w-full"
                placeholder="Set USD Price"
                name="usd"
                required
              />
            </label>
          </div>
          <label className="label">Set Icon</label>
          <input type="file" className="file-input" name="icon" />
          <label className="label italic">Max size 5MB</label>
          <label className="label" htmlFor="shortDes">
            Short Description<span className="text-red-600">*</span>
          </label>
          <textarea
            name="shortDes"
            placeholder="Write a short Description"
            className="textarea w-full"
          ></textarea>
          <label className="label" htmlFor="longDes">
            Long Description<span className="text-red-600">*</span>
          </label>
          <textarea
            name="longDes"
            rows="4"
            placeholder="Write a Long Description"
            className="textarea w-full"
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
              {loading && <span className="loading loading-spinner"></span>} Add
              Service
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ServiceModal;
