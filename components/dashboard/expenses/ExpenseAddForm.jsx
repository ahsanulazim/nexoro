import { useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addExpense } from "@/api/fetchExpense";
import { toast } from "react-toastify";

const ExpenseAddForm = ({ ref }) => {
  const queryClient = useQueryClient();

  const addExpenseMutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense added successfully");
      ref.current.close();
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      invoice: "",
      invoiceDate: "",
      amount: 0,
      paidTo: "",
      frequency: "single",
      note: "",
      paymentStatus: "",
      paymentMethod: "",
    },
  });

  const onSubmit = async (data) => {
    addExpenseMutation.mutate(data);
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add Expense</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="fieldset">
          <label htmlFor="title" className="label">
            Title <span className="text-error">*</span>
          </label>
          <input
            type="text"
            placeholder="Internet Bill"
            className="input w-full"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <p className="text-error">{errors.title.message}</p>}
          <div className="grid grid-cols-2 gap-5">
            <div className="fieldset">
              <label htmlFor="invoice" className="label">
                Invoice No.
              </label>
              <input
                type="text"
                placeholder="#ORD-012345"
                className="input w-full"
                {...register("invoice")}
              />
            </div>
            <div className="fieldset">
              <label htmlFor="invoiceDate" className="label">
                Invoice Date
              </label>
              <input
                type="date"
                className="input w-full"
                {...register("invoiceDate")}
              />
            </div>
          </div>

          <label htmlFor="amount" className="label">
            Amount <span className="text-error">*</span>
          </label>
          <input
            type="number"
            className="input w-full"
            {...register("amount", {
              required: "Amount is required",
              min: { value: 1, message: "Amount must be greater than 0" },
              valueAsNumber: true,
            })}
          />
          {errors.amount && (
            <p className="text-error">{errors.amount.message}</p>
          )}

          <label htmlFor="paymentStatus" className="label">
            Payment Status <span className="text-error">*</span>
          </label>
          <select
            className="select w-full"
            {...register("paymentStatus", {
              required: "Payment Status is required",
            })}
          >
            <option value="" disabled>
              Select Payment Status
            </option>
            <option value="paid">Paid</option>
            <option value="due">Due</option>
            <option value="partial">Partial</option>
          </select>
          {errors.paymentStatus && (
            <p className="text-error">{errors.paymentStatus.message}</p>
          )}
          {watch("paymentStatus") !== "due" &&
            watch("paymentStatus") !== "" && (
              <>
                <label htmlFor="paymentMethod" className="label">
                  Payment Method <span className="text-error">*</span>
                </label>
                <select
                  className="select w-full"
                  {...register("paymentMethod", {
                    required: "Payment Method is required",
                  })}
                >
                  <option value="" disabled>
                    Select Payment Method
                  </option>
                  <option value="cash">Cash</option>
                  <option value="bank">Bank</option>
                  <option value="card">Card</option>
                  <option value="mfs">Mobile Banking</option>
                </select>
                {errors.paymentMethod && (
                  <p className="text-error">{errors.paymentMethod.message}</p>
                )}
              </>
            )}

          <label htmlFor="paidTo" className="label">
            Paid To <span className="text-error">*</span>
          </label>
          <input
            type="text"
            placeholder="Dot Internet"
            className="input w-full"
            {...register("paidTo", { required: "Paid To is required" })}
          />
          {errors.paidTo && (
            <p className="text-error">{errors.paidTo.message}</p>
          )}

          <label htmlFor="frequency" className="label">
            Frequency <span className="text-error">*</span>
          </label>
          <div className="grid grid-cols-2 gap-5">
            <label className="flex gap-2 items-center border rounded-box p-2 border-base-content/25">
              <input
                type="radio"
                {...register("frequency", {
                  required: "Frequency is required",
                })}
                value="single"
                defaultChecked
              />
              <div>
                <h4 className="text-sm font-medium">Single Expense</h4>
                <p className="text-xs opacity-50">
                  A single entry do not repeat again
                </p>
              </div>
            </label>
            <label className="flex gap-2 items-center border rounded-box p-2 border-base-content/25">
              <input
                type="radio"
                {...register("frequency", {
                  required: "Frequency is required",
                })}
                value="recurring"
              />
              <div>
                <h4 className="text-sm font-medium">Recurring Expense</h4>
                <p className="text-xs opacity-50">
                  Repeats on a monthly or annual basis
                </p>
              </div>
            </label>
          </div>
          {errors.frequency && (
            <p className="text-error">{errors.frequency.message}</p>
          )}

          <label htmlFor="note" className="label">
            Note (optional)
          </label>
          <textarea
            className="textarea w-full"
            placeholder="Add any note about this expense"
            {...register("note")}
          ></textarea>

          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button
              type="button"
              className="btn btn-error"
              onClick={() => {
                ref.current.close();
                reset();
              }}
            >
              Close
            </button>
            <button
              type="submit"
              className={`btn ${addExpenseMutation.isPending ? "" : "btn-nexoro-primary"}`}
              disabled={addExpenseMutation.isPending}
            >
              {addExpenseMutation.isPending ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Adding
                </>
              ) : (
                <>
                  <LuPlus /> Add
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ExpenseAddForm;
