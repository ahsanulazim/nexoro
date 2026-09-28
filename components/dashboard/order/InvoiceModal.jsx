"use client";

import React, { forwardRef, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { LuPrinter, LuX, LuReceipt } from "react-icons/lu";
import OrderInvoice from "./OrderInvoice";

const InvoiceModal = forwardRef(({ order, onClose }, ref) => {
  const invoiceRef = useRef(null);

  const invoiceTitle = `Invoice_${order?.orderUid || order?.orderId || "Nexoro"}`;

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: invoiceTitle,
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          background-color: #ffffff !important;
        }
      }
    `,
  });

  const handleClose = () => {
    if (ref?.current?.close) {
      ref.current.close();
    }
    if (onClose) {
      onClose();
    }
  };

  if (!order) {
    return (
      <dialog ref={ref} className="modal">
        <div className="modal-box max-w-4xl p-0 overflow-hidden">
          <div className="p-6 text-center text-sm text-base-content/60">
            No order data available for invoice preview.
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleClose}>close</button>
        </form>
      </dialog>
    );
  }

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box max-w-4xl max-h-[92vh] p-0 flex flex-col bg-base-200 border border-base-content/10 shadow-2xl rounded-2xl overflow-hidden">
        {/* Modal Action Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-base-100 border-b border-base-content/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <LuReceipt className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Order Invoice
              </h3>
              <p className="text-xs text-base-content/60">
                Invoice #{order.orderUid || order.orderId || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-primary btn-sm gap-2 shadow-xs"
            >
              <LuPrinter className="size-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Close"
            >
              <LuX className="size-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body Preview */}
        <div className="overflow-y-auto p-4 sm:p-8 flex-1 bg-slate-100 dark:bg-neutral-900/60 flex justify-center">
          <div className="w-full max-w-[820px]">
            <OrderInvoice ref={invoiceRef} order={order} />
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
});

InvoiceModal.displayName = "InvoiceModal";

export default InvoiceModal;
