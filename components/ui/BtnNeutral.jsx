import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";

export default function BtnNeutral({ children, link }) {
  return (
    <>
      {link ? (
        <Link href={link}>
          <button className="btn sm:btn-lg btn-neutral bg-base-100 border-4 border-base-100 rounded-full p-0 pl-3 sm:pl-5 h-auto shadow-none">
            {children}{" "}
            <div className="bg-main p-2 rounded-full">
              <IoArrowForward className="text-white" />
            </div>
          </button>
        </Link>
      ) : (
        <button className="btn sm:btn-lg btn-neutral bg-base-100 border-4 border-base-100 rounded-full p-0 pl-3 sm:pl-5 h-auto shadow-none">
          {children}{" "}
          <div className="bg-main p-2 rounded-full">
            <IoArrowForward className="text-white" />
          </div>
        </button>
      )}
    </>
  );
}
