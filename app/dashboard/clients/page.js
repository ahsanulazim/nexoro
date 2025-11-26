"use client";

import ClientForm from "@/components/dashboard/clients/ClientForm";
import ClientsTable from "@/components/dashboard/clients/ClientsTable";
import DashBread from "@/components/dashboard/DashBread";
import { useEffect, useRef, useState } from "react";
import { LuPlus } from "react-icons/lu";

const Clients = () => {
  const addClientForm = useRef();
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/clients`);
        const data = await res.json();
        setClientData(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  console.log(clientData);

  return (
    <>
      <ClientForm ref={addClientForm} />
      <main className="flex flex-col gap-4">
        <section className="">
          <DashBread title="Clients" />
          <div className="flex items-center justify-between gap-5">
            <h1 className="text-4xl font-semibold">Clients</h1>
            <button
              className="btn btn-primary btn-nexoro-primary"
              onClick={() => document.getElementById("clientModal").showModal()}
            >
              <LuPlus />
              Add Client
            </button>
          </div>
        </section>
        <ClientsTable clientData={clientData} />
      </main>
    </>
  );
};

export default Clients;
