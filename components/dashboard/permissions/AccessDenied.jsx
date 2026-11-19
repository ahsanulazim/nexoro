"use client";

import Link from "next/link";
import { LuShieldAlert, LuArrowLeft, LuLayoutDashboard } from "react-icons/lu";

export default function AccessDenied({ moduleName = "this page" }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-base-100 rounded-2xl border border-base-200/80 p-8 shadow-xs">
        <div className="size-16 rounded-2xl bg-error/10 text-error flex items-center justify-center mx-auto mb-4">
          <LuShieldAlert className="size-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-base-content mb-2">
          Access Restricted
        </h2>
        <p className="text-sm text-base-content/70 mb-6">
          You do not have permission to access{" "}
          <span className="font-semibold text-base-content">{moduleName}</span>.
          Please contact an administrator if you believe this is a mistake or need access.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <Link
            href="/dashboard"
            className="btn btn-sm btn-primary w-full sm:w-auto"
          >
            <LuLayoutDashboard className="size-4" />
            Go to Dashboard
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn btn-sm btn-ghost w-full sm:w-auto"
          >
            <LuArrowLeft className="size-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
