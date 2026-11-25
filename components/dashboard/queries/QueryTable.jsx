"use client";

import {
  LuBuilding2,
  LuCircleCheck,
  LuClock,
  LuEllipsisVertical,
  LuEye,
  LuMail,
  LuMessageSquare,
  LuPhone,
  LuPhoneCall,
  LuStar,
  LuTrash2,
} from "react-icons/lu";

export default function QueryTable({
  queries = [],
  selectedIds = [],
  onSelectAll,
  onToggleSelect,
  onView,
  onUpdateStatus,
  onToggleStar,
  onDelete,
}) {
  const isAllSelected =
    queries.length > 0 && selectedIds.length === queries.length;

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

  return (
    <div className="overflow-x-auto rounded-3xl border border-base-300 bg-base-100 shadow-2xs">
      <table className="table table-sm w-full">
        <thead>
          <tr className="bg-base-200/50 text-base-content/60 text-xs border-b border-base-300">
            <th className="w-10 text-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={onSelectAll}
                className="checkbox checkbox-xs checkbox-primary rounded-md"
              />
            </th>
            <th className="w-8"></th>
            <th>Sender & Company</th>
            <th>Contact Details</th>
            <th>Message Snippet</th>
            <th>Status</th>
            <th>Date</th>
            <th className="w-12 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-base-200 text-xs">
          {queries.map((query) => {
            const isSelected = selectedIds.includes(query._id);
            const isUnread = query.status === "unread";

            const formattedDate = new Date(query.createdAt || query.added).toLocaleString("en-BD", {
              timeZone: "Asia/Dhaka",
              dateStyle: "short",
              timeStyle: "short",
            });

            return (
              <tr
                key={query._id}
                className={`hover:bg-base-200/40 transition-colors ${
                  isSelected
                    ? "bg-primary/5"
                    : isUnread
                    ? "bg-amber-500/5 font-medium"
                    : ""
                }`}
              >
                {/* Checkbox */}
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(query._id)}
                    className="checkbox checkbox-xs checkbox-primary rounded-md"
                  />
                </td>

                {/* Star Toggle */}
                <td className="text-center">
                  <button
                    type="button"
                    onClick={() => onToggleStar(query._id)}
                    className={`btn btn-ghost btn-xs btn-circle ${
                      query.isStarred
                        ? "text-warning hover:text-warning"
                        : "text-base-content/20 hover:text-warning"
                    }`}
                  >
                    <LuStar
                      className={`size-3.5 ${
                        query.isStarred ? "fill-current" : ""
                      }`}
                    />
                  </button>
                </td>

                {/* Sender & Company */}
                <td className="max-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span
                      onClick={() => onView(query)}
                      className="font-bold text-base-content hover:text-primary cursor-pointer truncate"
                    >
                      {query.name}
                    </span>
                    {isUnread && (
                      <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                    )}
                  </div>
                  {query.company ? (
                    <span className="text-[11px] text-base-content/60 flex items-center gap-1 truncate mt-0.5">
                      <LuBuilding2 className="size-3 shrink-0" />
                      {query.company}
                    </span>
                  ) : (
                    <span className="text-[11px] text-base-content/40 italic">
                      Individual
                    </span>
                  )}
                </td>

                {/* Contact Details */}
                <td className="max-w-[200px]">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <LuMail className="size-3 text-base-content/40 shrink-0" />
                      <a
                        href={`mailto:${query.email}`}
                        className="text-primary hover:underline truncate"
                      >
                        {query.email}
                      </a>
                    </div>
                    {query.phone && (
                      <div className="flex items-center gap-1.5 truncate">
                        <LuPhone className="size-3 text-base-content/40 shrink-0" />
                        <a
                          href={`tel:${query.phone}`}
                          className="hover:underline text-base-content/80 truncate"
                        >
                          {query.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </td>

                {/* Message Snippet */}
                <td
                  onClick={() => onView(query)}
                  className="max-w-[280px] cursor-pointer hover:text-primary transition-colors"
                >
                  <p className="line-clamp-2 text-base-content/80 leading-relaxed">
                    {query.message}
                  </p>
                  {query.notes && query.notes.length > 0 && (
                    <span className="badge badge-xs badge-neutral gap-1 mt-1">
                      <LuMessageSquare className="size-2.5" />
                      {query.notes.length} notes
                    </span>
                  )}
                </td>

                {/* Status with quick selector */}
                <td>
                  <div className="dropdown dropdown-bottom dropdown-end">
                    <button
                      tabIndex={0}
                      type="button"
                      className="cursor-pointer transition-transform hover:scale-105"
                    >
                      {getStatusBadge(query.status)}
                    </button>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu z-20 p-2 shadow-xl bg-base-100 rounded-2xl border border-base-300 w-36 text-xs"
                    >
                      <li>
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(query._id, "unread")}
                        >
                          <LuClock className="size-3.5 text-warning" /> Unread
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(query._id, "read")}
                        >
                          Read
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(query._id, "contacted")}
                        >
                          <LuPhoneCall className="size-3.5 text-info" /> Contacted
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(query._id, "resolved")}
                        >
                          <LuCircleCheck className="size-3.5 text-success" /> Resolved
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>

                {/* Date */}
                <td className="text-base-content/60 whitespace-nowrap">
                  {formattedDate}
                </td>

                {/* Actions Dropdown */}
                <td className="text-center">
                  <div className="dropdown dropdown-end">
                    <button
                      tabIndex={0}
                      type="button"
                      className="btn btn-ghost btn-xs btn-circle text-base-content/60"
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
                          <LuMail className="size-3.5 text-info" /> Send Email
                        </a>
                      </li>
                      {query.phone && (
                        <li>
                          <a href={`tel:${query.phone}`}>
                            <LuPhone className="size-3.5 text-success" /> Call
                          </a>
                        </li>
                      )}
                      <div className="divider my-1"></div>
                      <li>
                        <button
                          type="button"
                          onClick={() => onDelete(query)}
                          className="text-error hover:bg-error/10"
                        >
                          <LuTrash2 className="size-3.5" /> Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
