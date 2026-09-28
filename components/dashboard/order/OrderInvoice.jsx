"use client";

import React, { forwardRef } from "react";
import moment from "moment";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const OrderInvoice = forwardRef(({ order }, ref) => {
  if (!order) return null;

  // Extract Customer info
  const customerName =
    order.user?.name ||
    order.userName ||
    order.clientName ||
    order.epsData?.CustomerName ||
    "Valued Customer";

  const customerEmail =
    order.user?.email ||
    order.clientEmail ||
    order.epsData?.CustomerEmail ||
    "N/A";

  const customerPhone =
    order.user?.phone || order.phone || order.epsData?.CustomerPhone || null;

  // Extract Service & Plan info
  const serviceTitle =
    order.service?.title ||
    order.serviceTitle ||
    order.serviceName ||
    order.service ||
    "Digital Service";

  const planName =
    order.plan?.planName ||
    order.planName ||
    (order.service === "custom" ? "Customized Package" : "Standard Package");

  // Financial calculations
  const orderPrice = Number(
    order.servicePrice ?? order.price ?? order.plan?.price ?? 0,
  );
  const discount = Number(order.discount || 0);
  const contractValue = Math.max(0, orderPrice - discount);

  let paidAmount = Number(order.amount || 0);
  if (order.payment === "Success" && paidAmount === 0 && contractValue > 0) {
    paidAmount = contractValue;
  }

  const dueAmount =
    order.payment === "Success" ? 0 : Math.max(0, contractValue - paidAmount);

  const invoiceNumber =
    order.orderUid ||
    order.orderId ||
    String(order._id || "")
      .slice(-6)
      .toUpperCase();
  const invoiceDate = order.createdAt
    ? moment(order.createdAt).format("DD MMMM, YYYY")
    : moment().format("DD MMMM, YYYY");

  const isPaid =
    order.payment === "Success" ||
    (paidAmount >= contractValue && contractValue > 0);
  const isPartial =
    order.payment === "Partial" || (paidAmount > 0 && dueAmount > 0);

  return (
    <div
      ref={ref}
      className="bg-white text-slate-800 p-8 sm:p-12 max-w-[820px] mx-auto text-sm font-sans shadow-lg rounded-xl print:shadow-none print:p-6 print:m-0 print:max-w-none print:w-full"
      style={{ minHeight: "1050px" }}
    >
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start pb-8 border-b border-slate-200 gap-6">
        {/* Company Branding */}
        <div className="space-y-2">
          <div className="flex flex-col items-start gap-3">
            {/* Logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/nexoro_light_logo.png"
              alt="Nexoro Solutions"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />

            <p className="text-xs text-slate-500 font-medium">
              Creative strategy that drives real results
            </p>
          </div>

          <div className="text-xs text-slate-500 leading-relaxed pt-2">
            <p>Dhaka & Khulna, Bangladesh</p>
            <p>Email: contact@nexorosolution.com</p>
            <p>Phone: +880 1408-431173 | +1 (870) 744-8416</p>
            <p>Web: www.nexorosolution.com</p>
          </div>
        </div>

        {/* Invoice Metadata */}
        <div className="sm:text-right space-y-2.5">
          <div className="inline-block">
            <span className="text-3xl font-extrabold uppercase tracking-wider text-slate-900">
              INVOICE
            </span>
          </div>

          <div className="text-xs space-y-1">
            <p className="text-slate-500">
              Invoice No:{" "}
              <span className="font-bold text-slate-900 text-sm">
                #{invoiceNumber}
              </span>
            </p>
            <p className="text-slate-500">
              Date:{" "}
              <span className="font-medium text-slate-800">{invoiceDate}</span>
            </p>
            <p className="text-slate-500">
              Order Ref:{" "}
              <span className="font-medium text-slate-800">
                {order.orderId || invoiceNumber}
              </span>
            </p>
            {order.deadline && (
              <p className="text-slate-500">
                Deadline:{" "}
                <span className="font-semibold text-slate-800">
                  {moment(order.deadline).format("DD MMMM, YYYY")}
                </span>
              </p>
            )}
          </div>

          {/* Payment Status Stamp */}
          <div className="pt-1">
            {isPaid ? (
              <span className="inline-block px-3.5 py-1 text-xs font-bold tracking-wider uppercase rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                ✓ Fully Paid
              </span>
            ) : isPartial ? (
              <span className="inline-block px-3.5 py-1 text-xs font-bold tracking-wider uppercase rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                Partial Payment
              </span>
            ) : (
              <span className="inline-block px-3.5 py-1 text-xs font-bold tracking-wider uppercase rounded-md bg-rose-100 text-rose-800 border border-rose-300">
                Payment Due
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Billing Details Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-slate-200">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block mb-2">
            Billed To
          </span>
          <h2 className="text-base font-bold text-slate-900 mb-1">
            {customerName}
          </h2>
          <div className="text-xs text-slate-600 space-y-1">
            <p className="break-all">{customerEmail}</p>
            {customerPhone && <p>{customerPhone}</p>}
            {order.clientId && (
              <p className="text-[11px] text-slate-400">
                Client Ref: {String(order.clientId).slice(-8)}
              </p>
            )}
          </div>
        </div>

        <div className="sm:text-right">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block mb-2">
            Payment Summary
          </span>
          <div className="text-xs text-slate-600 space-y-1">
            <p>
              Payment Method:{" "}
              <span className="font-semibold text-slate-800 capitalize">
                {order.paymentMethod || "Electronic Transfer / Online"}
              </span>
            </p>
            <p>
              Payment Status:{" "}
              <span className="font-semibold text-slate-800">
                {order.payment || "Pending"}
              </span>
            </p>
            <p>
              Project Status:{" "}
              <span className="font-semibold text-slate-800">
                {order.status || "In Progress"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Items & Services Table */}
      <div className="py-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-900 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <th className="py-3 px-2 w-12 text-center">#</th>
              <th className="py-3 px-2">Service Description</th>
              <th className="py-3 px-2 text-center">Package / Plan</th>
              <th className="py-3 px-2 text-right">Qty</th>
              <th className="py-3 px-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            <tr>
              <td className="py-4 px-2 text-center font-medium text-slate-500">
                01
              </td>
              <td className="py-4 px-2">
                <p className="font-bold text-slate-900 text-sm">
                  {serviceTitle}
                </p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Professional digital agency deliverables & project execution
                </p>
                {Array.isArray(order.tasks) && order.tasks.length > 0 && (
                  <div className="mt-2 text-[11px] text-slate-500">
                    <span className="font-medium text-slate-700">
                      Milestones:
                    </span>
                    <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                      {order.tasks.slice(0, 4).map((t, idx) => (
                        <li key={idx} className="truncate">
                          {t.task || t.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </td>
              <td className="py-4 px-2 text-center font-medium text-slate-700">
                <span className="inline-block px-2.5 py-1 bg-slate-100 rounded text-slate-800 font-medium">
                  {planName}
                </span>
              </td>
              <td className="py-4 px-2 text-right font-medium text-slate-700">
                1
              </td>
              <td className="py-4 px-2 text-right font-bold text-slate-900">
                ৳{orderPrice.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 4. Financial Calculations Box */}
      <div className="flex flex-col sm:flex-row justify-between items-start pt-4 pb-8 border-t border-slate-200 gap-6">
        <div className="text-xs text-slate-500 max-w-sm">
          <p className="font-bold text-slate-700 mb-1">Notes & Terms:</p>
          <p className="leading-relaxed">
            Thank you for choosing Nexoro Solutions. All services are governed
            by our standard service agreement. For any inquiries regarding this
            invoice, please reach out to support@nexorosolution.com.
          </p>
        </div>

        <div className="w-full sm:w-72 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-semibold text-slate-900">
              ৳{orderPrice.toLocaleString()}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Discount:</span>
              <span className="font-semibold">
                -৳{discount.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-2 text-sm">
            <span>Total Payable:</span>
            <span>৳{contractValue.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-emerald-700 pt-1">
            <span>Amount Paid:</span>
            <span className="font-semibold">
              ৳{paidAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-900 font-bold border-t-2 border-slate-900 pt-2 text-base">
            <span className="text-rose-600">Balance Due:</span>
            <span
              className={dueAmount > 0 ? "text-rose-600" : "text-emerald-600"}
            >
              ৳{dueAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Official Signature & Verification Footer */}
      <div className="pt-12 mt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-slate-500">
        <div className="space-y-1">
          <p className="font-semibold text-slate-700">Official Verification</p>
          <p className="text-[11px] text-slate-400">
            This invoice is system-generated and verified by Nexoro Solutions.
          </p>
          <p className="text-[10px] text-slate-400">
            Generated on {moment().format("DD/MM/YYYY, hh:mm A")}
          </p>
        </div>

        <div className="text-center sm:text-right min-w-[180px]">
          <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-700 font-bold text-sm">
            Nexoro Solutions
          </div>
          <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
            Authorized Signature
          </p>
        </div>
      </div>
    </div>
  );
});

OrderInvoice.displayName = "OrderInvoice";

export default OrderInvoice;
