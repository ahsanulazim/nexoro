import Link from "next/link";
import UserForm from "./UserForm";

const AuthPage = ({ login }) => {
  return (
    <main>
      <div className="p-5 sm:p-10">
        <Link href="/">
          <img
            className="w-full max-w-36"
            src="/assets/nexoro_logo.png"
            alt="Nexoro Logo"
          />
        </Link>
      </div>
      <div className="p-5 pt-0 md:pb-5">
        <UserForm login={login} />
      </div>
    </main>
  );
};

export default AuthPage;
