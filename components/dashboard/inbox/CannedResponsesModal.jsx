"use client";

import { useState, useMemo, forwardRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/axios/axiosInstance";
import { auth } from "@/firebase/firebase.config";
import { toast } from "react-toastify";
import {
  LuCheck,
  LuFolder,
  LuPlus,
  LuSearch,
  LuSparkles,
  LuX,
  LuZap,
} from "react-icons/lu";

const CannedResponsesModal = forwardRef(({ onSelectResponse }, ref) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newShortcut, setNewShortcut] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [newCategory, setNewCategory] = useState("General");
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
      setNewShortcut("");
      setNewTitle("");
      setNewText("");
      toast.success("Quick reply saved!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to save response");
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

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newShortcut.trim() || !newText.trim()) return;
    createMutation.mutate({
      shortcut: newShortcut.trim(),
      title: newTitle.trim() || newShortcut.trim(),
      text: newText.trim(),
      category: newCategory,
    });
  };

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
                Insert predefined answers or shortcuts instantly
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
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="btn btn-sm btn-primary rounded-xl gap-1 text-xs"
            >
              <LuPlus /> {isAddingNew ? "Cancel" : "New Reply"}
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

        {/* New Response Form Collapsible */}
        {isAddingNew && (
          <form
            onSubmit={handleCreate}
            className="p-4 bg-primary/5 border-b border-primary/20 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newShortcut}
                onChange={(e) => setNewShortcut(e.target.value)}
                placeholder="Shortcut (e.g. /custom)"
                required
                className="input input-sm input-bordered rounded-lg bg-base-100 text-xs"
              />
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title (e.g. Custom Offer)"
                required
                className="input input-sm input-bordered rounded-lg bg-base-100 text-xs"
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="select select-sm select-bordered rounded-lg bg-base-100 text-xs"
              >
                <option value="General">General</option>
                <option value="Services">Services</option>
                <option value="Sales">Sales</option>
                <option value="Support">Support</option>
                <option value="Billing">Billing</option>
              </select>
            </div>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Message body that will be sent..."
              required
              rows={2}
              className="textarea textarea-bordered textarea-sm w-full rounded-lg bg-base-100 text-xs"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="btn btn-ghost btn-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="btn btn-primary btn-xs"
              >
                {createMutation.isPending ? "Saving..." : "Save Template"}
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
            filteredResponses.map((item) => (
              <div
                key={item._id}
                onClick={() => handleSelect(item.text)}
                className="p-3 rounded-xl bg-base-200/50 hover:bg-base-200 border border-base-300 hover:border-primary/40 transition-all cursor-pointer group space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-primary px-2 py-0.5 rounded-md bg-primary/10">
                      {item.shortcut}
                    </span>
                    <span className="font-semibold text-xs text-base-content">
                      {item.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-xs badge-neutral opacity-70">
                      {item.category || "General"}
                    </span>
                    <span className="text-[11px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to insert ↵
                    </span>
                  </div>
                </div>
                <p className="text-xs text-base-content/80 line-clamp-2 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer tip */}
        <div className="p-2.5 bg-base-200/60 border-t border-base-300 text-center text-[11px] text-base-content/50">
          💡 Tip: Type <span className="font-mono font-bold text-primary">/</span> directly in the chat box to trigger quick suggestions!
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
