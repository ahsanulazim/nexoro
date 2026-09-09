"use client";

import { useState } from "react";
import { LuDollarSign, LuPlus, LuReceipt, LuX } from "react-icons/lu";
import { toast } from "react-toastify";

const AddCostModal = ({
  ref,
  order,
  updateCosts,
  isPending,
  currentUser,
  isAdmin,
}) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleClose = () => {
    setTitle("");
    setAmount("");
    setNote("");
    ref?.current?.close();
  };

  const handleAddCost = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const parsedAmount = Number(amount);

    if (!trimmedTitle) {
      toast.error("Please provide an expense title");
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please provide a valid positive cost amount");
      return;
    }

    const newCostItem = {
      id: `cost_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: trimmedTitle,
      amount: parsedAmount,
      note: note.trim(),
      date: new Date().toISOString(),
      addedBy:
        currentUser?.user?.name ||
        currentUser?.user?.displayName ||
        currentUser?.user?.email ||
        (isAdmin ? "Admin" : "Team Member"),
    };

    const existingCosts = Array.isArray(order?.costs) ? order.costs : [];
    const updatedCosts = [...existingCosts, newCostItem];

    updateCosts(
      { orderId: order?._id, costs: updatedCosts },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  return (
    <dialog ref={ref} className="modal modal-bottom sm:modal-middle" data-lenis-ignore>
      <div className="modal-box max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-base-200">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <LuReceipt className="text-primary size-5" />
            Add Project Expense
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <LuX className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAddCost} className="mt-4 space-y-4">
          <div>
            <label className="label text-xs font-semibold uppercase opacity-70">
              Expense Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Freelancer Fee, Theme, Plugin, API"
              className="input input-bordered w-full"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="label text-xs font-semibold uppercase opacity-70">
              Cost Amount (৳ BDT) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="1"
              step="any"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label text-xs font-semibold uppercase opacity-70">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Invoice details, purchased from Envato, etc."
              className="textarea textarea-bordered w-full resize-none h-20"
            ></textarea>
          </div>

          <div className="modal-action pt-2 border-t border-base-200">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary px-6"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Saving...
                </>
              ) : (
                "Save Cost"
              )}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
};

export default AddCostModal;
