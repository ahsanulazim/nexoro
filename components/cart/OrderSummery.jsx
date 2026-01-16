import { useRouter } from "next/navigation";

const OrderSummery = ({ className }) => {
    const router = useRouter();

    return (
        <div className={`lg:flex-none lg:max-w-sm w-full bg-base-300 p-5 rounded-box border border-base-200 ${className}`}>
            <h2 className="text-2xl mb-5 font-semibold">Order Summery</h2>
            <div className="flex justify-between">
                <h3>Subtotal</h3>
                <h3>$1000</h3>
            </div>
            <div className="divider"></div>
            <p className="text-main-light font-bold mb-5">Have a coupon code?</p>
            <button className="btn btn-primary btn-nexoro-primary w-full" onClick={() => router.push("/register")}>Checkout</button>
        </div>
    )
}

export default OrderSummery