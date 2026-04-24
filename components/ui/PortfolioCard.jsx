import { LuFolder, LuShoppingBasket } from "react-icons/lu";
import Link from "next/link";
import Image from "next/image";

const PortfolioCard = ({ service }) => {
  return (
    <div className="serviceCard card bg-base-100 rounded-xl">
      <Link href={`/${service.slug}`} className="p-5 pb-0">
        <Image
          width={500}
          height={500}
          className="object-contain rounded-lg w-full"
          src={
            service.coverImage
              ? service.coverImage
              : "/assets/No_Image_Available.jpg"
          }
          alt={service.title}
        />
      </Link>
      <div className="card-body">
        <Link href={`/${service.slug}`}>
          <h2 className="card-title max-xs:text-sm">{service.title}</h2>
        </Link>
        <div className="card-actions">
          <Link href={service.slug}>
            <button className="btn max-xs:btn-sm rounded-full btn-primary btn-nexoro-primary">
              <LuShoppingBasket /> Get Now
            </button>
          </Link>
          <Link href={`/portfolio?category=${service._id}`}>
            <button
              className="btn max-xs:btn-sm rounded-full"
              data-theme="light"
            >
              <LuFolder /> Portfolio
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
