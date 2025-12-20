"use client";

import { fetchClients } from "@/api/fetchClients";
import ClientForm from "@/components/dashboard/clients/ClientForm";
import ClientCard from "@/components/dashboard/clients/ClientCard";
import DashBread from "@/components/dashboard/DashBread";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { LuPlus } from "react-icons/lu";
import ClientSkeleton from "@/components/dashboard/skeleton/ClientSkeleton";

const Clients = () => {

  const addClientForm = useRef();

  const { data: clientData, isLoading } = useQuery({
    queryKey: ["clientData"],
    queryFn: fetchClients,
  });

  return (
    <>
      <ClientForm ref={addClientForm} />
      <main className="flex flex-col gap-4">
        <section className="">
          <DashBread title="Clients" />
          <div className="flex items-center justify-between gap-5">
            <h1 className="text-4xl font-semibold">Clients</h1>
            <button className="btn btn-primary btn-nexoro-primary" onClick={() => addClientForm.current.showModal()}>
              <LuPlus /> Add Client
            </button>
          </div>
        </section>
        <section>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {isLoading && Array.from({ length: 8 }).map((_, i) => <ClientSkeleton key={i} />)}
            {clientData?.map((client) => <ClientCard key={client._id} client={client} />)}
          </div>
        </section>
      </main>
    </>
  );
};

export default Clients;
