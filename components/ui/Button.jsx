import { IoArrowForwardCircle } from "react-icons/io5";

export default function Button({ children }) {
    return (
        <button className="btn btn-lg border-2 btn-primary rounded-full p-0 pl-5 h-auto bg-main border-main shadow-none">{children} <IoArrowForwardCircle className="size-11" /></button>
    )
}
