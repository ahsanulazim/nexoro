"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { MoonLoader } from "react-spinners";
import {
  LuBriefcase,
  LuCircleCheck,
  LuCircleX,
  LuClock,
  LuCreditCard,
  LuFileText,
  LuLock,
  LuMail,
  LuPhone,
  LuShieldCheck,
  LuSparkles,
  LuUser,
} from "react-icons/lu";
import { HiOutlineCurrencyBangladeshi } from "react-icons/hi";

export default function PayDealPage() {
  const { dealId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  const statusParam = searchParams.get("status");

  useEffect(() => {
    if (statusParam === "failed") {
      toast.error("Payment failed or was declined. Please try again.");
    } else if (statusParam === "cancelled") {
      toast.info("Payment was cancelled.");
    }
  }, [statusParam]);

  useEffect(() => {
    if (!dealId) return;

    const fetchDeal = async () => {
      try {
        setLoading(true);
        const apiBase =
          process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";
        const res = await fetch(`${apiBase}/payment/deals/${dealId}`);
        const data = await res.json();

        if (data.success) {
          setDeal(data.data);
        } else {
          setError(data.message || "Failed to load deal details.");
        }
      } catch (err) {
        console.error("Deal fetch error:", err);
        setError("Network error while loading deal invoice.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [dealId]);

  const handlePayWithEPS = async () => {
    if (!dealId || isPaying) return;

    try {
      setIsPaying(true);
      const apiBase =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";
      const res = await fetch(`${apiBase}/payment/deals/${dealId}/pay-eps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success && data.redirectUrl) {
        // Redirect client to EPS Payment Gateway
        window.location.href = data.redirectUrl;
      } else {
        toast.error(data.message || "Failed to initialize payment gateway.");
        setIsPaying(false);
      }
    } catch (err) {
      console.error("Payment initiation error:", err);
      toast.error("Could not connect to payment gateway. Please try again.");
      setIsPaying(false);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto py-16 min-h-dvh flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <MoonLoader color="#7c3aed" size={48} />
          <p className="text-base-content/60 text-sm tracking-wide">
            Loading your custom invoice...
          </p>
        </div>
      </main>
    );
  }

  if (error || !deal) {
    return (
      <main className="container mx-auto py-16 min-h-dvh flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-base-200/50 border border-base-300 rounded-3xl p-8 text-center space-y-4">
          <div className="size-16 rounded-full bg-error/15 text-error flex items-center justify-center mx-auto">
            <LuCircleX className="size-8" />
          </div>
          <h2 className="text-2xl font-bold text-base-content">
            Invoice Not Found
          </h2>
          <p className="text-sm text-base-content/60">
            {error ||
              "The requested payment link does not exist or may have been removed."}
          </p>
          <Link href="/">
            <button className="btn btn-primary btn-sm mt-4">
              Go to Homepage
            </button>
          </Link>
        </div>
      </main>
    );
  }

  const isPaid = deal.status === "Paid";
  const isExpired = deal.isExpired || deal.status === "Expired";

  return (
    <main className="container mx-auto py-12 px-4 min-h-dvh flex items-center justify-center">
      <div className="max-w-xl w-full bg-base-100 border border-base-300/80 shadow-2xl rounded-3xl overflow-hidden">
        {/* Top Header Card */}
        <div className="bg-linear-to-r from-base-200/90 via-base-200/50 to-base-200/90 p-6 sm:p-8 border-b border-base-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-primary">
                NEXORO
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Official Invoice
              </span>
            </div>

            {isPaid ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                <LuCircleCheck className="size-3.5" /> PAID
              </span>
            ) : isExpired ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                <LuClock className="size-3.5" /> EXPIRED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/15 text-primary border border-primary/30">
                <LuClock className="size-3.5" /> PENDING PAYMENT
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-base-content leading-tight">
            {deal.serviceName}
          </h1>
          <p className="text-xs text-base-content/60 mt-1 flex items-center gap-1">
            Invoice ID:{" "}
            <span className="font-mono text-base-content/80">
              {deal.dealId}
            </span>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Status Alert if Paid */}
          {isPaid && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
              <LuCircleCheck className="size-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-700 dark:text-emerald-400">
                <span className="font-bold text-sm block">
                  Payment Confirmed!
                </span>
                This invoice has been successfully paid on{" "}
                {deal.paidAt
                  ? new Date(deal.paidAt).toLocaleDateString()
                  : "recently"}
                .
                {deal.orderId && (
                  <span className="block mt-0.5 font-semibold">
                    Order Reference: #{deal.orderId}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Status Alert if Expired */}
          {isExpired && !isPaid && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
              <LuClock className="size-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-700 dark:text-amber-400">
                <span className="font-bold text-sm block">Link Expired</span>
                This custom deal invoice link has expired. Please reply back in
                your chat to receive a new payment link.
              </div>
            </div>
          )}

          {/* Client Details */}
          <div className="bg-base-200/40 rounded-2xl p-4 border border-base-300/60 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-1.5">
              <LuUser className="size-3.5 text-primary" /> Billed To
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-base-content/60 block">
                  Customer Name
                </span>
                <span className="font-bold text-base-content text-sm">
                  {deal.clientName}
                </span>
              </div>
              {deal.clientPhone && (
                <div>
                  <span className="text-base-content/60 block">Phone</span>
                  <span className="font-medium text-base-content flex items-center gap-1">
                    <LuPhone className="size-3 opacity-60" /> {deal.clientPhone}
                  </span>
                </div>
              )}
              {deal.clientEmail &&
                !deal.clientEmail.endsWith("@client.nexoro.local") && (
                  <div>
                    <span className="text-base-content/60 block">Email</span>
                    <span className="font-medium text-base-content flex items-center gap-1 truncate">
                      <LuMail className="size-3 opacity-60" />{" "}
                      {deal.clientEmail}
                    </span>
                  </div>
                )}
              {deal.company && deal.company !== "Individual / Self" && (
                <div>
                  <span className="text-base-content/60 block">Company</span>
                  <span className="font-medium text-base-content flex items-center gap-1">
                    <LuBriefcase className="size-3 opacity-60" /> {deal.company}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Itemized Price Breakdown */}
          <div className="bg-base-200/40 rounded-2xl p-4 border border-base-300/60 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-1.5">
              <LuFileText className="size-3.5 text-primary" /> Payment Breakdown
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-base-content/80">
                <span>{deal.serviceName}</span>
                <span className="font-semibold">
                  BDT {(deal.servicePrice || deal.amount).toLocaleString()}
                </span>
              </div>

              {deal.discount > 0 && (
                <div className="flex items-center justify-between text-emerald-500 font-medium">
                  <span>Special Discount</span>
                  <span>- BDT {deal.discount.toLocaleString()}</span>
                </div>
              )}

              <div className="border-t border-base-300 pt-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-base text-base-content block">
                    Total Payable Amount
                  </span>
                  <span className="text-[11px] text-base-content/60">
                    Includes all applicable taxes & gateways
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-primary flex items-center justify-end">
                    <HiOutlineCurrencyBangladeshi className="size-7 inline" />
                    {deal.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Note / Scope if present */}
          {deal.orderNote && (
            <div className="bg-base-200/20 rounded-xl p-3 border border-base-300/40 text-xs text-base-content/70">
              <span className="font-semibold block mb-0.5 text-base-content/90">
                Project Scope / Deal Notes:
              </span>
              <p className="whitespace-pre-wrap">{deal.orderNote}</p>
            </div>
          )}

          {/* Action / Payment Button */}
          {!isPaid && !isExpired && (
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handlePayWithEPS}
                disabled={isPaying}
                className="btn btn-primary w-full shadow-lg shadow-primary/20 py-3 h-auto text-base font-bold gap-2"
              >
                {isPaying ? (
                  <>
                    <MoonLoader color="#fff" size={20} />
                    <span>Connecting to EPS Payment Gateway...</span>
                  </>
                ) : (
                  <>
                    <LuCreditCard className="size-5" />
                    <span>Pay BDT {deal.amount.toLocaleString()} with EPS</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-base-content/60 pt-1">
                <LuShieldCheck className="size-4 text-emerald-500" />
                <span>
                  Secured by <strong>EPS</strong> (Easy Payment System) •
                  Supports bKash, Nagad, Cards & NetBanking
                </span>
              </div>
            </div>
          )}

          {isPaid && (
            <div className="text-center pt-2">
              <p className="text-xs text-base-content/60">
                Thank you! Your payment is complete. You can safely close this
                window or return to chat.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
