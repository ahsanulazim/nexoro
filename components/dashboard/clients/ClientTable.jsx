"use client";

import { useState } from "react";
import { FaUsers } from "react-icons/fa6";
import {
  LuBuilding,
  LuCheck,
  LuCopy,
  LuGlobe,
  LuMail,
  LuPhone,
} from "react-icons/lu";
import { toast } from "react-toastify";
import ClientDrop from "./ClientDrop";

const ClientTableRow = ({ client }) => {
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
    if (!rawDate) return "N/A";
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return "N/A";
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  })();

  return (
    <tr className="hover:bg-base-200/50 transition-colors border-b border-base-200/60">
      {/* Client Name & Role */}
      <td>
        <div className="flex items-center gap-3">
          {client.logo ? (
            <div className="shrink-0 bg-base-200/60 rounded-xl size-10 p-1.5 flex items-center justify-center border border-base-300/40 overflow-hidden">
              <img
                src={client.logo}
                alt={client.name || "Client"}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ) : (
            <div className="shrink-0 bg-primary/10 text-primary rounded-xl size-10 flex items-center justify-center text-sm">
              <FaUsers />
            </div>
          )}
          <div className="min-w-0">
            <div className="font-semibold text-sm text-base-content hover:text-primary transition-colors">
              {client.name || "Unnamed Client"}
            </div>
            <div className="text-xs text-base-content/60">
              {client.role || "Client"}
            </div>
          </div>
        </div>
      </td>

      {/* Company */}
      <td>
        <div className="flex items-center gap-1.5 text-xs text-base-content/80 font-medium">
          <LuBuilding className="size-3.5 opacity-50 shrink-0" />
          <span className="truncate max-w-[160px]">
            {client.company || <span className="opacity-40 italic">N/A</span>}
          </span>
        </div>
      </td>

      {/* Country */}
      <td>
        {client.country ? (
          <span className="badge badge-sm badge-soft badge-primary font-medium gap-1">
            <LuGlobe className="size-3 shrink-0" />
            <span>{client.country}</span>
          </span>
        ) : (
          <span className="text-xs opacity-40 italic">Not set</span>
        )}
      </td>

      {/* Contact Info (Email & Phone) */}
      <td>
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-2">
            <LuMail className="size-3.5 text-primary opacity-70 shrink-0" />
            {client.email ? (
              <div className="flex items-center gap-1.5">
                <a
                  href={`mailto:${client.email}`}
                  className="hover:underline hover:text-primary transition-colors truncate max-w-[180px]"
                >
                  {client.email}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="text-base-content/40 hover:text-primary transition-colors"
                  title="Copy email"
                >
                  {copiedEmail ? (
                    <LuCheck className="size-3 text-success" />
                  ) : (
                    <LuCopy className="size-3" />
                  )}
                </button>
              </div>
            ) : (
              <span className="opacity-40 italic">No email</span>
            )}
          </div>

          {client.phone && (
            <div className="flex items-center gap-2 text-base-content/70">
              <LuPhone className="size-3 text-emerald-500 opacity-70 shrink-0" />
              <a
                href={`tel:${client.phone}`}
                className="hover:underline hover:text-emerald-600 transition-colors"
              >
                {client.phone}
              </a>
            </div>
          )}
        </div>
      </td>

      {/* Date Added */}
      <td>
        <span className="text-xs text-base-content/60 font-medium">
          {formattedDate}
        </span>
      </td>

      {/* Actions */}
      <td className="text-right">
        <ClientDrop client={client} />
      </td>
    </tr>
  );
};

const ClientTable = ({ clients = [] }) => {
  return (
    <div className="bg-base-100 rounded-2xl border border-base-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200/50 text-xs font-semibold text-base-content/70 border-b border-base-200">
              <th className="py-3.5">Client</th>
              <th className="py-3.5">Company</th>
              <th className="py-3.5">Country</th>
              <th className="py-3.5">Contact Details</th>
              <th className="py-3.5">Date Added</th>
              <th className="py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, idx) => (
              <ClientTableRow
                key={client._id || client.email || `client-row-${idx}`}
                client={client}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;
