const ServiceModal = () => {
  return (
    <dialog ref={ref} id="clientModal" className="modal">
      <div className="modal-box">
        <form className="fieldset">
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
              className={`btn btn-primary ${
                loading ? "" : "btn-nexoro-primary"
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

export default ServiceModal;
