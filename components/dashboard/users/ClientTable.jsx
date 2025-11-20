"use client";
import { useContext, useEffect, useRef, useState } from "react";
import ClientRow from "./ClientRow";
import Modal from "@/components/modal/Modal";
import { LuStore } from "react-icons/lu";
import { MyContext } from "@/context/MyProvider";

const ClientTable = () => {
  const { serverUrl } = useContext(MyContext);
  const [clients, setClients] = useState(null);

  useEffect(() => {
    fetch(`${serverUrl}/users`)
      .then((res) => res.json())
      .then((data) => setClients(data));
  }, [clients, serverUrl]);

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
          <LuStore className="size-6 sm:size-8 text-purple-500" />
          Users List
        </h1>
        <table className="table rounded-t-none">
          <tbody>
            {clients?.map((client, i) => (
              <ClientRow
                key={i}
                client={client}
                btn={() => handleUserRemove(client.email)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ClientTable;
