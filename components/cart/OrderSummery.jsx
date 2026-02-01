'use client'

import { createOrder } from "@/api/fetchCart";
import auth from "@/firebase/firebase.config";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

const OrderSummery = ({ className, price, slug, id }) => {
    const router = useRouter();
    const [user] = useAuthState(auth);

    return (
        <div className={`lg:flex-none lg:max-w-sm w-full bg-base-300 p-5 rounded-box border border-base-200 ${className}`}>
            <h2 className="text-2xl mb-5 font-semibold">Order Summery</h2>
            <div className="flex justify-between">
                <h3>Subtotal</h3>
                <h3>${price}</h3>
            </div>
            <div className="divider"></div>
            <p className="text-main-light font-bold mb-5">Have a coupon code?</p>
            <button className="btn btn-primary btn-nexoro-primary w-full" onClick={() => user ? createOrder(slug, id) : router.push("/register")}>Checkout</button>
        </div>
    )
}

export default OrderSummery