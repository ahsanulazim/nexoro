"use client";

import { useState } from "react";
import { FaUsers } from "react-icons/fa6";
import {
  LuBuilding,
  LuCalendar,
  LuCheck,
  LuCopy,
  LuGlobe,
  LuMail,
  LuPhone,
} from "react-icons/lu";
import { toast } from "react-toastify";
import ClientDrop from "./ClientDrop";

const ClientCard = ({ client }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!client?.email) return;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(client.email);
      setCopiedEmail(true);
      toast.info("Email copied to clipboard", { autoClose: 1500 });
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const formattedDate = (() => {
    const rawDate = client.joined || client.createdAt;
    if (!rawDate) return "Date not specified";
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return "Date not specified";
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Date not specified";
    }
  })();

  return (
    <div className="card bg-base-100 border border-base-200/80 hover:border-primary/40 shadow-xs hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col justify-between group overflow-hidden">
      <div className="card-body p-5 flex flex-col justify-between h-full gap-4">
        {/* Top Header: Logo, Name, Role & Dropdown */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {client.logo ? (
              <div className="shrink-0 bg-base-200/60 rounded-xl size-12 p-2 flex items-center justify-center border border-base-300/40 overflow-hidden">
                <img
                  className="w-full h-full object-contain"
                  src={client.logo}
                  alt={client.name || "Client"}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="shrink-0 bg-primary/10 text-primary rounded-xl size-12 flex items-center justify-center text-lg">
                <FaUsers />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="card-title text-base font-bold text-base-content truncate group-hover:text-primary transition-colors">
                {client.name || "Unnamed Client"}
              </h2>
              <p className="text-xs font-medium text-base-content/60 truncate">
                {client.role || "Client"}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <ClientDrop client={client} />
          </div>
        </div>

        {/* Company & Country Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {client.company && (
            <span className="badge badge-sm badge-soft font-medium gap-1 max-w-[180px] truncate">
              <LuBuilding className="size-3 shrink-0" />
              <span className="truncate">{client.company}</span>
            </span>
          )}
          {client.country && (
            <span className="badge badge-sm badge-soft badge-primary font-medium gap-1">
              <LuGlobe className="size-3 shrink-0" />
              <span>{client.country}</span>
            </span>
          )}
        </div>

        <div className="divider my-0 opacity-40"></div>

        {/* Contact & Meta Details */}
        <div className="space-y-2 text-xs">
          {/* Email */}
          <div className="flex items-center justify-between gap-2 group/email">
            <div className="flex items-center gap-2 min-w-0 text-base-content/70">
              <LuMail className="size-3.5 shrink-0 opacity-60 text-primary" />
              {client.email ? (
                <a
                  href={`mailto:${client.email}`}
                  className="truncate hover:text-primary hover:underline transition-colors"
                  title={client.email}
                >
                  {client.email}
                </a>
              ) : (
                <span className="opacity-40 italic">No email</span>
              )}
            </div>
            {client.email && (
              <button
                type="button"
                onClick={handleCopyEmail}
                className="btn btn-ghost btn-circle btn-xs text-base-content/50 hover:text-primary transition-colors shrink-0"
                title="Copy email"
              >
                {copiedEmail ? (
                  <LuCheck className="size-3.5 text-success" />
                ) : (
                  <LuCopy className="size-3" />
                )}
              </button>
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 text-base-content/70">
            <LuPhone className="size-3.5 shrink-0 opacity-60 text-emerald-500" />
            {client.phone ? (
              <a
                href={`tel:${client.phone}`}
                className="truncate hover:text-emerald-600 hover:underline transition-colors"
              >
                {client.phone}
              </a>
            ) : (
              <span className="opacity-40 italic">No phone provided</span>
            )}
          </div>

          {/* Date Joined */}
          <div className="flex items-center gap-2 text-base-content/50 text-[11px] pt-1">
            <LuCalendar className="size-3.5 shrink-0 opacity-50" />
            <span>Added {formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
