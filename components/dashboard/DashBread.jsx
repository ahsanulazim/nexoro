import { LuLayoutDashboard } from "react-icons/lu";

const DashBread = ({ title }) => {
  return (
    <div className="breadcrumbs text-sm">
      <ul>
        <li>
          <LuLayoutDashboard />
        </li>
        <li>{title}</li>
      </ul>
    </div>
  );
};

export default DashBread;
