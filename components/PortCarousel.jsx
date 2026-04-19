import moment from "moment";
import Image from "next/image";

const PortCarousel = ({ port }) => {
  return (
    <div className="relative">
      <Image
        src={port.image}
        alt={port.title}
        width={700}
        height={700}
        className="w-full m-auto rounded-xl"
      />
      <div className=" sm:absolute w-full sm:bottom-0 sm:p-6 text-gray-900 mt-5">
        <div className="bg-white rounded-lg p-5 gap-5 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between sm:shadow-lg">
          <h2 className="text-3xl font-bold">{port.title}</h2>
          <div className="flex max-xs:flex-col xs:items-center gap-3 xs:gap-10">
            <div>
              <h3 className="opacity-50">Published Date</h3>
              <p className="font-semibold">
                {moment(port.added).format("MMMM YYYY")}
              </p>
            </div>
            <div>
              <h3 className="opacity-50">Services</h3>
              <p className="font-semibold">{port.service.title}</p>
            </div>
            {port.subService && (
              <div>
                <h3 className="opacity-50">Category</h3>
                <p className="font-semibold">{port.subService.subService}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortCarousel;
