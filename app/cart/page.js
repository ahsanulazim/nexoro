'use client'

import OrderSummery from "@/components/cart/OrderSummery"
import FooterYear from "@/components/FooterYear"
import Link from "next/link"
import { FaBolt, FaCartPlus } from "react-icons/fa6"

const page = () => {

    return (
        <main className="min-h-dvh flex flex-col justify-between">
            <div className="py-5 px-10">
                <Link href="/" className="block max-w-fit"><img className="w-full max-w-36" src="/assets/nexoro_logo.png" alt="Nexoro Logo" /></Link>
            </div>
            <div className="max-w-6xl mx-auto w-full p-5">
                <h1 className="text-5xl mb-10">Your Cart</h1>
                <div className="flex gap-5 items-start">
                    <div className="flex flex-col gap-5 grow">
                        <div className="bg-base-300 p-5 rounded-box border border-base-200">
                            <h2 className="text-2xl font-semibold">Digital Marketing</h2>
                            <div className="divider"></div>
                            <div className="flex justify-between">
                                <h3>Standard Plan</h3>
                                <h3>$1000</h3>
                            </div>
                            <p className="opacity-50 text-sm mt-1">30-day money-back guarantee. Cancel any time.</p>
                            <div role="alert" className="alert alert-success alert-soft mt-5">
                                <span>Get up to 20% discount using coupon code <span className="font-bold">"WINTER2026"</span></span>
                            </div>
                        </div>
                        <div className="bg-base-300 p-5 rounded-box border border-base-200">
                            <h2 className="flex items-center gap-2 text-2xl font-semibold"><FaBolt className="text-success" />Get more Solutions from us</h2>
                            <div className="divider"></div>
                            <div className="flex justify-between">
                                <div>
                                    <h3>Web Development</h3>
                                    <select defaultValue="" className="select mt-3">
                                        <option value="" disabled={true}>Select Plan</option>
                                        <option>Basic - $299</option>
                                        <option>Standard - $699</option>
                                        <option>Advanced - $1499</option>
                                    </select>
                                </div>
                                <button className="btn btn-primary btn-nexoro-primary"><FaCartPlus />$1000</button>
                            </div>
                        </div>
                    </div>
                    <OrderSummery className={"hidden lg:block"} />
                </div>
            </div>
            <FooterYear />
            <OrderSummery className={"sticky bottom-0 left-0 lg:hidden rounded-b-none"} />
        </main>
    )
}

export default page