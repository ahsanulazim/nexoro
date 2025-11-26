const ClientForm = ({ ref }) => {
  const handleClient = (e) => {
    e.preventDefault();
    const client = e.target.clientName.value;
    const role = e.target.clientRole.value;
    const country = e.target.country.value;
    alert(client + role + country);
  };

  return (
    <dialog ref={ref} id="clientModal" className="modal">
      <div className="modal-box">
        <form className="fieldset" onSubmit={(e) => handleClient(e)}>
          <h1 className="text-xl font-semibold">Client Details</h1>

          <label className="label" htmlFor="clientName">
            Client Name
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="Write Client's Name"
            name="clientName"
            required
          />

          <label className="label" htmlFor="clientRole">
            Client Role
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="Write client's role in the Brand"
            name="clientRole"
            required
          />

          <label className="label" htmlFor="country">
            Country
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
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button type="submit" className="btn btn-error">
                Close
              </button>
            </form>
            <button
              type="submit"
              className="btn btn-primary btn-nexoro-primary"
            >
              Add Client
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ClientForm;
