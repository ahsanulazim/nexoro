import { BarLoader } from "react-spinners";

const loading = () => {
  return (
    <main className="min-h-dvh flex items-center justify-center">
      <BarLoader />
    </main>
  );
};

export default loading;
