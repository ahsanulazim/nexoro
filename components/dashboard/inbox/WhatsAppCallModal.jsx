"use client";

import { useWhatsAppCall } from "@/context/WhatsAppCallContext";
import {
  LuPhone,
  LuPhoneCall,
  LuPhoneOff,
  LuMic,
  LuMicOff,
  LuExternalLink,
  LuTriangleAlert,
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa6";
import { getAvatarColor, getInitials } from "@/utils/messageGrouping";

const formatDuration = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export default function WhatsAppCallModal() {
  const {
    callState,
    activeCall,
    isMuted,
    callDuration,
    callError,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    openWhatsAppAppFallback,
  } = useWhatsAppCall();

  if (callState === "idle") return null;

  const displayName =
    activeCall?.customerName ||
    (activeCall?.phoneNumber
      ? `+${activeCall.phoneNumber}`
      : "WhatsApp Contact");
  const displayPhone = activeCall?.phoneNumber
    ? `+${String(activeCall.phoneNumber).replace(/[^0-9]/g, "")}`
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl bg-base-100 border border-base-200 shadow-2xl overflow-hidden p-6 text-center">
        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-6">
          <FaWhatsapp className="size-3.5" />
          <span>WhatsApp Voice Call</span>
        </div>

        {/* Caller Avatar with Animated Rings */}
        <div className="relative mx-auto size-24 mb-4 flex items-center justify-center">
          {callState === "incoming" && (
            <>
              <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
              <span className="absolute -inset-2 rounded-full border-2 border-emerald-500/40 animate-pulse" />
            </>
          )}

          {callState === "outgoing" && (
            <span className="absolute -inset-2 rounded-full border-2 border-primary/40 animate-pulse" />
          )}

          {callState === "connected" && (
            <span className="absolute -inset-1 rounded-full border-2 border-emerald-500/50" />
          )}

          <div
            className={`relative size-20 rounded-full flex items-center justify-center font-bold text-xl uppercase shadow-md border-2 border-base-100 ${getAvatarColor(
              displayName,
            )}`}
          >
            {getInitials(displayName)}
          </div>
        </div>

        {/* User Details */}
        <h3 className="font-bold text-lg text-base-content line-clamp-1">
          {displayName}
        </h3>
        {displayPhone && (
          <p className="text-xs text-base-content/60 mt-0.5 font-mono">
            {displayPhone}
          </p>
        )}

        {/* Status / Timer */}
        <div className="my-4 min-h-6 flex items-center justify-center">
          {callState === "incoming" && (
            <p className="text-sm font-medium text-emerald-500 animate-pulse">
              Incoming WhatsApp Call...
            </p>
          )}

          {callState === "outgoing" && !callError && (
            <p className="text-sm font-medium text-primary animate-pulse">
              Calling via WhatsApp Cloud API...
            </p>
          )}

          {callState === "connected" && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 font-mono text-sm font-bold border border-emerald-500/20">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{formatDuration(callDuration)}</span>
            </div>
          )}

          {callState === "ended" && (
            <p className="text-sm font-medium text-base-content/60">
              Call Ended
            </p>
          )}
        </div>

        {/* Error Alert Box & Fallback Action */}
        {callError && (
          <div className="mb-5 p-3 rounded-xl bg-error/10 border border-error/25 text-left text-xs text-error space-y-2">
            <div className="flex items-start gap-2">
              <LuTriangleAlert className="size-4 shrink-0 mt-0.5" />
              <p className="leading-snug">{callError}</p>
            </div>
            <button
              type="button"
              onClick={() => openWhatsAppAppFallback(activeCall?.phoneNumber)}
              className="btn btn-sm btn-outline btn-error w-full gap-2 rounded-lg"
            >
              <FaWhatsapp className="size-4 text-emerald-500" />
              <span>Call via WhatsApp App / Web</span>
              <LuExternalLink className="size-3" />
            </button>
          </div>
        )}

        {/* Call Actions Control Buttons */}
        <div className="flex items-center justify-center gap-4 mt-2">
          {callState === "incoming" && (
            <>
              {/* Reject */}
              <button
                type="button"
                onClick={rejectCall}
                className="btn btn-circle btn-error size-14 shadow-lg text-white"
                title="Decline Call"
              >
                <LuPhoneOff className="size-6" />
              </button>

              {/* Accept */}
              <button
                type="button"
                onClick={acceptCall}
                className="btn btn-circle btn-success size-14 shadow-lg text-white"
                title="Accept Call"
              >
                <LuPhoneCall className="size-6" />
              </button>
            </>
          )}

          {callState === "outgoing" && (
            <button
              type="button"
              onClick={endCall}
              className="btn btn-circle btn-error size-14 shadow-lg text-white"
              title="Cancel Call"
            >
              <LuPhoneOff className="size-6" />
            </button>
          )}

          {callState === "connected" && (
            <>
              {/* Mute Button */}
              <button
                type="button"
                onClick={toggleMute}
                className={`btn btn-circle size-12 shadow ${
                  isMuted ? "btn-warning text-white" : "btn-neutral"
                }`}
                title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
              >
                {isMuted ? (
                  <LuMicOff className="size-5" />
                ) : (
                  <LuMic className="size-5" />
                )}
              </button>

              {/* End Call Button */}
              <button
                type="button"
                onClick={endCall}
                className="btn btn-circle btn-error size-14 shadow-lg text-white"
                title="End Call"
              >
                <LuPhoneOff className="size-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
