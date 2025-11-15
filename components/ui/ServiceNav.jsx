import Link from "next/link";

const ServiceNav = ({ services, activeId }) => {
  return (
    // <div className="steps steps-vertical shrink-0 sticky top-30 hidden lg:inline-grid">
    //   {services.map((step) => (
    //     <nav
    //       className={`step after:content-none${
    //         activeId === step.title ? "step-primary after:bg-main" : ""
    //       }`}
    //       key={step.title}
    //     >
    //       {step.title}
    //     </nav>
    //   ))}
    // </div>
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
