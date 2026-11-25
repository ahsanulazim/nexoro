"use client";

import {
  LuBuilding2,
  LuCalendar,
  LuChevronDown,
  LuCircleCheck,
  LuClock,
  LuCopy,
  LuEllipsisVertical,
  LuEye,
  LuMail,
  LuMessageSquare,
  LuPhone,
  LuPhoneCall,
  LuStar,
  LuTrash2,
} from "react-icons/lu";

export default function QueryCard({
  query,
  isSelected,
  onToggleSelect,
  onView,
  onUpdateStatus,
  onToggleStar,
  onDelete,
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "unread":
        return <span className="badge badge-warning badge-xs font-semibold">Unread</span>;
      case "contacted":
        return <span className="badge badge-info badge-xs font-semibold">Contacted</span>;
      case "resolved":
        return <span className="badge badge-success badge-xs font-semibold">Resolved</span>;
      default:
        return <span className="badge badge-neutral badge-xs font-semibold">Read</span>;
    }
  };

  const formattedDate = new Date(query.createdAt || query.added).toLocaleString("en-BD", {
    timeZone: "Asia/Dhaka",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div
      className={`group relative bg-base-100 rounded-3xl border transition-all duration-200 p-5 flex flex-col justify-between hover:shadow-md ${
        isSelected
          ? "border-primary ring-2 ring-primary/20 bg-primary/5"
          : query.status === "unread"
          ? "border-amber-500/30 bg-amber-500/5 shadow-2xs"
          : "border-base-300 hover:border-base-content/20 shadow-2xs"
      }`}
    >
      {/* Top row: Checkbox, Name, Status, Star, Actions */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(query._id)}
              className="checkbox checkbox-sm checkbox-primary rounded-md"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4
                  onClick={() => onView(query)}
                  className="font-bold text-base-content text-sm hover:text-primary cursor-pointer transition-colors truncate"
                >
                  {query.name}
                </h4>
                {getStatusBadge(query.status)}
              </div>
              {query.company && (
                <p className="text-xs text-base-content/60 flex items-center gap-1 mt-0.5 truncate">
                  <LuBuilding2 className="size-3 text-base-content/40 shrink-0" />
                  {query.company}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onToggleStar(query._id)}
              className={`btn btn-ghost btn-xs btn-circle ${
                query.isStarred
                  ? "text-warning hover:text-warning"
                  : "text-base-content/30 hover:text-warning"
              }`}
              title={query.isStarred ? "Starred" : "Star"}
            >
              <LuStar className={`size-3.5 ${query.isStarred ? "fill-current" : ""}`} />
            </button>

            {/* Actions Dropdown */}
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                type="button"
                className="btn btn-ghost btn-xs btn-circle text-base-content/50"
              >
                <LuEllipsisVertical className="size-4" />
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu z-20 p-2 shadow-xl bg-base-100 rounded-2xl border border-base-300 w-44 text-xs space-y-0.5"
              >
                <li>
                  <button type="button" onClick={() => onView(query)}>
                    <LuEye className="size-3.5 text-primary" /> View Details
                  </button>
                </li>
                <li>
                  <a href={`mailto:${query.email}`}>
                    <LuMail className="size-3.5 text-info" /> Email Sender
                  </a>
                </li>
                {query.phone && (
                  <li>
                    <a href={`tel:${query.phone}`}>
                      <LuPhone className="size-3.5 text-success" /> Call Sender
                    </a>
                  </li>
                )}
                <div className="divider my-1"></div>
                <li className="menu-title text-[10px] uppercase font-bold text-base-content/40">
                  Change Status
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(query._id, "unread")}
                  >
                    <LuClock className="size-3.5 text-warning" /> Mark Unread
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(query._id, "contacted")}
                  >
                    <LuPhoneCall className="size-3.5 text-info" /> Mark Contacted
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(query._id, "resolved")}
                  >
                    <LuCircleCheck className="size-3.5 text-success" /> Mark Resolved
                  </button>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button
                    type="button"
                    onClick={() => onDelete(query)}
                    className="text-error hover:bg-error/10"
                  >
                    <LuTrash2 className="size-3.5" /> Delete Query
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact info badges */}
        <div className="space-y-1 mb-3 text-xs text-base-content/70">
          <div className="flex items-center gap-1.5 truncate">
            <LuMail className="size-3 text-base-content/40 shrink-0" />
            <a
              href={`mailto:${query.email}`}
              className="hover:text-primary transition-colors truncate"
            >
              {query.email}
            </a>
          </div>
          {query.phone && (
            <div className="flex items-center gap-1.5">
              <LuPhone className="size-3 text-base-content/40 shrink-0" />
              <a
                href={`tel:${query.phone}`}
                className="hover:text-primary transition-colors"
              >
                {query.phone}
              </a>
            </div>
          )}
        </div>

        {/* Message preview snippet */}
        <div
          onClick={() => onView(query)}
          className="p-3 rounded-2xl bg-base-200/50 border border-base-300/40 text-xs text-base-content/80 line-clamp-3 leading-relaxed cursor-pointer hover:bg-base-200 transition-colors"
        >
          {query.message}
        </div>
      </div>

      {/* Footer: Date & Quick Actions */}
      <div className="mt-4 pt-3 border-t border-base-200/80 flex items-center justify-between text-xs text-base-content/50">
        <span className="flex items-center gap-1 text-[11px]">
          <LuCalendar className="size-3" />
          {formattedDate}
        </span>

        <div className="flex items-center gap-2">
          {query.notes && query.notes.length > 0 && (
            <span
              className="badge badge-xs badge-neutral gap-1 cursor-pointer"
              onClick={() => onView(query)}
              title={`${query.notes.length} internal notes`}
            >
              <LuMessageSquare className="size-2.5" />
              {query.notes.length}
            </span>
          )}

          <button
            type="button"
            onClick={() => onView(query)}
            className="btn btn-xs btn-ghost text-primary hover:bg-primary/10 rounded-lg"
          >
            Details →
          </button>
        </div>
      </div>
    </div>
  );
}
