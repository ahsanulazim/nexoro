import { IoArrowForwardCircle } from "react-icons/io5";
import { motion } from "motion/react";
import Link from "next/link";

const PortfolioCard = ({ project, variants }) => {
  return (
    <motion.div className="projectCard card bg-base-100 rounded-xl" variants={variants}>
      <Link href={`/${project.slug}`} className="p-5 pb-0">
        <img
          className="object-contain rounded-lg w-full"
          src={project.image}
          alt={project.title}
        />
      </Link>
      <div className="card-body flex-row items-center justify-between gap-3">
        <Link href={`/${project.slug}`}><h2 className="card-title max-xs:text-sm">{project.title}</h2></Link>
        <div className="card-actions justify-end hidden">
          <button className="btn btn-nexoro">
            See More <IoArrowForwardCircle className="size-8" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioCard;
