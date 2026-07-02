"use client";
import DashBread from "@/components/dashboard/DashBread";
import OrderAddModal from "@/components/dashboard/order/OrderAddModal";
import OrderTable from "@/components/dashboard/order/OrderTable";
import { useRef } from "react";
import { LuPlus } from "react-icons/lu";

const page = () => {
  const orderAddRef = useRef();

  return (
    <main>
      <OrderAddModal isEditing={false} ref={orderAddRef} />
      <section className="">
        <DashBread title="Orders" />
        <div className="flex items-center justify-between gap-5">
          <h1 className="text-4xl font-semibold">Orders</h1>
          <button
            className="btn btn-primary btn-nexoro-primary"
            onClick={() => orderAddRef.current.showModal()}
          >
            <LuPlus /> Add Order
          </button>
        </div>
      </section>
      <section className="mt-5">
        <OrderTable />
      </section>
    </main>
  );
};

export default page;
