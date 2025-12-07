"use client";

import { addClient, updateClient } from "@/api/fetchClients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

const ClientForm = ({ ref, isEditing, client }) => {

  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");

  const countries = ["Bangladesh", "United States", "Canada", "United Kingdom", "Australia", "Brazil", "Finland", "France", "Germany", "Europe"];

  const queryClient = useQueryClient();

  const mutationUpdate = useMutation({
    mutationFn: ({ id, formData }) => updateClient(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientData"] });
      ref.current.close();
      toast.success("Client updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

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
      setLoading(false);
    },
  });

  const handleClient = (e) => {
    e.preventDefault();
    setLoading(true);
    const clientName = e.target.clientName.value;
    const company = e.target.company.value;
    const role = e.target.clientRole.value;
    const email = e.target.clientEmail.value;
    const country = e.target.country.value;
    const logo = e.target.logo.files[0];

    const formData = new FormData();
    formData.append("client", clientName);
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

    if (isEditing) {
      mutationUpdate.mutate({ id: client._id, formData });
      e.target.reset();
      return;
    }
    mutation.mutate(formData);
    e.target.reset();
  };

  return (
    <dialog ref={ref} id="clientModal" className="modal">
      <div className="modal-box">
        <form className="fieldset" onSubmit={(e) => handleClient(e)}>
          <h1 className="text-xl font-semibold">{isEditing ? "Edit Client Details" : "Add Client Details"}</h1>

          <label className="label" htmlFor="clientName">
            Client Name<span className={isEditing ? "hidden" : "text-red-600"}>*</span>
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="Write Client's Name"
            name="clientName"
            defaultValue={isEditing ? client.client : ""}
            required={isEditing ? false : true}
          />
          <label className="label" htmlFor="company">
            Company Name<span className={isEditing ? "hidden" : "text-red-600"}>*</span>
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="Write Client's Name"
            name="company"
            defaultValue={isEditing ? client.company : ""}
            required={isEditing ? false : true}
          />

          <label className="label" htmlFor="clientRole">
            Client Role<span className={isEditing ? "hidden" : "text-red-600"}>*</span>
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="Write client's role in the Brand"
            name="clientRole"
            defaultValue={isEditing ? client.role : ""}
            required={isEditing ? false : true}
          />
          <label className="label" htmlFor="clientEmail">
            Email<span className={isEditing ? "hidden" : "text-red-600"}>*</span>
          </label>
          <input
            type="email"
            className="input w-full"
            placeholder="Write client's Email Address"
            name="clientEmail"
            defaultValue={isEditing ? client.email : ""}
            required={isEditing ? false : true}
          />

          <label className="label" htmlFor="country">
            Country<span className={isEditing ? "hidden" : "text-red-600"}>*</span>
          </label>
          <select
            className="select w-full"
            name="country"
            value={isEditing ? client.country : "" || selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            required={!isEditing}
          >
            <option value="" disabled={true}>Select Country</option>
            {countries.map((country) => <option key={country} value={country}>{country}</option>)}
          </select>
          <label className="label" htmlFor="logo">
            Upload Logo <span className={isEditing ? "hidden" : "text-red-600"}>*</span>
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
              {loading && <span className="loading loading-spinner"></span>} {isEditing ? "Update" : "Add Client"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ClientForm;
