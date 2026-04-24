"use client";

import { deleteService, toggleFavourite } from "@/api/fetchServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { FaEllipsisVertical, FaStar, FaTrashCan } from "react-icons/fa6";
import { LuSquarePen } from "react-icons/lu";
import ServiceModal from "./ServiceModal";

const ServiceDrop = ({ service }) => {
  const serviceEdit = useRef();
  const { slug, public_id } = service;

  const queryClient = useQueryClient();

  const { mutate: removeService, isPending } = useMutation({
    mutationFn: ({ slug, public_id }) => deleteService(slug, public_id),
    onMutate: async ({ slug }) => {
      await queryClient.cancelQueries({ queryKey: ["services"] });
      const previousServices = queryClient.getQueryData(["services"]);
      queryClient.setQueryData(["services"], (oldServices) =>
        oldServices.filter((service) => service.slug !== slug),
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

  const { mutate: favourite, isPending: isTogglingFavourite } = useMutation({
    mutationFn: ({ slug }) => toggleFavourite(slug),
    onMutate: async ({ slug, isFavourite }) => {
      await queryClient.cancelQueries({ queryKey: ["services"] });
      const previousServices = queryClient.getQueryData(["services"]);
      queryClient.setQueryData(["services"], (oldServices) =>
        oldServices.map((service) =>
          service.slug === slug
            ? { ...service, favourite: isFavourite }
            : service,
        ),
      );
      return { previousServices };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["services"], context.previousServices);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  return (
    <>
      <ServiceModal ref={serviceEdit} service={service} />
      <div className="flex">
        <button
          type="button"
          className={`btn m-1 btn-soft btn-warning ${service.favourite ? "btn-active" : ""} btn-square btn-sm`}
          disabled={isTogglingFavourite}
          onClick={() => favourite({ slug })}
        >
          {isTogglingFavourite ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <FaStar />
          )}
        </button>
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
              <button onClick={() => serviceEdit.current.showModal()}>
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
      </div>
    </>
  );
};

export default ServiceDrop;
