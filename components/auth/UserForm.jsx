import Link from "next/link";
import { LuKey, LuMail, LuUser } from "react-icons/lu";

const UserForm = ({ login }) => {
  console.log(login);

  return (
    <form className="fieldset bg-base-200 border-base-300 rounded-box w-full sm:max-w-lg border p-5 sm:p-10 mx-auto">
      <h1 className=" text-center font-semibold text-2xl sm:text-4xl mb-5">
        {login ? "Login" : "Register"}
      </h1>
      {/* Social Login */}
      <div className="flex gap-5">
        <button className="btn bg-white text-black border-[#e5e5e5] grow py-6 rounded-lg">
          <svg
            aria-label="Google logo"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <g>
              <path d="m0 0H512V512H0" fill="#fff"></path>
              <path
                fill="#34a853"
                d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
              ></path>
              <path
                fill="#4285f4"
                d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
              ></path>
              <path
                fill="#fbbc02"
                d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
              ></path>
              <path
                fill="#ea4335"
                d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
              ></path>
            </g>
          </svg>
        </button>

        {/* Facebook */}
        <button className="btn bg-[#1A77F2] text-white border-[#005fd8] grow py-6 rounded-lg">
          <svg
            aria-label="Facebook logo"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
          >
            <path
              fill="white"
              d="M8 12h5V8c0-6 4-7 11-6v5c-4 0-5 0-5 3v2h5l-1 6h-4v12h-6V18H8z"
            ></path>
          </svg>
        </button>
      </div>
      <div className="divider">OR</div>
      {/* email & pass login */}
      {!login && (
        <>
          <label className="label text-base">Full Name</label>
          <label className="input input-lg w-full validator">
            <LuUser className="size-4 opacity-50" />
            <input
              type="text"
              required
              placeholder="Name"
              pattern="[A-Za-z][A-Za-z]*"
              minLength="3"
              maxLength="30"
              title="Only letters"
            />
          </label>
          <p className="validator-hint hidden">
            Must be 3 to 30 characters
            <br />
            containing only letters
          </p>
        </>
      )}
      <label className="label text-base">Email</label>
      <label className="input input-lg w-full validator">
        <LuMail className="size-4 opacity-50" />
        <input type="email" placeholder="mail@site.com" required />
      </label>
      <div className="validator-hint hidden">Enter valid email address</div>

      <label className="label text-base">Password</label>
      <label className="input input-lg w-full validator">
        <LuKey className="opacity-50 size-4" />
        <input
          type="password"
          required
          placeholder="Password"
          minLength="8"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
        />
      </label>
      <p className="validator-hint hidden">
        Must be more than 8 characters, including
        <br />
        At least one number <br />
        At least one lowercase letter <br />
        At least one uppercase letter
      </p>
      {login && (
        <Link href="#" className="text-base text-purple-500">
          Forogot Password?
        </Link>
      )}

      <button className="btn btn-primary btn-lg rounded-md bg-main hover:bg-main-dark hover:border-main-dark border-main mt-4 shadow-none">
        Login
      </button>
      <p className="text-lg text-center">
        {login ? "Don't Have an Account?" : "Already Have an Account?"}{" "}
        <Link
          href={login ? "/register" : "/login"}
          className="link text-purple-500"
        >
          {login ? "Register Now" : "Login Now"}
        </Link>
      </p>
    </form>
  );
};

export default UserForm;
