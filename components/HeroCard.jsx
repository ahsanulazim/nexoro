import Link from "next/link";
import { FaCircleArrowRight } from "react-icons/fa6";

const HeroCard = ({ service }) => {
  return (
    <div className="card border border-white/10 backdrop-blur-xl bg-main/10 rounded-2xl mx-3 max-w-sm min-h-80">
      <div className="card-body p-8">
        <figure className="p-4 bg-white rounded-2xl w-16 h-16 mb-3">
          <img src={service.icon} alt={service.title} className="w-8" />
        </figure>
        <h2 className="card-title text-2xl">{service.title}</h2>
        <p className="text-balance">{service.shortDes}</p>
        <div className="card-actions">
          <Link href={service.slug}>
            <button className="flex items-center gap-2 cursor-pointer font-semibold">
              Learn More <FaCircleArrowRight className="size-5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
