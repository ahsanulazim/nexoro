"use client";

import { useState } from "react";
import {
  LuCalendar,
  LuX,
  LuCheck,
  LuRotateCcw,
  LuSlidersHorizontal,
  LuSparkles,
} from "react-icons/lu";

export const PRESET_OPTIONS = [
  { id: "this_month", label: "This Month" },
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "last_7_days", label: "Last 7 Days" },
  { id: "last_30_days", label: "Last 30 Days" },
  { id: "last_month", label: "Last Month" },
];

const toDateInputStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const getPresetDates = (presetId) => {
  const now = new Date();
  const todayStr = toDateInputStr(now);

  switch (presetId) {
    case "today":
      return {
        startDate: todayStr,
        endDate: todayStr,
        label: "Today",
        isCustom: true,
      };

    case "yesterday": {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yStr = toDateInputStr(y);
      return {
        startDate: yStr,
        endDate: yStr,
        label: "Yesterday",
        isCustom: true,
      };
    }

    case "last_7_days": {
      const s = new Date();
      s.setDate(s.getDate() - 6);
      return {
        startDate: toDateInputStr(s),
        endDate: todayStr,
        label: "Last 7 Days",
        isCustom: true,
      };
    }

    case "last_30_days": {
      const s = new Date();
      s.setDate(s.getDate() - 29);
      return {
        startDate: toDateInputStr(s),
        endDate: todayStr,
        label: "Last 30 Days",
        isCustom: true,
      };
    }

    case "last_month": {
      const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        startDate: toDateInputStr(prevMonthStart),
        endDate: toDateInputStr(prevMonthEnd),
        label: "Last Month",
        isCustom: true,
      };
    }

    case "this_month":
    default:
      return {
        startDate: null,
        endDate: null,
        label: "Current Month",
        isCustom: false,
      };
  }
};

