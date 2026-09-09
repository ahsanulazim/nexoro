"use client";

import { updateOrderCosts } from "@/api/fetchOrder";
import { useAuth } from "@/context/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useRef } from "react";
import {
  LuCircleDollarSign,
  LuHandCoins,
  LuPlus,
  LuReceipt,
  LuTrash2,
  LuTrendingUp,
  LuWallet,
} from "react-icons/lu";
import { toast } from "react-toastify";
import AddCostModal from "./AddCostModal";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const OrderCostManagement = ({ order }) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const costModalRef = useRef(null);

  const isAdmin = currentUser?.user?.role === "admin";
  const isMember = currentUser?.user?.role === "member";
  const currentUserId = currentUser?.user?._id
    ? String(currentUser.user._id)
    : "";
  const currentUserEmail = currentUser?.user?.email?.toLowerCase() || "";
  const currentUserName = (
    currentUser?.user?.name ||
    currentUser?.user?.displayName ||
    ""
  ).toLowerCase();

  const isAssignedToMe = Boolean(
    currentUser?.user &&
    ((order?.assignedTo &&
      (String(order.assignedTo) === currentUserId ||
        String(order.assignedTo).toLowerCase() === currentUserEmail ||
        String(order.assignedTo).toLowerCase() === currentUserName)) ||
      (order?.assignedMemberEmail &&
        order.assignedMemberEmail.toLowerCase() === currentUserEmail)),
  );

  const canManageCosts = isAdmin || (isMember && isAssignedToMe);

  const costs = Array.isArray(order?.costs) ? order.costs : [];
  const totalCost = costs.reduce(
    (acc, curr) => acc + (Number(curr.amount) || 0),
    0,
  );

  const orderPrice = Number(
    order?.servicePrice ?? order?.price ?? order?.plan?.price ?? 0,
  );
  const discount = Number(order?.discount || 0);
  const contractValue = Math.max(0, orderPrice - discount);

  let paidAmount = Number(order?.amount || 0);
  if (order?.payment === "Success" && paidAmount === 0 && contractValue > 0) {
    paidAmount = contractValue;
  }

  const netRevenue = contractValue - totalCost;
  const realizedProfit = paidAmount - totalCost;
  const dueAmount =
    order?.payment === "Success" ? 0 : Math.max(0, contractValue - paidAmount);

  const { mutate: updateCosts, isPending } = useMutation({
    mutationFn: updateOrderCosts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Cost updated successfully");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update cost");
    },
  });

  if (!canManageCosts && !isAdmin) {
    return (
      <div className="p-4 text-center text-xs opacity-60 bg-base-200/60 rounded-xl">
        Project costs and financial calculations are available to administrators
        and assigned team members only.
      </div>
    );
  }

  const handleDeleteCost = (costId) => {
    const updatedCosts = costs.filter((c) => c.id !== costId);
    updateCosts({ orderId: order._id, costs: updatedCosts });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <LuReceipt className="text-primary size-5" />
          Project Costs & Revenue
        </h2>
        {canManageCosts && (
          <button
            type="button"
            onClick={() => costModalRef.current?.showModal()}
            className="btn btn-primary btn-xs gap-1 shadow-sm"
          >
            <LuPlus className="size-3.5" /> Add Cost
          </button>
        )}
      </div>

      {/* Revenue & Profit Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-base-200/80 p-3 rounded-xl border border-base-300">
          <span className="text-[11px] font-medium opacity-60 flex items-center gap-1">
            <LuWallet className="size-3 text-warning" /> Total Cost
          </span>
          <p className="text-base sm:text-lg font-bold text-error mt-0.5 flex items-center">
            <FaBangladeshiTakaSign className="inline-block text-sm" />
            {totalCost.toLocaleString()}
          </p>
          <span className="text-[10px] opacity-50">
            {costs.length} {costs.length === 1 ? "expense" : "expenses"}
          </span>
        </div>

        <div className="bg-base-200/80 p-3 rounded-xl border border-base-300">
          <span className="text-[11px] font-medium opacity-60 flex items-center gap-1">
            <LuTrendingUp className="size-3 text-success" /> Net Revenue
          </span>
          <p
            className={`text-base sm:text-lg font-bold mt-0.5 flex items-center ${
              netRevenue >= 0 ? "text-success" : "text-error"
            }`}
          >
            <FaBangladeshiTakaSign className="inline-block text-sm" />
            {netRevenue.toLocaleString()}
          </p>
          <span className="text-[10px] opacity-50">Projected profit</span>
        </div>

        <div className="bg-base-200/80 p-3 rounded-xl border border-base-300">
          <span className="text-[11px] font-medium opacity-60 flex items-center gap-1">
            <LuCircleDollarSign className="size-3 text-info" /> Realized Cash
          </span>
          <p
            className={`text-base sm:text-lg font-bold mt-0.5 flex items-center ${
              realizedProfit >= 0 ? "text-info" : "text-warning"
            }`}
          >
            <FaBangladeshiTakaSign className="inline-block text-sm" />
            {realizedProfit.toLocaleString()}
          </p>
          <span className="text-[10px] opacity-50">Paid - Total Cost</span>
        </div>

        <div className="bg-base-200/80 p-3 rounded-xl border border-base-300">
          <span className="text-[11px] font-medium opacity-60 flex items-center gap-1">
            <LuHandCoins className="size-3 text-warning" /> Client Due
          </span>
          <p
            className={`text-base sm:text-lg font-bold mt-0.5 flex items-center ${
              dueAmount > 0 ? "text-warning" : "text-success"
            }`}
          >
            <FaBangladeshiTakaSign className="inline-block text-sm" />
            {dueAmount.toLocaleString()}
          </p>
          <span className="text-[10px] opacity-50">
            {dueAmount > 0 ? "Receivable" : "Full paid"}
          </span>
        </div>
      </div>

      {/* Itemized Cost List */}
      <div className="space-y-2">
        <span className="text-xs font-semibold opacity-70 uppercase tracking-wider block">
          All Expenses ({costs.length})
        </span>

        {costs.length === 0 ? (
          <div className="p-4 text-center text-xs opacity-50 bg-base-200/40 rounded-xl border border-dashed border-base-300">
            No expenses recorded yet. Click &quot;Add Cost&quot; to log project
            expenses.
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {costs.map((cost) => {
              const canDelete =
                isAdmin ||
                (currentUser?.user?.name &&
                  cost.addedBy === currentUser.user.name) ||
                (currentUser?.user?.email &&
                  cost.addedBy === currentUser.user.email);

              return (
                <div
                  key={cost.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-base-200/60 hover:bg-base-200 transition-colors border border-base-300/50"
                >
                  <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate text-base-content">
                        {cost.title}
                      </span>
                      {cost.addedBy && (
                        <span className="badge badge-ghost badge-xs text-[10px] shrink-0 opacity-70">
                          {cost.addedBy}
                        </span>
                      )}
                    </div>
                    {cost.note && (
                      <p className="text-xs opacity-60 truncate">{cost.note}</p>
                    )}
                    <span className="text-[10px] opacity-40 block">
                      {moment(cost.date).format("MMM D, YYYY • h:mm A")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-sm text-error">
                      -৳{Number(cost.amount || 0).toLocaleString()}
                    </span>
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCost(cost.id)}
                        disabled={isPending}
                        className="btn btn-ghost btn-xs btn-square text-error/70 hover:text-error hover:bg-error/10"
                        title="Delete expense"
                      >
                        <LuTrash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Cost Modal Component (using ref to open/close) */}
      <AddCostModal
        ref={costModalRef}
        order={order}
        updateCosts={updateCosts}
        isPending={isPending}
        currentUser={currentUser}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default OrderCostManagement;
