import React from "react";

const ClientRow = ({ client, btn }) => {
  return (
    <>
      <tr className="hover:bg-base-300">
        <td>
          <h3 className="font-bold">{client.userName}</h3>
          <p className="opacity-60">{client.email}</p>
        </td>
        <td>
          <button
            className="btn btn-error btn-sm md:btn-md rounded-md"
            disabled={client.role === "Admin" ? true : false}
            onClick={btn}
          >
            Remove
          </button>
        </td>
      </tr>
    </>
  );
};

export default ClientRow;
