"use client";

import { getAllExpenses } from "@/api/fetchExpense";
import DashBread from "@/components/dashboard/DashBread";
import ExpenseAddForm from "@/components/dashboard/expenses/ExpenseAddForm";
import ExpensesTable from "@/components/dashboard/expenses/ExpensesTable";
import Pagination from "@/components/ui/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useCallback } from "react";
import { LuPlus } from "react-icons/lu";

const expenses = () => {
  const expenseAddRef = useRef();

  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["expenses", page, search, limit],
    queryFn: getAllExpenses,
  });

  const goToPage = useCallback(
    (newPage) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", newPage.toString());

      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

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
        <ExpensesTable
          data={data?.expenses}
          isLoading={isLoading}
          isError={isError}
        />
      </section>
      <section>
        <Pagination
          isLoading={isLoading}
          isError={isError}
          goToPage={goToPage}
          data={data?.expenses}
          page={page}
          totalPages={data?.totalPages}
        />
      </section>
    </main>
  );
};

export default expenses;
