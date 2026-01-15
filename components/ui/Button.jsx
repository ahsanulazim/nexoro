import { IoArrowForwardCircle } from "react-icons/io5";

export default function Button({ children, className }) {
  return (
    <button className={`btn sm:btn-lg btn-nexoro ${className ? className : ""}`}>
      {children} <IoArrowForwardCircle className="size-8 sm:size-11" />
    </button>
  );
}
