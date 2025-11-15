import { IoArrowForwardCircle } from "react-icons/io5";

export default function BtnNeutral({ children }) {
  return (
    <button className="btn sm:btn-lg btn-neutral bg-base-100 border-2 border-base-100 rounded-full p-0 pl-3 sm:pl-5 h-auto shadow-none">
      {children}{" "}
      <IoArrowForwardCircle className="text-main size-8 sm:size-11" />
    </button>
  );
}
