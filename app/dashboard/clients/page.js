"use client";

import { fetchClients } from "@/api/fetchClients";
import ClientForm from "@/components/dashboard/clients/ClientForm";
import ClientsTable from "@/components/dashboard/clients/ClientsTable";
import DashBread from "@/components/dashboard/DashBread";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { LuPlus } from "react-icons/lu";

const Clients = () => {
  const addClientForm = useRef();
  const router = useRouter();

  const { data: clientData, isLoading, isError } = useQuery({
    queryKey: ["clientData"],
    queryFn: fetchClients,
  });

  if (isError) {
    router.push("/dashboard");
    return null;
  }

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
