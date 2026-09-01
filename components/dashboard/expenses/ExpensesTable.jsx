import { getAllExpenses } from "@/api/fetchExpense";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { LuSquarePen, LuTrash2 } from "react-icons/lu";
import ExpenseEditForm from "./ExpenseEditForm";
import { useRef, useState } from "react";
import ExpenseDeleteModal from "./ExpenseDeleteModal";

const ExpensesTable = () => {
  const [expenseId, setExpenseId] = useState(null);

  const expenseEditRef = useRef();
  const expenseDeleteRef = useRef();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["expenses"],
    queryFn: getAllExpenses,
  });

  return (
    <div className="overflow-x-auto rounded-box">
      <ExpenseEditForm ref={expenseEditRef} id={expenseId} />
      <ExpenseDeleteModal ref={expenseDeleteRef} id={expenseId} />

      <table className="table">
        <thead>
          <tr className="bg-base-200">
            <th>Expense</th>
            <th>Paid to</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="bg-base-100">
          {isLoading ? (
            <tr>
              <td colSpan={7} className="text-center">
                Loading...
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={7} className="text-center">
                Error
              </td>
            </tr>
          ) : (
            data?.map((expense) => (
              <tr key={expense._id}>
                <td>{expense.title}</td>
                <td>{expense.paidTo}</td>
                <td>
                  <span
                    className={`badge ${
                      expense.paymentStatus === "paid"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {expense.paymentStatus.toUpperCase()}
                  </span>
                </td>
                <td>${expense.amount}</td>
                <td>{expense.paymentMethod?.toUpperCase() || "-"}</td>
                <td>{moment(expense.createdAt).fromNow()}</td>
                <td>
                  <div className="space-x-2">
                    <button
                      type="button"
                      className="btn btn-circle btn-info btn-sm"
                      onClick={() => {
                        setExpenseId(expense._id);
                        expenseEditRef.current.showModal();
                      }}
                    >
                      <LuSquarePen />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-error btn-circle"
                      onClick={() => {
                        setExpenseId(expense._id);
                        expenseDeleteRef.current.showModal();
                      }}
                    >
                      <LuTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesTable;
