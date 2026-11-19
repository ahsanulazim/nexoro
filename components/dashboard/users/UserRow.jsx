"use client";

import { demoteMember, promoteUser } from "@/api/fetchUsers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useState, useMemo } from "react";
import {
  LuArrowBigDownDash,
  LuArrowBigUpDash,
  LuChartLine,
  LuCheck,
  LuCircleCheck,
  LuCopy,
  LuEllipsisVertical,
  LuShieldAlert,
  LuSlidersHorizontal,
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

const UserRow = ({
  client,
  onRemove,
  onManagePermissions,
  onViewProfile,
  currentLoggedInEmail,
}) => {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [failedImgSrc, setFailedImgSrc] = useState(null);

  const displayName = client.name || client.userName || "Unnamed User";
  const userRole = (client.role || "customer").toLowerCase();
  const isCurrentUser = client.email === currentLoggedInEmail;
  const isAdmin = userRole === "admin";
  const isMember = userRole === "member";
  const isCustomer = userRole === "customer";

  // Resolve profile picture if uploaded
  const profileImage = useMemo(() => {
    const candidates = [
      client.profilePic,
      client.photoURL,
      client.avatar,
      client.image,
      client.picture,
    ];
    return candidates.find(
      (url) =>
        typeof url === "string" &&
        url.trim().length > 0 &&
        url !== "null" &&
        url !== "undefined" &&
        url !== failedImgSrc
    );
  }, [client, failedImgSrc]);

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
            {profileImage ? (
              <div className="size-10 rounded-xl overflow-hidden ring-1 ring-base-300 bg-base-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profileImage}
                  alt={displayName}
                  onError={() => setFailedImgSrc(profileImage)}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div
                className={`size-10 rounded-xl bg-gradient-to-br ${getAvatarGradient(
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
          <div className="flex flex-col gap-0.5 items-start">
            <span className="badge badge-sm badge-soft badge-info">
              Team Member
            </span>
            {Array.isArray(client.permissions) ? (
              <span className="text-[10px] text-base-content/50 font-medium">
                {client.permissions.length} modules
              </span>
            ) : (
              <span className="text-[10px] text-base-content/40 font-medium">
                Default access
              </span>
            )}
          </div>
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

      {/* Actions Dropdown */}
      <td className="py-3.5 pr-5 text-right whitespace-nowrap">
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-sm btn-square rounded-lg hover:bg-base-200 text-base-content/70 hover:text-base-content"
            title="User Actions"
          >
            <LuEllipsisVertical className="size-4" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu z-50 p-2 shadow-xl bg-base-100 rounded-box w-56 border border-base-200/90 text-xs font-medium space-y-1"
          >
            {/* View Member Profile & Performance (Members & Admins only, NOT for customers) */}
            {!isCustomer && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (document.activeElement) document.activeElement.blur();
                    onViewProfile?.(client);
                  }}
                  className="flex items-center gap-2.5 py-2 text-primary font-medium hover:bg-primary/10 rounded-lg"
                >
                  <LuChartLine className="size-4" />
                  <span>Profile & Performance</span>
                </button>
              </li>
            )}

            {/* Manage Member Permissions */}
            {isMember && onManagePermissions && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (document.activeElement) document.activeElement.blur();
                    onManagePermissions(client);
                  }}
                  className="flex items-center gap-2.5 py-2 hover:bg-base-200 rounded-lg text-base-content"
                >
                  <LuSlidersHorizontal className="size-4 text-info" />
                  <span>Manage Access</span>
                </button>
              </li>
            )}

            {/* Promote to Member */}
            {isCustomer && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (document.activeElement) document.activeElement.blur();
                    handlePromote();
                  }}
                  disabled={isPromoting}
                  className="flex items-center gap-2.5 py-2 text-success hover:bg-success/10 rounded-lg"
                >
                  {isPromoting ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <LuArrowBigUpDash className="size-4" />
                  )}
                  <span>Make Team Member</span>
                </button>
              </li>
            )}

            {/* Demote to Customer */}
            {isMember && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (document.activeElement) document.activeElement.blur();
                    handleDemote();
                  }}
                  disabled={isDemoting}
                  className="flex items-center gap-2.5 py-2 text-warning hover:bg-warning/10 rounded-lg"
                >
                  {isDemoting ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <LuArrowBigDownDash className="size-4" />
                  )}
                  <span>Demote to Customer</span>
                </button>
              </li>
            )}

            <div className="divider my-0.5 opacity-50"></div>

            {/* Delete User */}
            <li>
              <button
                type="button"
                onClick={() => {
                  if (document.activeElement) document.activeElement.blur();
                  onRemove(client.email);
                }}
                disabled={isCurrentUser || isAdmin}
                className="flex items-center gap-2.5 py-2 text-error hover:bg-error/10 disabled:opacity-40 rounded-lg"
                title={
                  isCurrentUser
                    ? "You cannot delete your own account"
                    : isAdmin
                      ? "Admin accounts cannot be deleted here"
                      : "Remove User"
                }
              >
                <LuTrash2 className="size-4" />
                <span>Remove User</span>
              </button>
            </li>
          </ul>
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
