import { useState } from "react";
import { LuCheck, LuSquarePen } from "react-icons/lu";
import PriceForm from "./PriceForm";

const PriceCard = ({ plan, slug }) => {

  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <PriceForm
        title={plan.planName}
        slug={slug}
        initialData={plan}
        onCancel={() => setIsEditing(false)}
      />
    );
  }


  return (
    <div className="card bg-base-300 shadow-sm">
      <div className="card-body">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">{plan.planName}</h2>
          <div className="flex items-center gap-5">
            <span className="text-xl">${plan.price}</span>
            <button className="btn btn-square btn-info btn-sm btn-soft" onClick={() => setIsEditing(true)}><LuSquarePen /></button>
          </div>
        </div>
        <ul className="mt-6 flex flex-col gap-2 text-xs">
          {plan.benefits.map((benefit) => (
            <li key={benefit.value}>
              <LuCheck className="size-4 me-2 inline-block text-success" />
              <span>{benefit.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PriceCard;
