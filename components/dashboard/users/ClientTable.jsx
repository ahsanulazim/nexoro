"use client";
import { useRef, useState } from "react";
import ClientRow from "./ClientRow";
import Modal from "@/components/modal/Modal";
import { LuIdCard, LuStore } from "react-icons/lu";

const ClientTable = ({ users, customer }) => {
  const [remove, setRemove] = useState(null);
  const deleteUser = useRef();

  const handleUserRemove = (email) => {
    deleteUser.current.showModal();
    setRemove(email);
  };

  return (
    <>
      <Modal ref={deleteUser} remove={remove} />
      <div className="overflow-x-auto bg-base-200 shadow-md rounded-lg">
        <h1 className="p-4 text-xl sm:text-2xl font-semibold flex items-center gap-3 border-b border-b-base-content/5">

          {customer ? <> <LuStore className="size-6 sm:size-8 text-purple-500" /> Customers List </> : <><LuIdCard className="size-6 sm:size-8 text-purple-500" /> Team Members List</>}
        </h1>
        <table className="table table-auto rounded-t-none">
          <tbody>
            {users && users.length === 0 && (
              <tr>
                <td className="text-center p-6" colSpan="3">{customer ? "No users found." : "No team members found."}</td>
              </tr>
            )}
            {users?.map((user, i) => (
              <ClientRow key={i} client={user} customer={customer} btn={() => handleUserRemove(user.email)} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ClientTable;
