"use client";

import { useState, useMemo, forwardRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/axios/axiosInstance";
import { auth } from "@/firebase/firebase.config";
import { toast } from "react-toastify";
import {
  LuCheck,
  LuFolder,
  LuPencil,
  LuPlus,
  LuSearch,
  LuTrash2,
  LuX,
  LuZap,
} from "react-icons/lu";

const CannedResponsesModal = forwardRef(({ onSelectResponse }, ref) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    shortcut: "",
    title: "",
    text: "",
    category: "General",
  });

  const queryClient = useQueryClient();

  const { data: responses = [], isLoading } = useQuery({
    queryKey: ["cannedResponses"],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get("/conversations/cannedResponses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.success ? res.data.data : [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.post("/conversations/cannedResponses", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cannedResponses"]);
      setIsAddingNew(false);
      setFormData({ shortcut: "", title: "", text: "", category: "General" });
      toast.success("Quick reply saved!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to save response");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.put(`/conversations/cannedResponses/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cannedResponses"]);
      setEditingItem(null);
      setFormData({ shortcut: "", title: "", text: "", category: "General" });
      toast.success("Quick reply updated!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update response");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.delete(`/conversations/cannedResponses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cannedResponses"]);
      if (editingItem) {
        setEditingItem(null);
        setFormData({ shortcut: "", title: "", text: "", category: "General" });
      }
      toast.success("Quick reply deleted!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete response");
    },
  });

  const categories = useMemo(() => {
    const set = new Set(["All"]);
    responses.forEach((r) => {
      if (r.category) set.add(r.category);
    });
    return Array.from(set);
  }, [responses]);

  const filteredResponses = useMemo(() => {
    return responses.filter((r) => {
      const matchCat =
        selectedCategory === "All" || r.category === selectedCategory;
      const term = searchTerm.toLowerCase();
      const matchSearch =
        !term ||
        r.shortcut?.toLowerCase().includes(term) ||
        r.title?.toLowerCase().includes(term) ||
        r.text?.toLowerCase().includes(term);
      return matchCat && matchSearch;
    });
  }, [responses, selectedCategory, searchTerm]);

  const handleSelect = (text) => {
    onSelectResponse(text);
    ref.current?.close();
  };

  const handleToggleAdd = () => {
    if (isAddingNew) {
      setIsAddingNew(false);
      setFormData({ shortcut: "", title: "", text: "", category: "General" });
    } else {
      setEditingItem(null);
      setIsAddingNew(true);
      setFormData({ shortcut: "", title: "", text: "", category: "General" });
    }
  };

  const handleStartEdit = (e, item) => {
    e.stopPropagation();
    setIsAddingNew(false);
    setEditingItem(item);
    setFormData({
      shortcut: item.shortcut || "",
      title: item.title || "",
      text: item.text || "",
      category: item.category || "General",
    });
  };

  const handleDelete = (e, item) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete "${item.title || item.shortcut}"?`
      )
    ) {
      deleteMutation.mutate(item._id);
    }
  };

  const handleCancelForm = () => {
    setIsAddingNew(false);
    setEditingItem(null);
    setFormData({ shortcut: "", title: "", text: "", category: "General" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.shortcut.trim() || !formData.text.trim()) return;

    const payload = {
      shortcut: formData.shortcut.trim(),
      title: formData.title.trim() || formData.shortcut.trim(),
      text: formData.text.trim(),
      category: formData.category || "General",
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem._id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isFormOpen = isAddingNew || !!editingItem;

  return (
    <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-2xl bg-base-100 p-0 overflow-hidden border border-base-300 shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-base-200/80 border-b border-base-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <LuZap className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Quick Canned Replies</h3>
              <p className="text-xs text-base-content/60">
                Insert, manage, and edit predefined answers or shortcuts
              </p>
            </div>
          </div>
          <button
            onClick={() => ref.current?.close()}
            className="btn btn-circle btn-ghost btn-sm"
          >
            <LuX className="size-4" />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="p-3 bg-base-200/30 border-b border-base-300 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 size-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates or type shortcut like /pricing..."
                className="input input-sm input-bordered w-full pl-9 rounded-xl bg-base-100 focus:outline-none text-xs"
              />
            </div>
            <button
              onClick={handleToggleAdd}
              className={`btn btn-sm rounded-xl gap-1 text-xs ${
                isAddingNew ? "btn-neutral" : "btn-primary"
              }`}
            >
              <LuPlus className={isAddingNew ? "rotate-45 transition-transform" : ""} />
              {isAddingNew ? "Cancel" : "New Reply"}
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-medium transition-all shrink-0 ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-content shadow-xs"
                    : "bg-base-200 hover:bg-base-300 text-base-content/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Create / Edit Form Collapsible */}
        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className={`p-4 border-b space-y-3 transition-colors ${
              editingItem
                ? "bg-amber-500/5 border-amber-500/20"
                : "bg-primary/5 border-primary/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {editingItem ? (
                  <>
                    <div className="p-1 rounded-md bg-amber-500/10 text-amber-500">
                      <LuPencil className="size-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-base-content">
                      Edit Quick Reply:{" "}
                      <span className="font-mono text-amber-600 dark:text-amber-400">
                        {editingItem.shortcut}
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <div className="p-1 rounded-md bg-primary/10 text-primary">
                      <LuPlus className="size-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-base-content">
                      Create New Quick Reply
                    </span>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={handleCancelForm}
                className="btn btn-ghost btn-xs text-base-content/60"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={formData.shortcut}
                onChange={(e) =>
                  setFormData({ ...formData, shortcut: e.target.value })
                }
                placeholder="Shortcut (e.g. /custom)"
                required
                className="input input-sm input-bordered rounded-lg bg-base-100 text-xs"
              />
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Title (e.g. Custom Offer)"
                required
                className="input input-sm input-bordered rounded-lg bg-base-100 text-xs"
              />
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="select select-sm select-bordered rounded-lg bg-base-100 text-xs"
              >
                <option value="General">General</option>
                <option value="Services">Services</option>
                <option value="Sales">Sales</option>
                <option value="Support">Support</option>
                <option value="Billing">Billing</option>
                <option value="Meeting">Meeting</option>
              </select>
            </div>
            <textarea
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              placeholder="Message body that will be sent..."
              required
              rows={3}
              className="textarea textarea-bordered textarea-sm w-full rounded-lg bg-base-100 text-xs"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelForm}
                className="btn btn-ghost btn-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className={`btn btn-xs ${
                  editingItem ? "btn-warning" : "btn-primary"
                }`}
              >
                {editingItem
                  ? updateMutation.isPending
                    ? "Updating..."
                    : "Update Reply"
                  : createMutation.isPending
                  ? "Saving..."
                  : "Save Template"}
              </button>
            </div>
          </form>
        )}

        {/* Responses Grid / List */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-2">
          {isLoading ? (
            <div className="py-8 text-center text-xs opacity-50">
              Loading quick replies...
            </div>
          ) : filteredResponses.length === 0 ? (
            <div className="py-8 text-center text-base-content/40 text-xs">
              No matching canned responses found
            </div>
          ) : (
            filteredResponses.map((item, idx) => {
              const isItemEditing = editingItem?._id === item._id;
              return (
                <div
                  key={item._id || `${item.shortcut}-${idx}`}
                  onClick={() => handleSelect(item.text)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group space-y-1.5 ${
                    isItemEditing
                      ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30"
                      : "bg-base-200/50 hover:bg-base-200 border-base-300 hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono font-bold text-xs text-primary px-2 py-0.5 rounded-md bg-primary/10 shrink-0">
                        {item.shortcut}
                      </span>
                      <span className="font-semibold text-xs text-base-content truncate">
                        {item.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="badge badge-xs badge-neutral opacity-70">
                        {item.category || "General"}
                      </span>

                      {/* Action Buttons: Edit & Delete */}
                      <div className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => handleStartEdit(e, item)}
                          className={`p-1 rounded-md transition-colors ${
                            isItemEditing
                              ? "bg-amber-500 text-white"
                              : "hover:bg-base-300 text-base-content/70 hover:text-amber-500"
                          }`}
                          title="Edit quick reply"
                        >
                          <LuPencil className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, item)}
                          disabled={deleteMutation.isPending}
                          className="p-1 rounded-md hover:bg-base-300 text-base-content/70 hover:text-error transition-colors"
                          title="Delete quick reply"
                        >
                          <LuTrash2 className="size-3.5" />
                        </button>
                      </div>

                      <span className="text-[11px] font-medium text-primary hidden sm:inline-block opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                        Click to insert ↵
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-base-content/80 line-clamp-2 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer tip */}
        <div className="p-2.5 bg-base-200/60 border-t border-base-300 text-center text-[11px] text-base-content/50">
          💡 Tip: Click the pencil icon <LuPencil className="inline size-3 text-amber-500 mx-0.5" /> to edit any reply, or type <span className="font-mono font-bold text-primary">/</span> in chat for instant suggestions!
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

CannedResponsesModal.displayName = "CannedResponsesModal";

export default CannedResponsesModal;