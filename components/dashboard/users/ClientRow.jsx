"use client";

import auth from "@/firebase/firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";

const ClientRow = ({ client, btn }) => {
  const [user] = useAuthState(auth);

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
            disabled={client.email === user.email ? true : false}
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
