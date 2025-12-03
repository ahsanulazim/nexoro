import { IoArrowForwardCircle } from "react-icons/io5";

const PortfolioCard = ({ project }) => {
  return (
    <div className="card bg-base-100 rounded-xl">
      <figure className="p-5 pb-0">
        <img
          className="object-contain rounded-lg w-full"
          src={project.image}
          alt={project.title}
        />
      </figure>
      <div className="card-body flex-row items-center justify-between gap-3">
        <h2 className="card-title max-xs:text-sm">{project.title}</h2>
        <div className="card-actions justify-end hidden">
          <button className="btn btn-nexoro">
            See More <IoArrowForwardCircle className="size-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
