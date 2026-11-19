"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MoonLoader } from "react-spinners";
import { LuCheck, LuCircleX, LuLayoutDashboard, LuMessageSquare } from "react-icons/lu";

export default function DealPaymentSuccessPage() {
  const { dealId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const merchantTransactionId = searchParams.get("merchantTransactionId");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!dealId) return;

    const verifyAndConfirm = async () => {
      try {
        setLoading(true);
        const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";
        const query = merchantTransactionId
          ? `?merchantTransactionId=${merchantTransactionId}`
          : "";
        const res = await fetch(`${apiBase}/payment/deals/${dealId}/confirm-eps${query}`);
        const data = await res.json();

        if (data.success) {
          setSuccess(true);
          setOrderId(data.orderId);
        } else {
          setSuccess(false);
          setErrorMsg(data.message || "Payment verification failed with EPS.");
        }
      } catch (err) {
        console.error("Deal confirmation error:", err);
        setSuccess(false);
        setErrorMsg("Network error while verifying payment status.");
      } finally {
        setLoading(false);
      }
    };

    verifyAndConfirm();
  }, [dealId, merchantTransactionId]);

  return (
    <main className="container mx-auto py-16 px-4 min-h-dvh flex items-center justify-center">
      <div className="max-w-md w-full bg-base-100 border border-base-300/80 shadow-2xl rounded-3xl p-8 text-center space-y-5">
        {loading ? (
          <>
            <div className="size-20 mx-auto flex items-center justify-center">
              <MoonLoader color="#7c3aed" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-base-content">
              Verifying Payment...
            </h2>
            <p className="text-xs text-base-content/60">
              Please wait while we confirm your payment with EPS and register your order.
            </p>
          </>
        ) : success ? (
          <>
            <div className="size-20 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
              <LuCheck className="size-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content">
                Payment Successful!
              </h2>
              <p className="text-sm text-emerald-500 font-semibold">
                Your order is confirmed
              </p>
            </div>

            {orderId && (
              <div className="p-3 bg-base-200/60 rounded-2xl border border-base-300 text-xs">
                <span className="text-base-content/60 block">Order Number</span>
                <span className="text-base font-mono font-bold text-primary">
                  #{orderId}
                </span>
              </div>
            )}

            <p className="text-xs text-base-content/70 leading-relaxed">
              We have automatically updated your chat room. Our team has received your order details and will begin work right away.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/">
                <button className="btn btn-sm btn-primary w-full">
                  Return to Home
                </button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="size-20 rounded-full bg-error/15 text-error flex items-center justify-center mx-auto">
              <LuCircleX className="size-10" />
            </div>
            <h2 className="text-2xl font-bold text-base-content">
              Verification Issue
            </h2>
            <p className="text-xs text-base-content/70">
              {errorMsg || "We could not verify your payment with the EPS gateway."}
            </p>
            <div className="pt-2">
              <Link href={`/pay/${dealId}`}>
                <button className="btn btn-sm btn-outline btn-error w-full">
                  Back to Invoice Page
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
