"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/axios/axiosInstance";
import { auth } from "@/firebase/firebase.config";
import { useAuth } from "@/context/AuthProvider";
import { MyContext } from "@/context/MyProvider";
import { useSocket } from "@/context/SocketProvider";
import { toast } from "react-toastify";
import {
  LuBadgeCheck,
  LuBriefcase,
  LuBuilding,
  LuCalendar,
  LuCreditCard,
  LuGlobe,
  LuMail,
  LuPackageCheck,
  LuPhone,
  LuSparkles,
  LuStickyNote,
  LuUser,
  LuUserCheck,
  LuUserPlus,
  LuX,
} from "react-icons/lu";
import { HiOutlineCurrencyBangladeshi } from "react-icons/hi";

const COUNTRIES = [
  "Bangladesh",
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Brazil",
  "Finland",
  "France",
  "Germany",
  "Europe",
];

const PAYMENT_METHODS = [
  { value: "bKash", label: "bKash" },
  { value: "Nagad", label: "Nagad" },
  { value: "Bank", label: "Bank Transfer" },
  { value: "Cash", label: "Cash" },
  { value: "EPS", label: "EPS / Card" },
];

const cleanRoom = (id) => String(id || "").replace(/^(fb_|ig_|wa_|room_)/, "");

const ConfirmOrderModal = ({ roomId }) => {
  const {
    isConfirmOrderOpen,
    setIsConfirmOrderOpen,
    conversations,
    setConversations,
  } = useSocket();
  const { currentUser } = useAuth();
  const {
    services = [],
    servicesLoading,
    assignableUsers = [],
  } = useContext(MyContext) || {};
  const queryClient = useQueryClient();

  const currentConversation = useMemo(() => {
    return conversations?.find(
      (c) =>
        c?.roomId === roomId ||
        (c?.roomId && cleanRoom(c.roomId) === cleanRoom(roomId))
    );
  }, [conversations, roomId]);

  // Fetch CRM & auto-extracted chat details when modal opens
  const { data: crmData, isLoading: crmLoading } = useQuery({
    queryKey: ["crmDetails", roomId],
    queryFn: async () => {
      if (!roomId) return null;
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get(`/conversations/crmDetails?roomId=${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.success ? res.data.data : null;
    },
    enabled: Boolean(roomId && isConfirmOrderOpen),
  });

  // Client fields state
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [company, setCompany] = useState("");
  const [clientRole, setClientRole] = useState("Client");
  const [country, setCountry] = useState("Bangladesh");

  // Order fields state
  const [slug, setSlug] = useState("custom");
  const [planId, setPlanId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState("Pending");
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [amount, setAmount] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [assignToSelf, setAssignToSelf] = useState(false);
  const [assignedTo, setAssignedTo] = useState("");
  const [orderNote, setOrderNote] = useState("");

  // Populate client fields from CRM / conversation data
  useEffect(() => {
    if (!isConfirmOrderOpen) return;

    const extracted = crmData?.extractedInfo;
    const fallbackCust = currentConversation?.customer;

    if (extracted) {
      setClientName(extracted.name || fallbackCust?.name || "Customer");
      setClientEmail(extracted.email || "");
      setClientPhone(
        extracted.phone ||
          fallbackCust?.phone ||
          (String(roomId || "").startsWith("wa_")
            ? `+${cleanRoom(roomId).replace(/[^0-9]/g, "")}`
            : "")
      );
      setCompany(extracted.company || "Individual / Self");
      setClientRole(extracted.clientRole || "Client");
      setCountry(extracted.country || "Bangladesh");
    } else if (fallbackCust) {
      setClientName(
        fallbackCust.name || fallbackCust.userName || "Customer"
      );
      setClientEmail(fallbackCust.email || "");
      setClientPhone(
        fallbackCust.phone ||
          (String(roomId || "").startsWith("wa_")
            ? `+${cleanRoom(roomId).replace(/[^0-9]/g, "")}`
            : "")
      );
      setCompany(fallbackCust.company || "Individual / Self");
      setClientRole("Client");
      setCountry(fallbackCust.country || "Bangladesh");
    }
  }, [crmData, currentConversation, isConfirmOrderOpen, roomId]);

  const selectedServicePlans = useMemo(() => {
    if (!slug || slug === "custom") return [];
    const found = services?.find((s) => s.slug === slug);
    return found?.plans || [];
  }, [services, slug]);

  // Reset planId when service changes
  useEffect(() => {
    if (slug !== "custom" && selectedServicePlans.length > 0) {
      setPlanId(String(selectedServicePlans[0]?.id || ""));
    } else {
      setPlanId("");
    }
  }, [slug, selectedServicePlans]);

  const confirmMutation = useMutation({
    mutationFn: async (payload) => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.post(
        "/conversations/confirmOrderFromChat",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    onSuccess: (resData) => {
      const createdClient = resData?.data?.client;
      toast.success(
        resData?.message || "Order confirmed and client saved successfully!"
      );

      // Update local conversations state so Client badge appears immediately
      if (createdClient && setConversations) {
        setConversations((prev = []) =>
          prev.map((c) => {
            if (
              c.roomId === roomId ||
              cleanRoom(c.roomId) === cleanRoom(roomId)
            ) {
              return {
                ...c,
                isClient: true,
                clientId: String(createdClient._id),
                customer: {
                  ...(c.customer || {}),
                  name: createdClient.name || c.customer?.name,
                  userName: createdClient.name || c.customer?.userName,
                  phone: createdClient.phone || c.customer?.phone,
                  company: createdClient.company || c.customer?.company,
                },
              };
            }
            return c;
          })
        );
      }

      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["crmDetails", roomId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clientData"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      handleClose();
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to confirm order"
      );
    },
  });

  const handleClose = () => {
    setIsConfirmOrderOpen(false);
    setServiceName("");
    setServicePrice("");
    setDiscount(0);
    setPayment("Pending");
    setAmount(0);
    setDeadline("");
    setOrderNote("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!clientName.trim() || clientName.trim().length < 2) {
      return toast.warning("Please enter the customer's name");
    }

    if (!slug) {
      return toast.warning("Please select a service");
    }

    if (slug === "custom") {
      if (!serviceName.trim()) {
        return toast.warning("Please enter a custom service name");
      }
      if (!servicePrice || Number(servicePrice) <= 0) {
        return toast.warning("Please enter a valid service price");
      }
    } else if (!planId) {
      return toast.warning("Please select a service plan");
    }

    const userRole = currentUser?.user?.role || "admin";
    const creatorName =
      currentUser?.user?.name ||
      currentUser?.user?.displayName ||
      currentUser?.user?.email ||
      (userRole === "member" ? "Member" : "Admin");

    confirmMutation.mutate({
      roomId,
      clientId: crmData?.clientId || crmData?.existingClient?._id || null,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      company: company.trim() || "Individual / Self",
      clientRole: clientRole.trim() || "Client",
      country: country || "Bangladesh",
      slug,
      planId: slug === "custom" ? null : planId,
      serviceName: slug === "custom" ? serviceName.trim() : undefined,
      servicePrice: slug === "custom" ? Number(servicePrice) : undefined,
      discount: Number(discount) || 0,
      payment,
      paymentMethod,
      amount: payment === "Success" ? 0 : Number(amount) || 0,
      deadline: deadline || null,
      assignToSelf: Boolean(assignToSelf),
      assignedTo: assignToSelf
        ? currentUser?.user?._id
        : assignedTo || null,
      createdBy: creatorName,
      createdByRole: userRole,
      createdById: currentUser?.user?._id || null,
      orderNote: orderNote.trim(),
    });
  };

  if (!isConfirmOrderOpen || !roomId) return null;

  const isExistingClient = Boolean(crmData?.isClient);
  const detectedFromChat = crmData?.extractedInfo?.detectedFromChat || {};
  const userRole = currentUser?.user?.role;

  return (
    <div
      className="modal modal-open z-50 bg-black/50 backdrop-blur-xs"
      data-lenis-ignore
    >
      <div className="modal-box max-w-2xl p-0 overflow-hidden border border-base-300 shadow-2xl rounded-2xl">
        {/* Top Modal Header */}
        <div className="px-6 py-4 bg-base-200/80 border-b border-base-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/15 text-primary">
              <LuPackageCheck className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg text-base-content leading-tight">
                Confirm Order & Auto-Save Client
              </h3>
              <p className="text-xs text-base-content/60">
                Create an order from this conversation and automatically sync
                customer to Clients
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-ghost btn-circle btn-sm"
          >
            <LuX className="size-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 md:p-6 max-h-[80dvh] overflow-y-auto space-y-5"
        >
          {/* Status Banner: Existing Client vs Auto-Add New Client */}
          {crmLoading ? (
            <div className="h-14 w-full skeleton rounded-xl" />
          ) : isExistingClient ? (
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400">
              <div className="flex items-center gap-2.5">
                <LuUserCheck className="size-5 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold block">
                    Existing Client Linked ({crmData?.existingClient?.name})
                  </span>
                  <span className="opacity-80">
                    This customer is already in your Clients list. Any updated
                    details below will be synced automatically.
                  </span>
                </div>
              </div>
              <span className="badge badge-sm badge-success text-success-content font-semibold shrink-0 gap-1">
                <LuBadgeCheck className="size-3" /> Client
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-primary/10 border border-primary/25 text-primary">
              <div className="flex items-center gap-2.5">
                <LuUserPlus className="size-5 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold block">
                    Automatic Client Registration
                  </span>
                  <span className="opacity-80">
                    Confirming this order will automatically add this customer
                    to your Clients directory.
                  </span>
                </div>
              </div>
              <span className="badge badge-sm badge-primary font-semibold shrink-0">
                Auto-Add
              </span>
            </div>
          )}

          {/* SECTION 1: Customer / Client Profile (Auto-Filled from Chat) */}
          <div className="bg-base-200/40 border border-base-300/80 rounded-2xl p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                <LuUser className="text-primary size-3.5" />
                <span>1. Customer Profile (Auto-Filled)</span>
              </h4>
              {(detectedFromChat.email || detectedFromChat.phone) && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <LuSparkles className="size-3" />
                  <span>Extracted from chat</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Client Name */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs font-medium flex items-center gap-1">
                    <LuUser className="size-3 opacity-60" /> Customer Name
                    <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Customer full name"
                  className="input input-sm input-bordered w-full bg-base-100"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs font-medium flex items-center gap-1">
                    <LuPhone className="size-3 opacity-60" /> Phone Number
                  </span>
                  {detectedFromChat.phone && (
                    <span className="label-text-alt text-[10px] text-emerald-500 font-medium flex items-center gap-0.5">
                      <LuSparkles className="size-2.5" /> Chat detected
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+8801XXXXXXXXX"
                  className="input input-sm input-bordered w-full bg-base-100"
                />
              </div>

              {/* Email Address (Optional for Social Chat) */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs font-medium flex items-center gap-1">
                    <LuMail className="size-3 opacity-60" /> Email Address
                  </span>
                  {detectedFromChat.email ? (
                    <span className="label-text-alt text-[10px] text-emerald-500 font-medium flex items-center gap-0.5">
                      <LuSparkles className="size-2.5" /> Chat detected
                    </span>
                  ) : (
                    <span className="label-text-alt text-[10px] text-base-content/50">
                      Optional for FB/IG/WA
                    </span>
                  )}
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="Leave blank if not provided"
                  className="input input-sm input-bordered w-full bg-base-100"
                />
              </div>

              {/* Company / Brand Name */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs font-medium flex items-center gap-1">
                    <LuBuilding className="size-3 opacity-60" /> Company / Brand
                  </span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company or Individual"
                  className="input input-sm input-bordered w-full bg-base-100"
                />
              </div>

              {/* Client Role */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs font-medium">
                    Role in Brand
                  </span>
                </label>
                <input
                  type="text"
                  value={clientRole}
                  onChange={(e) => setClientRole(e.target.value)}
                  placeholder="e.g. Founder, Owner, Client"
                  className="input input-sm input-bordered w-full bg-base-100"
                />
              </div>

              {/* Country */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs font-medium flex items-center gap-1">
                    <LuGlobe className="size-3 opacity-60" /> Country
                  </span>
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="select select-sm select-bordered w-full bg-base-100"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: Order & Payment Details */}
          <div className="bg-base-200/40 border border-base-300/80 rounded-2xl p-4 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
              <LuBriefcase className="text-primary size-3.5" />
              <span>2. Order & Service Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Select Service */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs font-medium">
                    Select Service <span className="text-error">*</span>
                  </span>
                </label>
                <select
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  disabled={servicesLoading}
                  className="select select-sm select-bordered w-full bg-base-100"
                >
                  <option value="custom">Custom Service / Offer</option>
                  {services?.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Plan or Custom Service Name */}
              {slug === "custom" ? (
                <div>
                  <label className="label py-1">
                    <span className="label-text text-xs font-medium">
                      Custom Service Title <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="e.g. E-commerce Website Development"
                    className="input input-sm input-bordered w-full bg-base-100"
                  />
                </div>
              ) : (
                <div>
                  <label className="label py-1">
                    <span className="label-text text-xs font-medium">
                      Select Plan <span className="text-error">*</span>
                    </span>
                  </label>
                  <select
                    value={planId}
                    onChange={(e) => setPlanId(e.target.value)}
                    className="select select-sm select-bordered w-full bg-base-100"
                  >
                    {selectedServicePlans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.planName} - ${plan.price}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Custom Service Price (BDT) */}
              {slug === "custom" && (
                <div>
                  <label className="label py-1">
                    <span className="label-text text-xs font-medium flex items-center gap-1">
                      <HiOutlineCurrencyBangladeshi className="size-3.5 text-emerald-500" />
                      Service Price (BDT) <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={servicePrice}
                    onChange={(e) => setServicePrice(e.target.value)}
                    placeholder="e.g. 15000"
                    className="input input-sm input-bordered w-full bg-base-100"
                  />
                </div>
              )}

              {/* Discount */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs font-medium">
                    Discount ({slug === "custom" ? "BDT" : "USD"})
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0"
                  className="input input-sm input-bordered w-full bg-base-100"
                />
              </div>

              {/* Payment Status */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs font-medium flex items-center gap-1">
                    <LuCreditCard className="size-3 opacity-60" /> Payment
                    Status
                  </span>
                </label>
                <select
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                  className="select select-sm select-bordered w-full bg-base-100"
                >
                  <option value="Pending">Pending (Unpaid)</option>
                  <option value="Partial">Partial (Advance Paid)</option>
                  <option value="Success">Paid in Full</option>
                </select>
              </div>

              {/* Paid / Advance Amount when not Paid in Full */}
              {payment !== "Success" && (
                <div>
                  <label className="label py-1">
                    <span className="label-text text-xs font-medium">
                      Advance / Paid Amount ({slug === "custom" ? "BDT" : "USD"}
                      )
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="input input-sm input-bordered w-full bg-base-100"
                  />
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs font-medium">
                    Payment Method
                  </span>
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="select select-sm select-bordered w-full bg-base-100"
                >
                  {PAYMENT_METHODS.map((pm) => (
                    <option key={pm.value} value={pm.value}>
                      {pm.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Deadline */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs font-medium flex items-center gap-1">
                    <LuCalendar className="size-3 opacity-60" /> Project
                    Deadline
                  </span>
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="input input-sm input-bordered w-full bg-base-100"
                />
              </div>

              {/* Project Assignment (Admin can select any member; Member can self-assign) */}
              {userRole === "admin" && assignableUsers?.length > 0 && (
                <div>
                  <label className="label py-1">
                    <span className="label-text text-xs font-medium">
                      Assign Project To (Optional)
                    </span>
                  </label>
                  <select
                    value={assignedTo}
                    onChange={(e) => {
                      setAssignedTo(e.target.value);
                      setAssignToSelf(false);
                    }}
                    className="select select-sm select-bordered w-full bg-base-100"
                  >
                    <option value="">Unassigned (Pending)</option>
                    {assignableUsers.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name || u.email} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {userRole === "member" && (
              <div className="bg-base-100 p-3 rounded-xl border border-base-300">
                <label className="label cursor-pointer justify-between py-0">
                  <div className="flex flex-col">
                    <span className="label-text font-semibold text-xs">
                      Assign this order to me
                    </span>
                    <span className="text-[11px] text-base-content/60">
                      Automatically start project in Processing status under
                      your name
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={assignToSelf}
                    onChange={(e) => setAssignToSelf(e.target.checked)}
                  />
                </label>
              </div>
            )}

            {/* Optional Internal Order Note */}
            <div>
              <label className="label py-1">
                <span className="label-text text-xs font-medium flex items-center gap-1">
                  <LuStickyNote className="size-3 text-amber-500" /> Order
                  Requirements / Internal Note (Optional)
                </span>
              </label>
              <textarea
                rows={2}
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Add any specific requirements discussed in chat..."
                className="textarea textarea-bordered textarea-xs w-full bg-base-100 rounded-xl resize-none text-xs"
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-base-300">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-sm btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={confirmMutation.isPending}
              className="btn btn-sm btn-primary gap-2 px-5"
            >
              {confirmMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  <span>Confirming...</span>
                </>
              ) : (
                <>
                  <LuPackageCheck className="size-4" />
                  <span>
                    {isExistingClient
                      ? "Confirm Order"
                      : "Confirm Order & Add Client"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmOrderModal;

