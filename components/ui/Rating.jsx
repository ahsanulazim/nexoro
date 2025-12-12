import { FaRegStar, FaStar, FaStarHalfStroke } from "react-icons/fa6";

const Rating = ({ rating }) => {

  return (
    <div className="flex text-warning">
      {Array.from({ length: 5 }, (_, i) => (
        rating >= i + 1 ? <FaStar key={i} /> : rating >= i + 0.5 ? <FaStarHalfStroke key={i} /> : <FaRegStar key={i} />
      ))}
    </div>
  );
};

export default Rating;
