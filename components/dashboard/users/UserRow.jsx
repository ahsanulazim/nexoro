"use client";

import { demoteMember, promoteUser } from "@/api/fetchUsers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useState } from "react";
import {
  LuArrowBigDownDash,
  LuArrowBigUpDash,
  LuCheck,
  LuCircleCheck,
  LuCopy,
  LuShieldAlert,
  LuTrash2,
} from "react-icons/lu";
import { toast } from "react-toastify";

// Predefined soft avatar colors
const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-purple-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-red-600",
  "from-cyan-500 to-blue-600",
];

const getAvatarGradient = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);
  if (!parts[0]) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const UserRow = ({ client, onRemove, currentLoggedInEmail }) => {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  const displayName = client.name || client.userName || "Unnamed User";
  const userRole = (client.role || "customer").toLowerCase();
  const isCurrentUser = client.email === currentLoggedInEmail;
  const isAdmin = userRole === "admin";
  const isMember = userRole === "member";
  const isCustomer = userRole === "customer";

  // Promote mutation
  const { mutate: handlePromote, isPending: isPromoting } = useMutation({
    mutationFn: () => promoteUser(client.email),
    onSuccess: () => {
      toast.success(`${displayName} promoted to Team Member`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to promote user");
    },
  });

  // Demote mutation
  const { mutate: handleDemote, isPending: isDemoting } = useMutation({
    mutationFn: () => demoteMember(client.email),
    onSuccess: () => {
      toast.success(`${displayName} demoted to Customer`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to demote member");
    },
  });

  const handleCopyEmail = () => {
    if (!client.email) return;
    navigator.clipboard.writeText(client.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = client.createdAt
    ? moment(client.createdAt).format("MMM DD, YYYY")
    : "—";

  const relativeDate = client.createdAt
    ? moment(client.createdAt).fromNow()
    : null;

  return (
    <tr className="hover:bg-base-200/50 transition-colors border-b border-base-200/60">
      {/* User Info (Avatar + Name) */}
      <td className="py-3.5">
        <div className="flex items-center gap-3">
          <div className="avatar placeholder shrink-0">
            {client.photoURL ? (
              <div className="size-10 rounded-md overflow-hidden ring-1 ring-base-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={client.photoURL}
                  alt={displayName}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div
                className={`w-10 h-10 rounded-md bg-linear-to-br ${getAvatarGradient(
                  displayName,
                )} text-white font-bold text-xs flex items-center justify-center shadow-xs`}
              >
                {getInitials(displayName)}
              </div>
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-sm text-base-content truncate max-w-[200px]">
                {displayName}
              </span>
              {isCurrentUser && (
                <span className="badge badge-xs badge-neutral text-[10px] font-medium py-1">
                  You
                </span>
              )}
              {client.emailVerified && (
                <span
                  className="text-success inline-flex"
                  title="Verified Email"
                >
                  <LuCircleCheck className="size-3.5" />
                </span>
              )}
            </div>
            {client.uid && (
              <span className="text-[11px] font-mono text-base-content/40 truncate max-w-[150px]">
                ID: {client.uid.slice(0, 10)}...
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="py-3.5">
        <div className="flex items-center gap-2 group max-w-fit">
          <span className="text-xs sm:text-sm text-base-content/80 font-normal truncate max-w-[220px]">
            {client.email || "No email"}
          </span>
          {client.email && (
            <button
              type="button"
              onClick={handleCopyEmail}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-base-200 text-base-content/60 hover:text-base-content"
              title={copied ? "Copied!" : "Copy email"}
            >
              {copied ? (
                <LuCheck className="size-3.5 text-success" />
              ) : (
                <LuCopy className="size-3.5" />
              )}
            </button>
          )}
        </div>
      </td>

      {/* Role Badge */}
      <td className="py-3.5">
        {isAdmin ? (
          <span className="badge badge-sm badge-soft badge-primary">
            <LuShieldAlert /> Admin
          </span>
        ) : isMember ? (
          <span className="badge badge-sm badge-soft badge-info">
            Team Member
          </span>
        ) : (
          <span className="badge badge-sm badge-soft">Customer</span>
        )}
      </td>

      {/* Joined Date */}
      <td className="py-3.5 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-medium text-base-content/80">
            {formattedDate}
          </span>
          {relativeDate && (
            <span className="text-[11px] text-base-content/40">
              {relativeDate}
            </span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="py-3.5 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-2">
          {/* Promote to Member */}
          {isCustomer && (
            <button
              type="button"
              onClick={() => handlePromote()}
              disabled={isPromoting}
              className="btn btn-xs sm:btn-sm btn-success btn-soft"
              title="Promote to Team Member"
            >
              {isPromoting ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <LuArrowBigUpDash />
              )}
              <span className="hidden sm:inline">Make Member</span>
            </button>
          )}

          {/* Demote to Customer */}
          {isMember && (
            <button
              type="button"
              onClick={() => handleDemote()}
              disabled={isDemoting}
              className="btn btn-xs sm:btn-sm btn-warning btn-soft"
              title="Demote to Customer"
            >
              {isDemoting ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <LuArrowBigDownDash />
              )}
              <span className="hidden sm:inline">Demote</span>
            </button>
          )}

          {/* Delete User */}
          <button
            type="button"
            onClick={() => onRemove(client.email)}
            disabled={isCurrentUser || isAdmin}
            className="btn btn-xs sm:btn-sm btn-error btn-soft"
            title={
              isCurrentUser
                ? "You cannot delete your own account"
                : isAdmin
                  ? "Admin accounts cannot be deleted here"
                  : "Remove User"
            }
          >
            <LuTrash2 />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
