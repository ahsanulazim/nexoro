import { IoArrowForwardCircle } from "react-icons/io5";

export default function Button({ children }) {
    return (
        <button className="btn sm:btn-lg border-2 btn-primary rounded-full p-0 pl-3 sm:pl-5 h-auto bg-main border-main shadow-none">{children} <IoArrowForwardCircle className="size-8 sm:size-11" /></button>
    )
}
