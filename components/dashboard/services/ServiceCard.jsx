import { LuCalendar } from "react-icons/lu";
import ServiceDrop from "./ServiceDrop";

const ServiceCard = ({ service, setSelectedService, setIsEditing, serviceFormModal }) => {
  return (
    <div className="card max-lg:card-sm bg-base-300 shadow-sm">
      <div className="card-body">
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <div className="shrink-0 bg-white rounded-box size-12 p-3">
              <img
                className="contain"
                src={service.icon}
                alt={service.title}
              />
            </div>
            <div>
              <h2 className="card-title line-clamp-2">{service.title}</h2>
            </div>
          </div>
          <ServiceDrop service={service} onEdit={(service) => {
            setIsEditing(true);
            setSelectedService(service);
            serviceFormModal.current.showModal();
          }} />
        </div>

        <div>
          <h3 className="font-semibold">Short Description:</h3>
          <p className="line-clamp-1 opacity-50">{service.shortDes}</p>
          <h3 className="font-semibold">Long Description:</h3>
          <p className="line-clamp-2 opacity-50">{service.longDes}</p>
        </div>
        <h4 className="opacity-50 flex gap-2 items-center justify-start">
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
