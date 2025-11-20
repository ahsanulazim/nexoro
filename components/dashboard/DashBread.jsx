import Link from "next/link";
import { LuLayoutDashboard } from "react-icons/lu";

const DashBread = ({ title }) => {
  return (
    <div className="breadcrumbs text-sm">
      <ul>
        <li>
          <Link href="/dashboard">
            <LuLayoutDashboard />
          </Link>
        </li>
        <li>{title}</li>
      </ul>
    </div>
  );
};

export default DashBread;
