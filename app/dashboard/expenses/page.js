"use client";

import DashBread from "@/components/dashboard/DashBread";
import ExpenseAddForm from "@/components/dashboard/expenses/ExpenseAddForm";
import ExpensesTable from "@/components/dashboard/expenses/ExpensesTable";
import { useRef } from "react";
import { LuPlus } from "react-icons/lu";

const expenses = () => {
  const expenseAddRef = useRef();

  return (
    <main>
      <section className="">
        <ExpenseAddForm ref={expenseAddRef} />
        <DashBread title="Expenses" />
        <div className="flex items-center justify-between gap-5">
          <h1 className="text-4xl font-semibold">Expenses</h1>
          <button
            className="btn btn-primary btn-nexoro-primary"
            onClick={() => expenseAddRef.current.showModal()}
          >
            <LuPlus /> Add Expense
          </button>
        </div>
      </section>
      <section className="mt-5">
        <ExpensesTable />
      </section>
    </main>
  );
};

export default expenses;
