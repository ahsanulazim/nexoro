import { LuReceipt } from "react-icons/lu";
import OrderCostManagement from "../order/OrderCostManagement";

const ProjectCostModal = ({ ref, project }) => {
  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box max-w-xl p-5">
        <div className="flex justify-between items-center pb-3 border-b border-base-200 mb-4">
          <div>
            <h3 className="font-bold text-base flex items-center gap-1.5">
              <LuReceipt className="text-primary size-4" />
              {project.serviceName}
            </h3>
            <p className="text-xs opacity-60">
              Client: {project.client || "Customer"} • Price: ৳
              {project.servicePrice}
            </p>
          </div>
          <button
            type="button"
            onClick={() => ref.current.close()}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>
        <OrderCostManagement order={project} />
        <div className="modal-action mt-4 pt-2 border-t border-base-200">
          <button
            type="button"
            onClick={() => ref.current.close()}
            className="btn btn-sm btn-ghost"
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ProjectCostModal;
