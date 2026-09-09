import { MyContext } from "@/context/MyProvider";
import { useContext } from "react";
import { LuCheck, LuPlus, LuSquarePen, LuTrash2, LuX } from "react-icons/lu";
import { toast } from "react-toastify";

const ProjectModal = ({
  ref,
  modalAssignedTo,
  setModalAssignedTo,
  modalTasks,
  setModalTasks,
  isPending,
  updateTasks,
  order,
}) => {
  const { assignableUsers, assignableUsersLoading } = useContext(MyContext);
  const handleSaveModal = (e) => {
    e.preventDefault();
    const cleanedTasks = modalTasks
      .filter((t) => t.task && t.task.trim() !== "")
      .map((t) => ({
        task: t.task.trim(),
        isCompleted: Boolean(t.isCompleted),
      }));

    if (cleanedTasks.length === 0) {
      toast.error("Please provide at least one valid task");
      return;
    }

    updateTasks({
      orderId: order._id,
      assignedTo: modalAssignedTo,
      tasks: cleanedTasks,
    });
    toast.success("Tasks and assignment updated successfully");
  };
  // Modal task list helpers
  const handleModalTaskChange = (index, value) => {
    const updated = [...modalTasks];
    updated[index].task = value;
    setModalTasks(updated);
  };

  const handleModalRemoveRow = (index) => {
    if (modalTasks.length <= 1) return;
    setModalTasks(modalTasks.filter((_, i) => i !== index));
  };

  const handleModalAddRow = () => {
    setModalTasks([...modalTasks, { task: "", isCompleted: false }]);
  };

  return (
    <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-lg">
        <div className="flex items-center justify-between pb-3 border-b border-base-200">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <LuSquarePen className="text-primary" /> Manage Tasks & Member
          </h3>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <LuX />
          </button>
        </div>

        <form onSubmit={handleSaveModal} className="mt-4 space-y-4">
          {/* Assigned Member Selection */}
          <div>
            <label className="label text-xs font-semibold uppercase opacity-70">
              Assigned Team Member / Admin
            </label>
            <select
              className="select select-bordered w-full"
              value={modalAssignedTo}
              onChange={(e) => setModalAssignedTo(e.target.value)}
            >
              <option value="" disabled>
                Select Member or Admin
              </option>
              {assignableUsersLoading ? (
                <option value="">Loading users...</option>
              ) : (
                assignableUsers?.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name || member.email} ({member.role})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Tasks List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label text-xs font-semibold uppercase opacity-70 p-0">
                Tasks List
              </label>
              <button
                type="button"
                onClick={handleModalAddRow}
                className="btn btn-sm btn-primary"
              >
                <LuPlus /> Add Row
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {modalTasks.map((t, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(t.isCompleted)}
                    onChange={(e) => {
                      const updated = [...modalTasks];
                      updated[idx].isCompleted = e.target.checked;
                      setModalTasks(updated);
                    }}
                    className="checkbox checkbox-sm checkbox-success"
                    title="Completed?"
                  />
                  <input
                    type="text"
                    value={t.task}
                    onChange={(e) => handleModalTaskChange(idx, e.target.value)}
                    placeholder="Task description..."
                    className="input input-sm input-bordered w-full"
                  />
                  <button
                    type="button"
                    disabled={modalTasks.length <= 1}
                    onClick={() => handleModalRemoveRow(idx)}
                    className="btn btn-sm btn-square btn-error"
                  >
                    <LuTrash2 />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-action pt-3 border-t border-base-200">
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn btn-success"
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Saving...
                </>
              ) : (
                <>
                  <LuCheck /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ProjectModal;
