const ServiceNav = ({ services, activeId }) => {
  return (
    <div className="steps steps-vertical shrink-0 sticky top-30 hidden lg:inline-grid">
      {services.map((step) => (
        <nav
          className={`step ${activeId === step.title ? "step-info" : ""}`}
          key={step.title}
        >
          {step.title}
        </nav>
      ))}
    </div>
  );
};

export default ServiceNav;
