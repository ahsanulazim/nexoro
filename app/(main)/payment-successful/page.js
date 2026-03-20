"use client";
import { confirmOrder } from "@/api/fetchEps";
import { MyContext } from "@/context/MyProvider";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { LuLayoutDashboard } from "react-icons/lu";
import { MoonLoader } from "react-spinners";
import { toast } from "react-toastify";

const page = () => {
  const { user } = useContext(MyContext);
  const searchParams = useSearchParams();
  const uid = user?.uid;
  const router = useRouter();

  const merchantTransactionId = searchParams.get("MerchantTransactionId");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("epsToken") : null;

  const mutation = useMutation({
    mutationFn: () => confirmOrder({ merchantTransactionId, token, uid }),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Order confirmed! Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        toast.error("Payment verification failed.");
      }
    },
    onError: () => {
      toast.error("Something went wrong while confirming order.");
    },
  });

  useEffect(() => {
    if (merchantTransactionId && uid) {
      mutation.mutate();
    }
  }, [merchantTransactionId, uid]);

  return (
    <main className="container mx-auto py-8 min-h-dvh flex items-center justify-center">
      <div className="flex items-center flex-col">
        {mutation.isPending ? (
          <>
            <div className="mb-6 mx-auto size-20">
              <MoonLoader color="#FFF" />
            </div>
            <h2 className="text-3xl">Verifying payment...</h2>
          </>
        ) : (
          <>
            <div className="bg-success size-20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <FaCheck className="text-success-content text-3xl" />
            </div>
            <h2 className="text-3xl">Thank you for your purchase!</h2>
            <p className="opacity-50">
              You'll be contacted shortly by our team.
            </p>
            <Link href="/dashboard">
              <button className="btn btn-primary bg-main border-main shadow-none hover:bg-main-dark hover:border-main-dark mt-6">
                <LuLayoutDashboard /> Dashboard
              </button>
            </Link>
          </>
        )}
      </div>
    </main>
  );
};

export default page;
