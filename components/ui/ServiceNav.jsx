import Link from "next/link";

const ServiceNav = ({ services, activeId }) => {
  return (
    <ul className="menu shrink-0 rounded-box hidden lg:flex sticky top-30">
      <li>
        <ul>
          {services.map((step) => (
            <li
              key={step.title}
              className={
                activeId === step.title ? "font-semibold text-main-light" : ""
              }
            >
              <Link href="#">{step.title}</Link>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
};

export default ServiceNav;
