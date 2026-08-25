import Link from "next/link";
import { FaEnvelopeCircleCheck } from "react-icons/fa6";
import { LuArrowLeft } from "react-icons/lu";

const page = () => {
  return (
    <main>
      <div className="card shadow-lg w-full max-w-sm p-5 bg-base-300 mx-auto items-center">
        <div className="avatar avatar-placeholder mb-3">
          <div className="bg-main w-18 rounded-full">
            <span className="text-3xl">
              <FaEnvelopeCircleCheck />
            </span>
          </div>
        </div>
        <h1 className="text-lg">Email Verified successfully!</h1>
        <Link href="/dashboard">
          <button className="btn btn-nexoro-primary mt-3">
            Continue to Dashboard
          </button>
        </Link>
        <Link href="/">
          <button className="btn btn-success btn-ghost mt-3">
            <LuArrowLeft /> Go to Home
          </button>
        </Link>
      </div>
    </main>
  );
};

export default page;
