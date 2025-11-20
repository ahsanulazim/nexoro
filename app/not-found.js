import Image from "next/image";
import Link from "next/link";

const NotFound = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-dvh py-5">
      <Image
        width={700}
        height={700}
        src="/assets/404.svg"
        alt="404"
        className="w-full max-w-sm mx-auto max-sm:p-5"
        draggable={false}
      />
      <div className="flex flex-col gap-5 items-center">
        <h1 className="text-3xl sm:text-5xl text-center font-semibold text-balance">
          Oops, you found our 404 page
        </h1>
        <p className="text-center text-balance">
          We apologize, but the page you are looking for does not exist.
        </p>
        <Link href="/">
          <button className="btn btn-primary bg-main border-main shadow-none hover:bg-main-dark hover:border-main-dark">
            Go to Homepage
          </button>
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
