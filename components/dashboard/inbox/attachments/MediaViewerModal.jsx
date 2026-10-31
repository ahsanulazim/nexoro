"use client";
import { useEffect, useState, useCallback } from "react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuDownload,
  LuMaximize,
  LuMinimize,
  LuX,
  LuZoomIn,
  LuZoomOut,
} from "react-icons/lu";

/**
 * Fullscreen / modal media viewer lightbox for images and videos with
 * keyboard navigation, zoom, previous/next controls, and download action.
 */
export default function MediaViewerModal({
  items = [],
  initialIndex = 0,
  isOpen = false,
  onClose = () => {},
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoomLevel(1);
    }
  }, [isOpen, initialIndex]);

  const currentItem = items[currentIndex] || null;

  const handleNext = useCallback(() => {
    if (items.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setZoomLevel(1);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    if (items.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setZoomLevel(1);
  }, [items.length]);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-") {
        handleZoomOut();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || !currentItem) return null;

  const isVideo =
    currentItem.category === "video" ||
    currentItem.type?.startsWith("video/") ||
    (currentItem.mimeType && currentItem.mimeType.startsWith("video/"));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Media Lightbox Viewer"
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md text-white select-none transition-all duration-200"
    >
      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/40 border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-medium text-white/80">
            {currentIndex + 1} of {items.length}
          </span>
          <span className="text-xs text-white/50 hidden sm:inline truncate max-w-xs md:max-w-md">
            {currentItem.originalName || "Media preview"}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {!isVideo && (
            <>
              <button
                type="button"
                onClick={handleZoomIn}
                className="btn btn-ghost btn-circle btn-sm text-white/80 hover:text-white hover:bg-white/10"
                title="Zoom in (+)"
                aria-label="Zoom in"
              >
                <LuZoomIn className="size-4" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="btn btn-ghost btn-circle btn-sm text-white/80 hover:text-white hover:bg-white/10"
                title="Zoom out (-)"
                aria-label="Zoom out"
              >
                <LuZoomOut className="size-4" />
              </button>
              {zoomLevel !== 1 && (
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="px-2 py-0.5 rounded text-xs bg-white/10 hover:bg-white/20 text-white/90"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
              )}
            </>
          )}

          <a
            href={currentItem.url}
            download={currentItem.originalName || "download"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-circle btn-sm text-white/80 hover:text-white hover:bg-white/10"
            title="Download original file"
            aria-label="Download media"
          >
            <LuDownload className="size-4" />
          </a>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="btn btn-ghost btn-circle btn-sm text-white/80 hover:text-white hover:bg-white/10 hidden sm:flex"
            title="Toggle fullscreen"
            aria-label="Fullscreen"
          >
            {isFullscreen ? (
              <LuMinimize className="size-4" />
            ) : (
              <LuMaximize className="size-4" />
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-circle btn-sm bg-white/10 hover:bg-white/20 text-white border-0 ml-1"
            title="Close (Esc)"
            aria-label="Close viewer"
          >
            <LuX className="size-5" />
          </button>
        </div>
      </div>

      {/* Main Media Container */}
      <div className="flex-1 relative flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* Previous Button */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 btn btn-circle btn-neutral bg-black/60 hover:bg-black/90 text-white border-white/20 shadow-xl"
            title="Previous (Left Arrow)"
            aria-label="Previous image"
          >
            <LuChevronLeft className="size-6" />
          </button>
        )}

        {/* Media Item */}
        <div className="relative max-w-full max-h-full flex items-center justify-center">
          {isVideo ? (
            <video
              controls
              autoPlay
              src={currentItem.url}
              className="max-h-[82vh] max-w-[92vw] rounded-lg shadow-2xl object-contain"
            />
          ) : (
            <img
              src={currentItem.url}
              alt={currentItem.originalName || "Image preview"}
              style={{
                transform: `scale(${zoomLevel})`,
                transition: "transform 0.15s ease-out",
              }}
              className="max-h-[82vh] max-w-[92vw] object-contain rounded-md shadow-2xl select-none cursor-grab active:cursor-grabbing"
              onError={(e) => {
                e.currentTarget.alt = "Failed to load image preview";
              }}
            />
          )}
        </div>

        {/* Next Button */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 btn btn-circle btn-neutral bg-black/60 hover:bg-black/90 text-white border-white/20 shadow-xl"
            title="Next (Right Arrow)"
            aria-label="Next image"
          >
            <LuChevronRight className="size-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip for Multi-media collections */}
      {items.length > 1 && (
        <div className="py-2.5 px-4 bg-black/50 border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto max-w-full">
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCurrentIndex(idx);
                setZoomLevel(1);
              }}
              className={`relative size-12 sm:size-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                idx === currentIndex
                  ? "border-primary scale-105 shadow-md"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={item.thumbnailUrl || item.url}
                alt={`Thumbnail ${idx + 1}`}
                className="size-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
