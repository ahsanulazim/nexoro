const PriceCard = ({ plan }) => {
  return (
    <div className="card bg-base-300 shadow-sm">
      <div className="card-body">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">{plan.planName}</h2>
          <span className="text-xl">${plan.price}</span>
        </div>
        <ul className="mt-6 flex flex-col gap-2 text-xs">
          {plan.benefits.map((benefit) => (
            <li key={benefit.value}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 me-2 inline-block text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{benefit.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PriceCard;
