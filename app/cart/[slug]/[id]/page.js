import More from "@/components/cart/More"
import OrderSummery from "@/components/cart/OrderSummery"
import FooterYear from "@/components/FooterYear"
import Link from "next/link"
import { notFound } from "next/navigation"

const Checkout = async ({ params }) => {

    const { slug, id } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/cart/checkout?slug=${slug}&planId=${id}`);
    const plan = await res.json();

    if (!plan) {
        return notFound();
    }

    return (
        <main className="min-h-dvh flex flex-col justify-between">
            <div className="p-5 sm:px-10">
                <Link href="/" className="block max-w-fit"><img className="w-full max-w-36" src="/assets/nexoro_logo.png" alt="Nexoro Logo" /></Link>
            </div>
            <div className="max-w-6xl mx-auto w-full p-5">
                <h1 className="text-5xl mb-10">Your Cart</h1>
                <div className="flex gap-5 items-start">
                    <div className="flex flex-col gap-5 grow">
                        <div className="bg-base-300 p-5 rounded-box border border-base-200">
                            <h2 className="text-2xl font-semibold">{plan.service.title}</h2>
                            <div className="divider"></div>
                            <div className="flex justify-between">
                                <h3>{plan.plan.planName}</h3>
                                <h3>${plan.plan.price}</h3>
                            </div>
                            <p className="opacity-50 text-sm mt-1">30-day money-back guarantee. Cancel any time.</p>
                            <div role="alert" className="alert alert-success alert-soft mt-5">
                                <span>Get up to 20% discount using coupon code <span className="font-bold">&quot;WINTER2026&quot;</span></span>
                            </div>
                        </div>
                        {/* <div className="bg-base-300 p-5 rounded-box border border-base-200">
                            <More />
                        </div> */}
                    </div>
                    <OrderSummery slug={slug} id={plan.plan.id} price={plan.plan.price} className={"hidden lg:block"} />
                </div>
            </div>
            <FooterYear />
            <OrderSummery slug={slug} id={plan.plan.id} price={plan.plan.price} className={"sticky bottom-0 left-0 lg:hidden rounded-b-none"} />
        </main>
    )
}

export default Checkout