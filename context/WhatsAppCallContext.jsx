"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import api from "@/axios/axiosInstance";
import { useSocket } from "./SocketProvider";
import { toast } from "react-toastify";

const WhatsAppCallContext = createContext();

export const useWhatsAppCall = () => {
  const context = useContext(WhatsAppCallContext);
  if (!context) {
    throw new Error(
      "useWhatsAppCall must be used within a WhatsAppCallProvider"
    );
  }
  return context;
};

// Standard WebRTC ICE STUN configuration
const RTC_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

/**
 * Web Audio Tone Generator for realistic phone ringback and incoming ring tones
 */
class ToneGenerator {
  constructor() {
    this.ctx = null;
    this.intervalId = null;
    this.activeNodes = [];
  }

  ensureContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.activeNodes.forEach((node) => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
  }

  // Dual-frequency incoming phone ring (440Hz + 480Hz)
  playIncomingRing() {
    this.stop();
    const ctx = this.ensureContext();
    if (!ctx) return;

    const playBurst = () => {
      try {
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.frequency.setValueAtTime(440, now);
        osc2.frequency.setValueAtTime(480, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
        gain.gain.setValueAtTime(0.15, now + 1.8);
        gain.gain.linearRampToValueAtTime(0, now + 2.0);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 2.0);
        osc2.stop(now + 2.0);

        this.activeNodes.push(osc1, osc2);
      } catch (e) {}
    };

    playBurst();
    this.intervalId = setInterval(playBurst, 4000);
  }

  // Dialing tone (outbound ringback)
  playRingback() {
    this.stop();
    const ctx = this.ensureContext();
    if (!ctx) return;

    const playBurst = () => {
      try {
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.frequency.setValueAtTime(440, now);
        osc2.frequency.setValueAtTime(480, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
        gain.gain.setValueAtTime(0.08, now + 1.2);
        gain.gain.linearRampToValueAtTime(0, now + 1.4);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.4);
        osc2.stop(now + 1.4);

        this.activeNodes.push(osc1, osc2);
      } catch (e) {}
    };

    playBurst();
    this.intervalId = setInterval(playBurst, 3500);
  }

  // End tone beep
  playEndBeep() {
    this.stop();
    const ctx = this.ensureContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.3);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }
}

const toneGen = new ToneGenerator();

