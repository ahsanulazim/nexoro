import { LuEllipsisVertical } from "react-icons/lu";

const ClientsTable = ({ clientData }) => {
  return (
    <div className="max-sm:overflow-x-scroll bg-base-300 shadow-md rounded-lg grow">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Name</th>
            <th>Company</th>
            <th>Added</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {clientData?.map((client) => (
            <tr key={client.email}>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img src={client.logo} alt={client.client} />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{client.client}</div>
                    <div className="text-sm opacity-50">{client.role}</div>
                  </div>
                </div>
              </td>
              <td>
                {client.company}
                <br />
                <p className="text-sm opacity-50">{client.email}</p>
              </td>
              <td>
                {new Date(client.joined).toLocaleString("en-BD", {
                  timeZone: "Asia/Dhaka",
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </td>
              <th>
                <div className="dropdown dropdown-end">
                  <button
                    tabIndex={0}
                    role="button"
                    className="btn btn-soft btn-square"
                  >
                    <LuEllipsisVertical />
                  </button>
                  <ul
                    tabIndex="-1"
                    className="dropdown-content menu bg-base-100 rounded-box z-1 hn w-52 p-2 shadow-sm"
                  >
                    <li>
                      <a>Edit</a>
                    </li>
                    <li>
                      <a>Delete</a>
                    </li>
                  </ul>
                </div>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsTable;
