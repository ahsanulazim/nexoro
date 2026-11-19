"use client";
import { useState } from "react";
import { LuPlay, LuVideoOff, LuFilm } from "react-icons/lu";

export default function VideoCard({ attachment, onOpenModal, isMe }) {
  const [hasError, setHasError] = useState(false);
  const [isPlayingInline, setIsPlayingInline] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex items-center gap-2 p-3 rounded-xl text-xs max-w-xs ${
          isMe
            ? "bg-black/25 text-white/90"
            : "bg-base-300 text-base-content/80"
        }`}
      >
        <LuVideoOff className="size-5 shrink-0 text-error" />
        <span className="truncate">
          Video unavailable or format unsupported
        </span>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden max-w-xs sm:max-w-sm group border border-black/10 dark:border-white/10 shadow-sm bg-black/40">
      {isPlayingInline ? (
        <video
          controls
          autoPlay
          src={attachment.url}
          className="w-full max-h-64 rounded-xl object-contain bg-black"
          onError={() => setHasError(true)}
        />
      ) : (
        <div
          onClick={() => {
            if (onOpenModal) {
              onOpenModal(attachment);
            } else {
              setIsPlayingInline(true);
            }
          }}
          className="relative cursor-pointer aspect-video w-full flex items-center justify-center bg-black/60 overflow-hidden"
        >
          {attachment.thumbnailUrl ? (
            <img
              src={attachment.thumbnailUrl}
              alt={attachment.originalName || "Video thumbnail"}
              className="absolute inset-0 size-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <LuFilm className="size-10 text-white/30" />
          )}

          {/* Dark scrim overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

          {/* Central Play Button */}
          <div className="relative z-10 size-11 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <LuPlay className="size-5 ml-0.5 fill-current" />
          </div>

          {/* Duration Badge & Filename */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/90 z-10 pointer-events-none">
            <span className="truncate max-w-[180px] font-medium drop-shadow-sm">
              {attachment.originalName || "Video"}
            </span>
            {attachment.duration && (
              <span className="px-1.5 py-0.5 rounded bg-black/70 font-mono text-[10px]">
                {attachment.duration}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
