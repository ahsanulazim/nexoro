"use client";

import { LuTriangleAlert, LuTrash2, LuX } from "react-icons/lu";

export default function QueryDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  query,
  batchCount = 0,
  isDeleting = false,
}) {
  if (!isOpen) return null;

  const isBatch = batchCount > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-base-100 rounded-3xl border border-base-300 shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="size-12 rounded-2xl bg-error/10 text-error flex items-center justify-center">
            <LuTriangleAlert className="size-6" />
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="btn btn-sm btn-circle btn-ghost text-base-content/60"
          >
            <LuX className="size-4" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-base-content">
            {isBatch ? `Delete ${batchCount} Queries?` : "Delete Contact Query?"}
          </h3>
          <p className="text-xs text-base-content/70 mt-1 leading-relaxed">
            {isBatch
              ? `Are you sure you want to permanently delete these ${batchCount} selected queries? This action cannot be undone.`
              : `Are you sure you want to delete the query from "${query?.name || "this client"}"? This action cannot be undone.`}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="btn btn-sm btn-ghost rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="btn btn-sm btn-error text-white rounded-xl"
          >
            {isDeleting ? (
              <>
                <span className="loading loading-spinner loading-xs" />
                Deleting...
              </>
            ) : (
              <>
                <LuTrash2 className="size-3.5" />
                {isBatch ? `Delete ${batchCount} Items` : "Delete Query"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
