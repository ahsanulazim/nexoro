import UserForm from "@/components/auth/UserForm";

const page = () => {
  return (
    <main>
      <div className="p-10">
        <img
          className="w-full max-w-36"
          src="/assets/nexoro_logo.png"
          alt="Nexoro Logo"
        />
      </div>
      <div>
        <UserForm />
      </div>
    </main>
  );
};

export default page;
