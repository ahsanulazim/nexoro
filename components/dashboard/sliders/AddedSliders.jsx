import { removeClientSliders } from "@/api/fetchSliders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuTrash2 } from "react-icons/lu";
import { toast } from "react-toastify";

const AddedSliders = ({ data }) => {

  const sliders = data?.filter((slider) => slider.slider === true);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: removeClientSliders,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientData"] });
      toast.success("Slider removed successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });


  return (
    <section className="mt-5">
      {sliders?.length === 0 ?
        <div className="text-center py-10">
          <p className="text-gray-500">No sliders selected yet</p>
        </div>
        :
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {sliders?.map((s) => (
            <div key={s._id} className="flex flex-col bg-base-300 shadow-xl rounded-lg p-4">
              <img
                src={s.logo}
                alt={s.client}
                className="w-full object-contain grow"
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="max-xs:text-sm">{s.client}</p>
                <button className="btn btn-error btn-xs btn-soft btn-square" onClick={() => mutation.mutate(s._id)}><LuTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      }
    </section>
  );
};

export default AddedSliders;
