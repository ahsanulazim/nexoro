"use client";

import { useEffect, useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMemberPermissions } from "@/api/fetchUsers";
import {
  PERMISSION_MODULES,
  ALL_PERMISSION_IDS,
  DEFAULT_MEMBER_PERMISSIONS,
  PERMISSION_PRESETS,
} from "@/utils/permissions";
import {
  LuShieldCheck,
  LuX,
  LuCheck,
  LuSparkles,
  LuLayers,
  LuInfo,
} from "react-icons/lu";
import { toast } from "react-toastify";

export default function PermissionsModal({
  member,
  isOpen,
  onClose,
  currentLoggedInEmail,
}) {
  const queryClient = useQueryClient();
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Initialize permissions when member changes
  useEffect(() => {
    if (member) {
      if (Array.isArray(member.permissions)) {
        setSelectedPermissions(member.permissions);
      } else {
        setSelectedPermissions(DEFAULT_MEMBER_PERMISSIONS);
      }
    }
  }, [member]);

  // Group modules by category
  const categories = useMemo(() => {
    const groups = {};
    PERMISSION_MODULES.forEach((mod) => {
      if (!groups[mod.category]) {
        groups[mod.category] = [];
      }
      groups[mod.category].push(mod);
    });
    return groups;
  }, []);

  // Mutation to save permissions
  const { mutate: handleSave, isPending } = useMutation({
    mutationFn: () =>
      updateMemberPermissions(member.email, selectedPermissions),
    onSuccess: () => {
      toast.success(`Permissions updated for ${member.name || member.email}`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      onClose();
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || err.message || "Failed to save permissions"
      );
    },
  });

  if (!isOpen || !member) return null;

  const togglePermission = (id) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const applyPreset = (presetPermissions) => {
    setSelectedPermissions(presetPermissions);
  };

  const toggleCategory = (categoryMods) => {
    const catIds = categoryMods.map((m) => m.id);
    const allSelected = catIds.every((id) => selectedPermissions.includes(id));
    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !catIds.includes(id))
      );
    } else {
      setSelectedPermissions((prev) => [
        ...prev,
        ...catIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const totalCount = ALL_PERMISSION_IDS.length;
  const selectedCount = selectedPermissions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-base-100 border border-base-200/80 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-base-200 flex items-center justify-between shrink-0 bg-base-200/40">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
              <LuShieldCheck className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg text-base-content flex items-center gap-2">
                Manage Access & Permissions
              </h3>
              <p className="text-xs text-base-content/60">
                Grant route and module access to{" "}
                <span className="font-medium text-base-content">
                  {member.name || "Member"}
                </span>{" "}
                ({member.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-base-content/60 hover:text-base-content"
          >
            <LuX className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4 overflow-y-auto grow space-y-5">
          {/* Presets Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60 flex items-center gap-1.5">
                <LuSparkles className="size-3.5 text-warning" /> Quick Presets
              </span>
              <span className="text-xs text-base-content/50">
                Click a preset to quickly apply permissions
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset(ALL_PERMISSION_IDS)}
                className={`btn btn-xs rounded-lg ${
                  selectedCount === totalCount
                    ? "btn-primary"
                    : "btn-outline btn-neutral"
                }`}
              >
                Select All ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => applyPreset([])}
                className="btn btn-xs btn-outline btn-error rounded-lg"
              >
                Clear All
              </button>
              {PERMISSION_PRESETS.map((preset) => {
                const isSelected =
                  preset.permissions.length === selectedPermissions.length &&
                  preset.permissions.every((p) =>
                    selectedPermissions.includes(p)
                  );
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset.permissions)}
                    className={`btn btn-xs rounded-lg ${
                      isSelected ? "btn-primary" : "btn-soft"
                    }`}
                    title={preset.description}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Module Categories */}
          <div className="space-y-4">
            {Object.entries(categories).map(([categoryName, modules]) => {
              const catIds = modules.map((m) => m.id);
              const selectedInCat = catIds.filter((id) =>
                selectedPermissions.includes(id)
              ).length;
              const allCatSelected = selectedInCat === catIds.length;

              return (
                <div
                  key={categoryName}
                  className="rounded-xl border border-base-200 bg-base-200/20 p-3 sm:p-4"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-base-200/60">
                    <div className="flex items-center gap-2">
                      <LuLayers className="size-4 text-primary" />
                      <h4 className="font-semibold text-sm text-base-content">
                        {categoryName}
                      </h4>
                      <span className="badge badge-xs badge-neutral">
                        {selectedInCat} / {catIds.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleCategory(modules)}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      {allCatSelected ? "Deselect Category" : "Select Category"}
                    </button>
                  </div>

                  {/* Modules Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {modules.map((mod) => {
                      const isChecked = selectedPermissions.includes(mod.id);
                      return (
                        <label
                          key={mod.id}
                          className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                            isChecked
                              ? "bg-primary/5 border-primary/40 shadow-xs"
                              : "bg-base-100 border-base-200 hover:border-base-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(mod.id)}
                            className="checkbox checkbox-primary checkbox-sm mt-0.5 rounded-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-medium text-xs sm:text-sm text-base-content">
                                {mod.label}
                              </span>
                              <span className="text-[10px] text-base-content/40 font-mono">
                                {mod.route}
                              </span>
                            </div>
                            <p className="text-[11px] text-base-content/60 leading-tight mt-0.5 line-clamp-1">
                              {mod.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-info/10 text-info text-xs">
            <LuInfo className="size-4 shrink-0" />
            <span>
              Unselected routes will be hidden from the member’s sidebar and
              direct URL navigation will be blocked.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-base-200 flex items-center justify-between shrink-0 bg-base-200/40">
          <div className="text-xs text-base-content/70">
            Selected:{" "}
            <span className="font-semibold text-primary">
              {selectedCount} of {totalCount}
            </span>{" "}
            modules
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="btn btn-sm btn-ghost"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isPending}
              className="btn btn-sm btn-primary"
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Saving...
                </>
              ) : (
                <>
                  <LuCheck className="size-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
