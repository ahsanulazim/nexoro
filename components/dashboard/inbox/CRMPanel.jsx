"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/axios/axiosInstance";
import { auth } from "@/firebase/firebase.config";
import { useSocket } from "@/context/SocketProvider";
import moment from "moment";
import { toast } from "react-toastify";
import {
  LuBadgeCheck,
  LuBriefcase,
  LuBuilding,
  LuCheck,
  LuCopy,
  LuGlobe,
  LuMail,
  LuPackage,
  LuPackageCheck,
  LuPencil,
  LuPhone,
  LuPlus,
  LuSparkles,
  LuStickyNote,
  LuTrash2,
  LuUser,
  LuX,
  LuBan,
  LuShieldCheck,
} from "react-icons/lu";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaGlobe } from "react-icons/fa6";
import { HiOutlineCurrencyBangladeshi } from "react-icons/hi";
import BlockUserModal from "./BlockUserModal";

const CRMPanel = ({ roomId }) => {
  const { isCrmOpen, setIsCrmOpen, setIsConfirmOrderOpen } = useSocket();
  const [noteText, setNoteText] = useState("");
  const [copiedField, setCopiedField] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    userName: "",
    phone: "",
    email: "",
    company: "",
    country: "",
  });
  const queryClient = useQueryClient();

  // Fetch CRM details
  const {
    data: crmData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["crmDetails", roomId],
    queryFn: async () => {
      if (!roomId) return null;
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get(`/conversations/crmDetails?roomId=${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.success ? res.data.data : null;
    },
    enabled: !!roomId && isCrmOpen,
  });

  // Edit CRM profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (payload) => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.put("/conversations/updateCRMProfile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("CRM Profile updated successfully");
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["crmDetails", roomId] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update profile");
    },
  });

  const handleOpenEdit = () => {
    const cust = crmData?.customer || {};
    setEditForm({
      name: cust.name || "",
      userName: cust.userName || "",
      phone: cust.phone || "",
      email: cust.email || "",
      company: cust.company || "",
      country: cust.country || "Bangladesh",
    });
    setIsEditModalOpen(true);
  };

  // Add internal note mutation
  const addNoteMutation = useMutation({
    mutationFn: async (text) => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.post(
        "/conversations/addNote",
        { roomId, text },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    },
    onSuccess: () => {
      setNoteText("");
      queryClient.invalidateQueries({ queryKey: ["crmDetails", roomId] });
      toast.success("Note added successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add note");
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId) => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.delete("/conversations/deleteNote", {
        data: { roomId, noteId },
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crmDetails", roomId] });
      toast.success("Note deleted");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete note");
    },
  });

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addNoteMutation.mutate(noteText.trim());
  };

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  if (!isCrmOpen) return null;

  const customer = crmData?.customer || {};
  const isClient = Boolean(crmData?.isClient);
  const detectedFromChat = crmData?.extractedInfo?.detectedFromChat || {};
  const platform = crmData?.platform || "web";
  const notes = crmData?.notes || [];
  const orders = crmData?.recentOrders || [];

  const renderPlatformBadge = (plat) => {
    switch (plat) {
      case "whatsapp":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <FaWhatsapp /> WhatsApp
          </span>
        );
      case "facebook":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-600 border border-blue-600/20">
            <FaFacebookF /> Messenger
          </span>
        );
      case "instagram":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20">
            <FaInstagram /> Instagram
          </span>
        );
      case "web":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <FaGlobe /> Website Client
          </span>
        );
    }
  };

  return (
    <>
      {/* Backdrop for mobile & tablet screens */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 xl:hidden"
        onClick={() => setIsCrmOpen(false)}
        aria-hidden="true"
      />

      <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 max-w-full shadow-2xl xl:shadow-none xl:static xl:z-auto xl:w-80 2xl:w-88 xl:border-l xl:border-base-300 bg-base-100 dark:bg-base-200 flex flex-col h-full transition-all">
        {/* Top Header */}
        <div className="p-3.5 border-b border-base-300 flex items-center justify-between bg-base-200/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <LuUser className="size-4" />
            </div>
            <h3 className="font-bold text-sm">Customer CRM Profile</h3>
          </div>
          <button
            onClick={() => setIsCrmOpen(false)}
            className="btn btn-ghost btn-circle btn-sm hover:bg-base-300"
            title="Close CRM Panel"
          >
            <LuX className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="flex flex-col items-center gap-2 py-4">
                <div className="size-16 rounded-full skeleton" />
                <div className="h-4 w-32 skeleton rounded" />
                <div className="h-3 w-20 skeleton rounded" />
              </div>
              <div className="h-20 skeleton rounded-xl" />
              <div className="h-32 skeleton rounded-xl" />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-error space-y-2">
              <p className="text-xs">Failed to load CRM data</p>
              <button
                onClick={() => refetch()}
                className="btn btn-xs btn-outline btn-error"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Customer Identity Card */}
              <div className="bg-base-100 rounded-2xl p-4 border border-base-300 shadow-xs flex flex-col items-center text-center space-y-2.5">
                <div className="relative">
                  <div className="size-16 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center uppercase overflow-hidden border-2 border-primary/20 shadow-inner">
                    {customer.avatar ? (
                      <img
                        src={customer.avatar}
                        alt={customer.name || "Customer"}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span>
                        {(customer.name || customer.userName || "CU").slice(
                          0,
                          2,
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-base text-base-content">
                    {customer.name || customer.userName || "Customer"}
                  </h4>
                  <div className="mt-1 flex items-center justify-center gap-1.5 flex-wrap">
                    {renderPlatformBadge(platform)}
                    {isClient && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/25">
                        <LuBadgeCheck className="size-3.5" />
                        <span>Verified Client</span>
                      </span>
                    )}
                    {customer.role && !isClient && (
                      <span className="badge badge-sm badge-neutral capitalize font-mono text-[10px]">
                        {customer.role}
                      </span>
                    )}
                  </div>
                  {(customer.company || customer.country) && (
                    <div className="mt-1.5 flex items-center justify-center gap-1.5 flex-wrap text-[11px] text-base-content/60">
                      {customer.company && (
                        <span className="inline-flex items-center gap-1">
                          <LuBuilding className="size-3" /> {customer.company}
                        </span>
                      )}
                      {customer.company && customer.country && <span>•</span>}
                      {customer.country && (
                        <span className="inline-flex items-center gap-1">
                          <LuGlobe className="size-3" /> {customer.country}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Confirm Order CTA Button inside CRM */}
                <button
                  type="button"
                  onClick={() => setIsConfirmOrderOpen(true)}
                  className="btn btn-primary btn-xs sm:btn-sm w-full rounded-box mt-1 shadow-xs"
                >
                  <LuPackageCheck />
                  <span>
                    {isClient
                      ? "Create New Order"
                      : "Confirm Order & Add Client"}
                  </span>
                </button>

                {/* Block / Unblock Status & Action */}
                {crmData?.isBlocked ? (
                  <div className="w-full p-2.5 rounded-xl bg-error/10 border border-error/20 text-left space-y-1.5 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-error">
                        <LuBan className="size-3.5" />
                        <span>Contact is Blocked</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsBlockModalOpen(true)}
                        className="btn btn-xs sm:btn-sm btn-outline btn-success"
                      >
                        Unblock
                      </button>
                    </div>
                    {crmData?.blockReason && (
                      <p className="text-[11px] text-base-content/70 italic">
                        Reason: &quot;{crmData.blockReason}&quot;
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsBlockModalOpen(true)}
                    className="btn btn-outline btn-error btn-xs sm:btn-sm w-full rounded-box mt-1"
                    title="Block this contact"
                  >
                    <LuBan />
                    <span>Block Contact</span>
                  </button>
                )}

                {/* Contact Information List */}
                <div className="w-full pt-2 border-t border-base-200 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-semibold text-base-content/60 text-[10px] uppercase tracking-wider">
                      Contact Details
                    </span>
                    <button
                      type="button"
                      onClick={handleOpenEdit}
                      className="btn btn-ghost btn-xs text-primary gap-1 px-1.5 h-6 min-h-0 text-[11px]"
                      title="Edit CRM Profile"
                    >
                      <LuPencil className="size-3" />
                      <span>Edit Profile</span>
                    </button>
                  </div>

                  {/* Email */}
                  {customer.email && (
                    <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <LuMail className="text-base-content/60 shrink-0" />
                        <span className="truncate text-base-content/80 font-medium">
                          {customer.email}
                        </span>
                        {detectedFromChat.email && (
                          <LuSparkles
                            className="text-amber-500 size-3 shrink-0"
                            title="Auto-detected from chat messages"
                          />
                        )}
                      </div>
                      <button
                        onClick={() => handleCopy(customer.email, "email")}
                        className="btn btn-ghost btn-circle btn-xs shrink-0"
                        title="Copy Email"
                      >
                        {copiedField === "email" ? (
                          <LuCheck className="text-success" />
                        ) : (
                          <LuCopy />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Phone */}
                  {(customer.phone ||
                    (roomId.startsWith("wa_") &&
                      /^\+?[0-9]+$/.test(cleanRoomId(roomId)))) && (
                    <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <LuPhone className="text-base-content/60 shrink-0" />
                        <span className="truncate text-base-content/80 font-medium">
                          {customer.phone ||
                            `+${cleanRoomId(roomId).replace(/[^0-9]/g, "")}`}
                        </span>
                        {detectedFromChat.phone && (
                          <LuSparkles
                            className="text-amber-500 size-3 shrink-0"
                            title="Auto-detected from chat messages"
                          />
                        )}
                      </div>
                      <button
                        onClick={() =>
                          handleCopy(
                            customer.phone ||
                              `+${cleanRoomId(roomId).replace(/[^0-9]/g, "")}`,
                            "phone",
                          )
                        }
                        className="btn btn-ghost btn-circle btn-xs shrink-0"
                        title="Copy Phone"
                      >
                        {copiedField === "phone" ? (
                          <LuCheck className="text-success" />
                        ) : (
                          <LuCopy />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Username (for WhatsApp/Social username users) */}
                  {customer.userName &&
                    customer.userName !== "WhatsApp User" &&
                    customer.userName !== customer.name && (
                      <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base-content/60 font-mono text-xs font-bold shrink-0">
                            @
                          </span>
                          <span className="truncate text-base-content/80 font-medium text-xs">
                            {customer.userName.startsWith("@")
                              ? customer.userName
                              : `@${customer.userName}`}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            handleCopy(
                              customer.userName.startsWith("@")
                                ? customer.userName
                                : `@${customer.userName}`,
                              "username",
                            )
                          }
                          className="btn btn-ghost btn-circle btn-xs shrink-0"
                          title="Copy Username"
                        >
                          {copiedField === "username" ? (
                            <LuCheck className="text-success" />
                          ) : (
                            <LuCopy />
                          )}
                        </button>
                      </div>
                    )}

                  {/* Customer ID / Room ID */}
                  <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-base-200/50 text-[11px] font-mono text-base-content/60">
                    <span className="truncate">ID: {roomId}</span>
                    <button
                      onClick={() => handleCopy(roomId, "roomId")}
                      className="btn btn-ghost btn-circle btn-xs shrink-0"
                      title="Copy ID"
                    >
                      {copiedField === "roomId" ? (
                        <LuCheck className="text-success" />
                      ) : (
                        <LuCopy />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Metrics / Lifetime Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-base-100 p-3 rounded-xl border border-base-300">
                  <div className="flex items-center gap-1.5 text-base-content/60 text-xs mb-1">
                    <LuPackage className="text-primary size-3.5" />
                    <span>Orders</span>
                  </div>
                  <div className="text-lg font-bold">
                    {crmData?.ordersCount || 0}
                  </div>
                </div>
                <div className="bg-base-100 p-3 rounded-xl border border-base-300">
                  <div className="flex items-center gap-1.5 text-base-content/60 text-xs mb-1">
                    <HiOutlineCurrencyBangladeshi className="text-emerald-500 size-4" />
                    <span>Total Spent</span>
                  </div>
                  <div className="text-lg font-bold text-emerald-500 truncate">
                    ৳{(crmData?.totalSpent || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Recent Orders Section */}
              <div className="bg-base-100 rounded-2xl p-3.5 border border-base-300 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs flex items-center gap-1.5 text-base-content">
                    <LuBriefcase className="text-primary" />
                    <span>Recent Orders</span>
                  </h5>
                  <span className="text-[11px] text-base-content/50">
                    {orders.length} orders
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="py-4 text-center text-xs text-base-content/40">
                    No orders placed yet
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {orders.map((ord, idx) => (
                      <li
                        key={idx}
                        className="p-2 rounded-xl bg-base-200/50 border border-base-300/60 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span className="truncate max-w-[140px] text-base-content">
                            {ord.serviceTitle}
                          </span>
                          <span className="text-emerald-500 font-mono">
                            ৳
                            {Number(
                              ord.amount || ord.price || 0,
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-base-content/60">
                          <span className="font-mono">{ord.orderId}</span>
                          <span
                            className={`badge badge-xs ${
                              ord.payment === "Success"
                                ? "badge-success text-success-content"
                                : "badge-warning"
                            }`}
                          >
                            {ord.payment || "Pending"}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Internal Staff Notes */}
              <div className="bg-base-100 rounded-2xl p-3.5 border border-base-300 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs flex items-center gap-1.5 text-base-content">
                    <LuStickyNote className="text-amber-500" />
                    <span>Internal Staff Notes</span>
                  </h5>
                  <span className="text-[11px] text-base-content/50">
                    {notes.length} notes
                  </span>
                </div>

                {/* Note input form */}
                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Write a private note for staff (e.g. VIP client, custom offer)..."
                    className="textarea textarea-bordered textarea-xs w-full bg-base-200/60 focus:bg-base-100 focus:outline-none rounded-xl resize-none text-xs"
                    rows={2}
                  />
                  <button
                    type="submit"
                    disabled={addNoteMutation.isPending || !noteText.trim()}
                    className="btn btn-primary btn-xs w-full rounded-lg gap-1.5"
                  >
                    {addNoteMutation.isPending ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <>
                        <LuPlus className="size-3.5" /> Add Note
                      </>
                    )}
                  </button>
                </form>

                {/* Notes List */}
                {notes.length === 0 ? (
                  <div className="py-2 text-center text-xs text-base-content/40">
                    No internal notes added
                  </div>
                ) : (
                  <ul className="space-y-2 pt-1 max-h-48 overflow-y-auto">
                    {notes.map((note) => (
                      <li
                        key={note._id}
                        className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1 relative group"
                      >
                        <p className="text-base-content/90 whitespace-pre-wrap leading-relaxed">
                          {note.text}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-base-content/50 pt-1 border-t border-amber-500/10">
                          <span className="font-semibold text-amber-500">
                            {note.author}
                          </span>
                          <span>{moment(note.createdAt).fromNow()}</span>
                        </div>
                        <button
                          onClick={() => deleteNoteMutation.mutate(note._id)}
                          className="btn btn-ghost btn-circle btn-xs text-error absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete note"
                        >
                          <LuTrash2 className="size-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>

        {/* Edit CRM Profile Modal */}
        {isEditModalOpen && (
          <div className="modal modal-open modal-bottom sm:modal-middle z-50">
            <div className="modal-box bg-base-100 p-5 rounded-2xl max-w-md w-full border border-base-300 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-base-200">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <LuPencil className="text-primary size-4" />
                  <span>Edit CRM Profile</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-ghost btn-circle btn-xs"
                >
                  <LuX className="size-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateProfileMutation.mutate({ roomId, ...editForm });
                }}
                className="space-y-3 pt-3 text-xs"
              >
                <div>
                  <label className="label py-1 text-xs font-semibold">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. John Doe"
                    className="input input-sm input-bordered w-full rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="label py-1 text-xs font-semibold">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editForm.userName}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        userName: e.target.value,
                      }))
                    }
                    placeholder="e.g. johndoe"
                    className="input input-sm input-bordered w-full rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="label py-1 text-xs font-semibold">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="e.g. +8801700000000"
                      className="input input-sm input-bordered w-full rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="label py-1 text-xs font-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="name@example.com"
                      className="input input-sm input-bordered w-full rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="label py-1 text-xs font-semibold">
                      Company
                    </label>
                    <input
                      type="text"
                      value={editForm.company}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          company: e.target.value,
                        }))
                      }
                      placeholder="e.g. Acme Corp"
                      className="input input-sm input-bordered w-full rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="label py-1 text-xs font-semibold">
                      Country
                    </label>
                    <input
                      type="text"
                      value={editForm.country}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      placeholder="e.g. Bangladesh"
                      className="input input-sm input-bordered w-full rounded-lg"
                    />
                  </div>
                </div>

                <div className="modal-action pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="btn btn-sm btn-ghost rounded-lg"
                    disabled={updateProfileMutation.isPending}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="btn btn-sm btn-primary rounded-lg"
                  >
                    {updateProfileMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
            <div
              className="modal-backdrop bg-black/40"
              onClick={() => setIsEditModalOpen(false)}
            />
          </div>
        )}

        {/* Block User Confirmation Modal */}
        <BlockUserModal
          isOpen={isBlockModalOpen}
          onClose={() => setIsBlockModalOpen(false)}
          conversation={{
            roomId,
            platform: crmData?.platform,
            isBlocked: crmData?.isBlocked,
            customer: crmData?.customer,
          }}
        />
      </aside>
    </>
  );
};

export default CRMPanel;
