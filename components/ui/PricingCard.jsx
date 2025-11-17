const PricingCard = ({ title, price, benefits }) => {
  return (
    <div className="card bg-base-300 shadow-sm">
      <div className="card-body">
        <span className="badge badge-xs badge-warning">Most Popular</span>
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">{title}</h2>
          <span className="text-xl">${price}</span>
        </div>
        <ul className="mt-6 flex flex-col gap-2 text-xs">
          {benefits.map((benefit) => (
            <li key={benefit}>
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
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <button className="btn btn-primary btn-block">Choose Plan</button>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
