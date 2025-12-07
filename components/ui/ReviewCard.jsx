import Rating from "./Rating";

const ReviewCard = ({ className }) => {
  return (
    <div className={`card ${className} max-xs:w-2xs w-sm mr-4`}>
      <div className="card-body">
        <p>
          This is a very versatile WordPress theme. Many features combined with
          Elementor and solid support.
        </p>
        <div className="card-actions max-xs:flex-col-reverse xs:items-center gap-5 justify-between mt-5">
          <div className="card-title text-sm">
            <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content w-10 rounded-full">
                <span className="text-xs">CN</span>
              </div>
            </div>{" "}
            <div>
              <h2>Customer Name</h2>
              <p className="text-xs opacity-50">Brand</p>
            </div>
          </div>
          <Rating />
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
