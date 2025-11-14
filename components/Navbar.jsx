import Link from "next/link";
import { TbGridDots } from "react-icons/tb";
import Button from "./ui/Button";

export default function Navbar() {
    return (
        <header className="fixed top-0 w-full z-20">
            <div className="navbar w-full max-w-[1426px] mx-auto py-5">
                <div className="navbar-start">
                    <div className="mx-2 flex-1 px-2"><img className="max-w-36" src="/assets/nexoro_logo.png" alt="Nexoro Logo" /></div>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-lg font-semibold menu-horizontal px-1">
                        <li className="dots-before dots-after"><Link href="/">Home</Link></li>
                        <li><Link href="#">About</Link></li>
                        <li className="dots-before dots-after"><Link href="#">Services</Link></li>
                    </ul>
                </div>
                <div className="navbar-end">
                    <Link href="#"><Button>Contact</Button></Link>
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
