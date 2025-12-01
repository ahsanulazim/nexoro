const PricingCard = ({ title, price, benefits }) => {
  return (
    <div className="card bg-base-300 shadow-sm">
      <div className="card-body">
        <span className="badge badge-xs badge-warning hidden">Most Popular</span>
        <div className="flex justify-between flex-col lg:flex-row">
          <h2 className="text-xl lg:text-2xl xl:text-3xl">{title}</h2>
          <span className="font-semibold text-3xl lg:text-xl">${price}</span>
        </div>
        <div className="mt-4 xl:mt-6">
          <button className="btn btn-block btn-primary rounded-full border-none bg-linear-to-r from-main via-main-light to-main bg-[length:200%_200%] animate-gradient">Choose Plan</button>
        </div>
        <ul className="mt-6 flex flex-col gap-2 text-xs grow">
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
      </div>
    </div>
  );
};

export default PricingCard;
