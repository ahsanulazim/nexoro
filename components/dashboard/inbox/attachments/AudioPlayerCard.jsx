"use client";
import { useState, useRef, useEffect } from "react";
import {
  LuPlay,
  LuPause,
  LuVolume2,
  LuVolumeX,
  LuMic,
  LuMusic,
  LuCircleAlert,
} from "react-icons/lu";

export default function AudioPlayerCard({ attachment, isMe }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isVoice =
    attachment.type === "voice" ||
    attachment.mimeType === "voice" ||
    (attachment.originalName && attachment.originalName.includes("voice"));

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => setHasError(true));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  if (hasError) {
    return (
      <div
        className={`flex items-center gap-2 p-2.5 rounded-xl text-xs max-w-xs ${
          isMe
            ? "bg-black/25 text-white/90"
            : "bg-base-300 text-base-content/80"
        }`}
      >
        <LuCircleAlert className="size-4 shrink-0 text-error" />
        <span className="truncate">
          Audio unavailable: {attachment.originalName || "Audio file"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`p-2.5 rounded-xl max-w-xs sm:max-w-sm flex flex-col gap-1.5 transition-colors ${
        isMe
          ? "bg-black/20 text-primary-content"
          : "bg-base-300/80 text-base-content border border-base-content/5"
      }`}
    >
      <audio
        ref={audioRef}
        src={attachment.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={() => setHasError(true)}
        preload="metadata"
        className="hidden"
      />

      {/* Header Info */}
      <div className="flex items-center justify-between text-[11px] font-medium opacity-85 px-0.5">
        <span className="flex items-center gap-1.5 truncate">
          {isVoice ? (
            <LuMic className="size-3.5 text-primary-content/90 shrink-0" />
          ) : (
            <LuMusic className="size-3.5 text-primary-content/90 shrink-0" />
          )}
          <span className="truncate max-w-[150px]">
            {isVoice ? "Voice Message" : attachment.originalName || "Audio"}
          </span>
        </span>
        <span className="font-mono text-[10px] shrink-0">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {/* Player Controls Bar */}
      <div className="flex items-center gap-2">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className={`size-8 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 ${
            isMe
              ? "bg-primary-content text-primary hover:bg-white"
              : "bg-primary text-primary-content hover:bg-primary/90"
          }`}
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? (
            <LuPause className="size-4 fill-current" />
          ) : (
            <LuPlay className="size-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Seek Bar */}
        <div className="flex-1 flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/20 accent-primary"
            aria-label="Audio timeline"
          />
        </div>

        {/* Mute Button */}
        <button
          type="button"
          onClick={toggleMute}
          className="btn btn-ghost btn-circle btn-xs text-current/80 hover:text-current"
          title={isMuted ? "Unmute" : "Mute"}
          aria-label="Toggle mute"
        >
          {isMuted ? (
            <LuVolumeX className="size-3.5" />
          ) : (
            <LuVolume2 className="size-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
