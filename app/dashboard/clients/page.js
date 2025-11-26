"use client";

import ClientForm from "@/components/dashboard/clients/ClientForm";
import ClientsTable from "@/components/dashboard/clients/ClientsTable";
import DashBread from "@/components/dashboard/DashBread";
import { useRef } from "react";
import { LuPlus } from "react-icons/lu";

const Clients = () => {
  const addClientForm = useRef();

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
        <ClientsTable />
      </main>
    </>
  );
};

export default Clients;