const DateFilterBar = ({ activeFilter, onChangeFilter }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState("range"); // "single" | "range"

  const now = new Date();
  const defaultToday = toDateInputStr(now);

  const [customStart, setCustomStart] = useState(
    activeFilter.startDate || defaultToday
  );
  const [customEnd, setCustomEnd] = useState(
    activeFilter.endDate || defaultToday
  );
  const [singleDate, setSingleDate] = useState(
    activeFilter.startDate || defaultToday
  );

  const handleSelectPreset = (presetId) => {
    const dates = getPresetDates(presetId);
    onChangeFilter({
      presetId,
      ...dates,
    });
  };

  const handleApplyCustom = () => {
    if (pickerMode === "single") {
      onChangeFilter({
        presetId: "single_date",
        startDate: singleDate,
        endDate: singleDate,
        label: new Date(singleDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        isCustom: true,
      });
    } else {
      const start = customStart <= customEnd ? customStart : customEnd;
      const end = customStart <= customEnd ? customEnd : customStart;
      onChangeFilter({
        presetId: "custom_range",
        startDate: start,
        endDate: end,
        label: `${new Date(start).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${new Date(end).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`,
        isCustom: true,
      });
    }
    setIsModalOpen(false);
  };

  const handleResetToDefault = () => {
    handleSelectPreset("this_month");
  };

  const isCustomActive = activeFilter.isCustom;

  return (
    <div className="bg-base-100 border border-base-200 shadow-xs rounded-2xl p-3 sm:p-4 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Section Header & Status Indicator */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <LuCalendar className="text-lg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-base-content tracking-tight">
                Date Analytics Filter
              </span>
              {isCustomActive ? (
                <span className="badge badge-warning badge-sm font-medium gap-1 text-[11px] shadow-xs">
                  <LuSparkles className="size-3" /> Filtered
                </span>
              ) : (
                <span className="badge badge-success badge-soft badge-sm font-medium gap-1.5 text-[11px]">
                  <span className="size-1.5 rounded-full bg-success animate-pulse inline-block" />
                  Live Real-time
                </span>
              )}
            </div>
            <p className="text-xs text-base-content/60">
              Filter revenue, expenses, and stats by any date or custom range
            </p>
          </div>
        </div>

        {/* Right: Preset Buttons & Custom Picker Trigger */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="join bg-base-200/60 p-1 rounded-xl border border-base-content/5">
            {PRESET_OPTIONS.map((preset) => {
              const isSelected = activeFilter.presetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`join-item btn btn-xs sm:btn-sm border-0 transition-all font-medium ${
                    isSelected
                      ? "btn-primary shadow-xs font-semibold"
                      : "btn-ghost opacity-70 hover:opacity-100 hover:bg-base-100"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Custom Date Picker Modal Trigger */}
          <button
            onClick={() => setIsModalOpen(true)}
            className={`btn btn-xs sm:btn-sm gap-1.5 rounded-xl border ${
              activeFilter.presetId === "custom_range" ||
              activeFilter.presetId === "single_date"
                ? "btn-primary shadow-xs font-semibold"
                : "btn-outline border-base-content/20 hover:border-primary"
            }`}
          >
            <LuSlidersHorizontal className="text-xs" />
            <span>Custom Date</span>
          </button>
        </div>
      </div>

      {/* Active Filter Pill / Reset Bar (Only shown when filtered) */}
      {isCustomActive && (
        <div className="mt-3 pt-3 border-t border-base-200/70 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-base-content/60">Displaying data for:</span>
            <span className="badge badge-primary badge-soft font-semibold px-2.5 py-1">
              📅 {activeFilter.label || `${activeFilter.startDate} to ${activeFilter.endDate}`}
            </span>
          </div>

          <button
            onClick={handleResetToDefault}
            className="btn btn-xs btn-ghost gap-1 text-base-content/70 hover:text-error transition-colors"
          >
            <LuRotateCcw className="size-3" />
            <span>Reset to Current Month</span>
          </button>
        </div>
      )}

      {/* Custom Date Modal */}
      {isModalOpen && (
        <div className="modal modal-open modal-bottom sm:modal-middle z-50">
          <div className="modal-box p-6 max-w-md border border-base-200 shadow-2xl rounded-3xl">
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <div className="flex items-center gap-2">
                <LuCalendar className="text-primary text-xl" />
                <h3 className="font-bold text-base">Select Date or Date Range</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <LuX className="text-base" />
              </button>
            </div>

            {/* Mode Selector: Single Date vs Date Range */}
            <div className="tabs tabs-box bg-base-200 p-1 rounded-xl my-4 flex">
              <button
                type="button"
                onClick={() => setPickerMode("range")}
                className={`tab flex-1 text-xs font-semibold rounded-lg transition-all ${
                  pickerMode === "range" ? "tab-active bg-primary text-white" : ""
                }`}
              >
                Date Range (From - To)
              </button>
              <button
                type="button"
                onClick={() => setPickerMode("single")}
                className={`tab flex-1 text-xs font-semibold rounded-lg transition-all ${
                  pickerMode === "single" ? "tab-active bg-primary text-white" : ""
                }`}
              >
                Single Specific Date
              </button>
            </div>

            {/* Date Inputs */}
            {pickerMode === "single" ? (
              <div className="space-y-2 py-2">
                <label className="text-xs font-medium text-base-content/70">
                  Pick Specific Date
                </label>
                <input
                  type="date"
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="input input-bordered w-full text-sm font-medium"
                />
                <p className="text-[11px] text-base-content/50">
                  Select a single day to see all revenues, orders, and expenses that occurred on that day.
                </p>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-base-content/70">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="input input-bordered w-full text-xs sm:text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-base-content/70">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="input input-bordered w-full text-xs sm:text-sm font-medium"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-base-content/50">
                  Aggregate and compare financial health, chart analytics, and itemized orders across your chosen period.
                </p>
              </div>
            )}

            {/* Quick Helper Shortcuts inside Modal */}
            <div className="pt-3 border-t border-base-200 space-y-2">
              <span className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider">
                Quick Shortcuts
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Today", p: "today" },
                  { label: "Yesterday", p: "yesterday" },
                  { label: "Last 7 Days", p: "last_7_days" },
                  { label: "Last 30 Days", p: "last_30_days" },
                  { label: "This Month", p: "this_month" },
                  { label: "Last Month", p: "last_month" },
                ].map((sc) => (
                  <button
                    key={sc.p}
                    type="button"
                    onClick={() => {
                      const d = getPresetDates(sc.p);
                      if (d.startDate && d.endDate) {
                        setCustomStart(d.startDate);
                        setCustomEnd(d.endDate);
                        setSingleDate(d.startDate);
                      }
                    }}
                    className="btn btn-xs btn-soft hover:btn-primary"
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-action mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  handleResetToDefault();
                  setIsModalOpen(false);
                }}
                className="btn btn-sm btn-ghost text-error"
              >
                Reset
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-sm btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyCustom}
                  className="btn btn-sm btn-primary gap-1 shadow-md"
                >
                  <LuCheck />
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop bg-black/40 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default DateFilterBar;
