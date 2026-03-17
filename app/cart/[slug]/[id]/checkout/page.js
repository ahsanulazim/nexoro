import BillingForm from "@/components/cart/BillingForm";
import OrderSummery from "@/components/cart/OrderSummery";
import Link from "next/link"
import { LuArrowLeft, LuWallet } from "react-icons/lu";

const page = async ({params}) => {

const {slug, id}= await params;
const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/cart/checkout?slug=${slug}&planId=${id}`);
    const plan = await res.json();

    if (!plan) {
        return notFound();
    }


  return (
    <>
            <div className="max-w-6xl mx-auto w-full p-5">
                <Link href={`/cart/${slug}/${id}`} className="-ml-5"><button className="btn btn-lg btn-ghost mb-5"><LuArrowLeft/> Back</button></Link>
                <div className="flex gap-5 items-start">
                    <div className="flex flex-col gap-5 grow">
                        <div className="bg-base-300 p-5 rounded-box border border-base-200">
                            <h2 className="text-2xl font-semibold flex items-center gap-2"><LuWallet/> Billing Details</h2>
                            <div className="divider"></div>
                            <BillingForm slug={slug} plan={plan.plan.id} />
                        </div>
                    </div>
                    <OrderSummery btn={false} slug={slug} id={plan.plan.id} price={plan.plan.price} className={"hidden lg:block"} />
                </div>
            </div>
            <OrderSummery btn={false} slug={slug} id={plan.plan.id} price={plan.plan.price} className={"sticky bottom-0 left-0 lg:hidden rounded-b-none"} />
        </>
  )
}

export default page