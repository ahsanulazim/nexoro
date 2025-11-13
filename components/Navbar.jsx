import Link from "next/link";
import { TbGridDots } from "react-icons/tb";
import { IoArrowForwardCircle } from "react-icons/io5";

export default function Navbar() {
    return (
        <header>
            <div className="navbar w-full max-w-[1426px] mx-auto">
                <div className="navbar-start">
                    <div className="mx-2 flex-1 px-2"><img className="max-w-36" src="/assets/nexoro_logo.png" alt="Nexoro Logo" /></div>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="#">About</Link></li>
                        <li><Link href="#">Services</Link></li>
                    </ul>
                </div>
                <div className="navbar-end">
                    <Link href="#"><button className="btn btn-primary rounded-full p-0 pl-5 h-auto bg-main border-main shadow-none">Contact <IoArrowForwardCircle className="size-11" /></button></Link>
                    <div className="flex-none lg:hidden">
                        <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <TbGridDots className="size-6" />
                        </label>
                    </div>
                </div>
            </div>
        </header>
    )
}
