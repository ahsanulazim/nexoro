"use client";

import { addClient } from "@/api/fetchClients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

const ClientForm = ({ ref }) => {
  const [loading, setLoading] = useState(false);
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
      toast.error(error.massage);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleClient = (e) => {
    e.preventDefault();
    setLoading(true);
    const client = e.target.clientName.value;
    const company = e.target.company.value;
    const role = e.target.clientRole.value;
    const email = e.target.clientEmail.value;
    const country = e.target.country.value;
    const logo = e.target.logo.files[0];

    const formData = new FormData();
    formData.append("client", client);
    formData.append("role", role);
    formData.append("company", company);
    formData.append("country", country);
    formData.append("email", email);
    formData.append("folder", "clients");

    // logo optional + size check
    if (logo) {
      const maxSize = 5 * 1024 * 1024;
      if (logo.size <= maxSize) {
        formData.append("logo", logo);
      } else {
        toast.error("Logo file size must be less than 5MB");
        return; // stop submit if invalid
      }
    }
    mutation.mutate(formData);
    e.target.reset();
  };

  return (
    <dialog ref={ref} id="clientModal" className="modal">
      <div className="modal-box">
        <form className="fieldset" onSubmit={(e) => handleClient(e)}>
          <h1 className="text-xl font-semibold">Client Details</h1>

          <label className="label" htmlFor="clientName">
            Client Name<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="Write Client's Name"
            name="clientName"
            required
          />
          <label className="label" htmlFor="company">
            Company Name<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="Write Client's Name"
            name="company"
            required
          />

          <label className="label" htmlFor="clientRole">
            Client Role<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="Write client's role in the Brand"
            name="clientRole"
            required
          />
          <label className="label" htmlFor="clientEmail">
            Email<span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            className="input w-full"
            placeholder="Write client's Email Address"
            name="clientEmail"
            required
          />

          <label className="label" htmlFor="country">
            Country<span className="text-red-600">*</span>
          </label>
          <select
            defaultValue="Select Country"
            className="select w-full"
            name="country"
            required
          >
            <option disabled={true}>Select Country</option>
            <option>Bangladesh</option>
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
            <option>Australia</option>
          </select>
          <label className="label" htmlFor="logo">
            Upload Logo
          </label>
          <input
            type="file"
            className="file-input"
            accept="image/*"
            name="logo"
          />
          <p className="italic">Size limit 5MB</p>
          <div className="modal-action">
            <button
              type="submit"
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
              Client
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ClientForm;
