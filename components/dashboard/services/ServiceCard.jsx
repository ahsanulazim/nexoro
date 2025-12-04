import { LuCalendar } from "react-icons/lu";
import ServiceDrop from "./ServiceDrop";

const ServiceCard = ({ service }) => {
  console.log(service);

  return (
    <div className="card max-lg:card-sm bg-base-300 shadow-sm">
      <div className="card-body">
        <div className="flex items-center justify-between gap-5">
          <h4 className="opacity-50 flex gap-2 items-center">
            <LuCalendar />2 Dec, 2025
          </h4>
          <ServiceDrop link={service.link} />
        </div>
        <h2 className="card-title">{service.title}</h2>
        <div>
          <h3 className="font-semibold">Short Description:</h3>
          <p className="line-clamp-1 opacity-50">{service.shortDes}</p>
          <h3 className="font-semibold">Long Description:</h3>
          <p className="line-clamp-2 opacity-50">{service.longDes}</p>
        </div>
        <h4 className="opacity-50 flex gap-2 items-center justify-end">
          <LuCalendar />
          {new Date(service.added).toLocaleString("en-BD", {
            timeZone: "Asia/Dhaka",
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </h4>
      </div>
    </div>
  );
};

export default ServiceCard;
