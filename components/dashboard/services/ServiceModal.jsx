"use client";

import { useState } from "react";

const ServiceModal = ({ ref }) => {
  const [loading, setLoading] = useState();

  return (
    <dialog ref={ref} id="serviceModal" className="modal">
      <div className="modal-box">
        <form className="fieldset">
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
                name="BDT"
                required
              />
            </label>
            <label className="input">
              <span className="label">USD</span>
              <input
                type="number"
                className="w-full"
                placeholder="Set USD Price"
                name="USD"
                required
              />
            </label>
          </div>
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
              className={`btn btn-primary ${
                loading ? "" : "btn-nexoro-primary"
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
