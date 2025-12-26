"use client";

import { FaMagnifyingGlass } from "react-icons/fa6";
import SliderSelected from "./SliderSelected";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { clientSliders } from "@/api/fetchSliders";

const SliderAddModal = ({ data }) => {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (data) {
      const alreadySelected = data
        .filter((d) => d.slider === true)
        .map((d) => d._id);
      setSelected(alreadySelected);
    }
  }, [data]);


  const handleSelect = (d) => {
    if (selected.includes(d)) {
      setSelected(selected.filter((s) => s !== d));

    } else {
      setSelected([...selected, d]);
    }
  };

  const sliderClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: clientSliders,
    onSuccess: () => {
      sliderClient.invalidateQueries({
        queryKey: ["clientData"],
      });
      document.getElementById("sliderModal").close();
      toast.success("Slider added successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAdd = () => {
    mutation.mutate(selected);
  };

  return (
    <dialog id="sliderModal" className="modal">
      <div className="modal-box">
        <label className="input w-full mb-4">
          <FaMagnifyingGlass className="opacity-50" />
          <input type="search" className="grow" placeholder="Search" />
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          {selected.map((s) => (
            <SliderSelected
              key={s}
              selected={s}
              handleSelect={handleSelect}
              data={data}
            />
          ))}
        </div>
        <ul className="menu w-full p-0">
          <li className="menu-title">Available Items</li>
          {data?.map((d) => (
            <li key={d._id}>
              <div onClick={() => handleSelect(d?._id)}>
                <img
                  src={d?.logo}
                  alt={d?.client}
                  className="size-10 object-contain"
                />
                <p>{d?.client}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-error">Close</button>
          </form>
          <button
            className={`btn btn-primary ${mutation.isPending ? "" : "btn-nexoro-primary"
              }`}
            onClick={handleAdd}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default SliderAddModal;