export const WhatsAppCallProvider = ({ children }) => {
  const { socket } = useSocket();

  // Call states: "idle" | "incoming" | "outgoing" | "connected" | "ended"
  const [callState, setCallState] = useState("idle");
  const [activeCall, setActiveCall] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callError, setCallError] = useState(null);

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const durationTimerRef = useRef(null);

  // Helper to wait for WebRTC ICE candidates gathering to complete for full RFC 8866 SDP
  const waitForIceGathering = (pc) => {
    if (pc.iceGatheringState === "complete") return Promise.resolve();
    return new Promise((resolve) => {
      let resolved = false;
      const checkState = () => {
        if (pc.iceGatheringState === "complete" && !resolved) {
          resolved = true;
          pc.removeEventListener("icegatheringstatechange", checkState);
          resolve();
        }
      };
      pc.addEventListener("icegatheringstatechange", checkState);
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          pc.removeEventListener("icegatheringstatechange", checkState);
          resolve();
        }
      }, 2000);
    });
  };

  // Cleanup helper
  const cleanupMediaAndConnection = useCallback(() => {
    toneGen.stop();

    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (pcRef.current) {
      try {
        pcRef.current.close();
      } catch (e) {}
      pcRef.current = null;
    }

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }

    setIsMuted(false);
  }, []);

  // Timer runner for connected calls
  useEffect(() => {
    if (callState === "connected") {
      durationTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
  }, [callState]);

  // Handle incoming call events from Socket.IO
  useEffect(() => {
    if (!socket) return;

    // 1. Inbound Call Event from Meta Webhook
    const handleIncomingCall = (data) => {
      console.log("[WhatsAppCallContext] Incoming call received:", data);
      toneGen.playIncomingRing();

      setActiveCall({
        callId: data.callId,
        phoneNumber: data.from,
        customerName: data.customerName || "WhatsApp Caller",
        roomId: data.roomId,
        sdpOffer: data.sdpOffer,
        direction: "incoming",
      });
      setCallError(null);
      setCallState("incoming");
    };

    // 2. Outbound Call Connected (Meta received SDP answer from callee)
    const handleCallConnected = async (data) => {
      console.log("[WhatsAppCallContext] Outbound call connected:", data);
      toneGen.stop();

      if (pcRef.current && data.sdpAnswer) {
        try {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription({
              type: data.sdpType || "answer",
              sdp: data.sdpAnswer,
            })
          );
          setCallState("connected");
        } catch (err) {
          console.error("Failed to set remote answer SDP:", err);
          setCallError("Failed to establish audio connection.");
        }
      }
    };

    // 3. Call Terminated / Missed / Hang up
    const handleCallTerminated = (data) => {
      console.log("[WhatsAppCallContext] Call terminated:", data);
      toneGen.playEndBeep();
      setCallState("ended");
      setTimeout(() => {
        cleanupMediaAndConnection();
        setCallState("idle");
        setActiveCall(null);
        setCallDuration(0);
      }, 1800);
    };

    socket.on("whatsapp:incoming_call", handleIncomingCall);
    socket.on("whatsapp:call_connected", handleCallConnected);
    socket.on("whatsapp:call_terminated", handleCallTerminated);

    return () => {
      socket.off("whatsapp:incoming_call", handleIncomingCall);
      socket.off("whatsapp:call_connected", handleCallConnected);
      socket.off("whatsapp:call_terminated", handleCallTerminated);
    };
  }, [socket, cleanupMediaAndConnection]);

  // Initiate an Outbound Call
  const startCall = async ({ phoneNumber, customerName, roomId }) => {
    try {
      const cleanDigits = String(phoneNumber || "").replace(/[^0-9]/g, "");
      if (!cleanDigits || cleanDigits.length < 7) {
        toast.error("Valid customer phone number is required to make a call.");
        return;
      }

      cleanupMediaAndConnection();
      setCallError(null);
      setCallDuration(0);

      setActiveCall({
        phoneNumber: cleanDigits,
        customerName: customerName || `+${cleanDigits}`,
        roomId,
        direction: "outgoing",
      });
      setCallState("outgoing");
      toneGen.playRingback();

      // 1. Acquire microphone
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      } catch (micErr) {
        toneGen.stop();
        setCallError(
          "Microphone access denied. Please allow microphone permissions in your browser."
        );
        return;
      }
      localStreamRef.current = stream;

      // 2. Setup RTCPeerConnection
      const pc = new RTCPeerConnection(RTC_CONFIG);
      pcRef.current = pc;

      // Add local audio track
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Handle remote incoming audio track
      pc.ontrack = (event) => {
        if (remoteAudioRef.current && event.streams[0]) {
          remoteAudioRef.current.srcObject = event.streams[0];
          remoteAudioRef.current
            .play()
            .catch((e) => console.warn("Autoplay remote audio blocked:", e));
        }
      };

      // 3. Create WebRTC Offer
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
      });
      await pc.setLocalDescription(offer);

      // Wait for complete ICE gathering
      await waitForIceGathering(pc);

      const offerSdp = pc.localDescription?.sdp || offer.sdp;

      // 4. Send request to backend
      const res = await api.post("/whatsapp/calls/initiate", {
        to: cleanDigits,
        offerSdp,
        roomId,
      });

      if (res.data?.success && res.data?.callId) {
        setActiveCall((prev) => ({
          ...prev,
          callId: res.data.callId,
        }));
      }
    } catch (err) {
      toneGen.stop();
      const errorData = err.response?.data;
      const code = errorData?.code;
      const subcode = errorData?.subcode;
      const details =
        errorData?.details ||
        errorData?.message ||
        err?.message ||
        "Unknown error initiating call";

      console.error("Initiate call error details:", {
        message: details,
        code,
        subcode,
        status: err.response?.status,
        errorData,
      });

      let userMsg = details;
      if (
        code === 138000 ||
        code === 138015 ||
        subcode === 2593051 ||
        subcode === 2593145
      ) {
        userMsg =
          "WhatsApp Cloud API Calling is not activated yet on this number. Meta requires a 2,000+ daily conversations Messaging Limit (Tier 2) to enable in-browser calling. You can call directly via WhatsApp below.";
      } else if (code === 138006) {
        userMsg =
          "Customer permission required: WhatsApp requires an active customer chat before making outgoing calls.";
      } else if (err.code === "ERR_NETWORK" || !err.response) {
        userMsg =
          "Unable to connect to Nexoro backend server. Please verify the backend server is running.";
      }

      setCallError(userMsg);
    }
  };

  // Accept an Inbound Call
  const acceptCall = async () => {
    if (!activeCall?.callId || !activeCall?.sdpOffer) {
      toast.error("No active incoming call SDP offer found.");
      return;
    }

    try {
      toneGen.stop();

      // 1. Acquire mic
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      } catch (micErr) {
        setCallError("Microphone permission required to accept the call.");
        return;
      }
      localStreamRef.current = stream;

      // 2. Setup RTCPeerConnection
      const pc = new RTCPeerConnection(RTC_CONFIG);
      pcRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteAudioRef.current && event.streams[0]) {
          remoteAudioRef.current.srcObject = event.streams[0];
          remoteAudioRef.current
            .play()
            .catch((e) => console.warn("Autoplay remote audio blocked:", e));
        }
      };

      // 3. Set Remote Description (SDP Offer from WhatsApp user)
      await pc.setRemoteDescription(
        new RTCSessionDescription({
          type: activeCall.sdpType || "offer",
          sdp: activeCall.sdpOffer,
        })
      );

      // 4. Create Answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Wait for ICE candidates gathering
      await waitForIceGathering(pc);

      const answerSdp = pc.localDescription?.sdp || answer.sdp;

      // 5. Send accept request to Meta via backend
      await api.post(`/whatsapp/calls/${activeCall.callId}/accept`, {
        answerSdp,
      });

      setCallState("connected");
    } catch (err) {
      console.error("Accept call error:", err);
      setCallError(
        err.response?.data?.details ||
          err.response?.data?.message ||
          "Failed to accept call."
      );
    }
  };

  // Reject an Inbound Call
  const rejectCall = async () => {
    toneGen.stop();
    const callId = activeCall?.callId;
    cleanupMediaAndConnection();
    setCallState("idle");
    setActiveCall(null);

    if (callId) {
      try {
        await api.post(`/whatsapp/calls/${callId}/reject`);
      } catch (err) {
        console.warn("Reject call API error:", err.message);
      }
    }
  };

  // End an Active or Outbound Call
  const endCall = async () => {
    toneGen.playEndBeep();
    const callId = activeCall?.callId;
    cleanupMediaAndConnection();
    setCallState("ended");

    setTimeout(() => {
      setCallState("idle");
      setActiveCall(null);
      setCallDuration(0);
      setCallError(null);
    }, 1200);

    if (callId) {
      try {
        await api.post(`/whatsapp/calls/${callId}/terminate`);
      } catch (err) {
        console.warn("Terminate call API error:", err.message);
      }
    }
  };

  // Toggle Microphone Mute
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const nextState = !audioTracks[0].enabled;
        audioTracks[0].enabled = nextState;
        setIsMuted(!nextState);
      }
    }
  };

  // One-click fallback: Launch WhatsApp Desktop / App
  const openWhatsAppAppFallback = (phone) => {
    const rawNumber = String(phone || activeCall?.phoneNumber || "").replace(
      /[^0-9]/g,
      ""
    );
    if (rawNumber) {
      window.open(`https://wa.me/${rawNumber}`, "_blank");
    }
  };

  return (
    <WhatsAppCallContext.Provider
      value={{
        callState,
        activeCall,
        isMuted,
        callDuration,
        callError,
        remoteAudioRef,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        openWhatsAppAppFallback,
      }}
    >
      {children}
      {/* Hidden audio element for receiving WebRTC remote media stream */}
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />
    </WhatsAppCallContext.Provider>
  );
};
