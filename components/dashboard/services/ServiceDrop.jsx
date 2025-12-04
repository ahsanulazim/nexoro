"use client";

import { deleteService } from "@/api/fetchServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEllipsisVertical, FaTrashCan } from "react-icons/fa6";
import { LuSquarePen } from "react-icons/lu";

const ServiceDrop = ({ slug, public_id }) => {
  const queryClient = useQueryClient();

  const { mutate: removeService, isPending } = useMutation({
    mutationFn: ({ slug, public_id }) => deleteService(slug, public_id),
    onMutate: async ({ slug }) => {
      await queryClient.cancelQueries({ queryKey: ["services"] });
      const previousServices = queryClient.getQueryData(["services"]);
      queryClient.setQueryData(["services"], (oldServices) =>
        oldServices.filter((service) => service.slug !== slug)
      );
      return { previousServices };
    },
    onError: (err, slug, context) => {
      queryClient.setQueryData(["services"], context.previousServices);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  return (
    <div className="dropdown dropdown-end">
      <button
        tabIndex={0}
        role="button"
        className="btn m-1 btn-soft btn-primary btn-square btn-sm"
      >
        <FaEllipsisVertical />
      </button>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-md"
      >
        <li>
          <button>
            <LuSquarePen className="text-success" /> Edit
          </button>
        </li>
        <li>
          <button
            onClick={() => removeService({ slug, public_id })}
            disabled={isPending}
          >
            <FaTrashCan className="text-error" /> Delete
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ServiceDrop;
