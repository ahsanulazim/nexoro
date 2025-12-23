import { fetchSliders } from "@/api/fetchSliders";
import { useQuery } from "@tanstack/react-query";

const AddedSliders = ({ data }) => {
  const { data: sliderData, isLoading } = useQuery({
    queryKey: ["sliderData"],
    queryFn: fetchSliders,
  });

  const sliders = data?.filter((d) =>
    sliderData?.some((s) => s.logo === d.logo)
  );
  console.log(sliders);

  return (
    <section>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sliderData?.map((slider) => (
            <div key={slider._id} className="border rounded-lg p-4">
              <img
                src={slider.logo}
                alt={slider.client}
                className="w-full h-32 object-contain"
              />
              <p className="mt-2">{slider.client}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AddedSliders;
