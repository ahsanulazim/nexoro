"use client";
import { useState } from "react";
import { LuImageOff } from "react-icons/lu";

export default function ImageGrid({ images = [], onSelectImage }) {
  const [loadedMap, setLoadedMap] = useState({});
  const [errorMap, setErrorMap] = useState({});

  if (!images || images.length === 0) return null;

  const count = images.length;
  const visibleImages = count > 4 ? images.slice(0, 4) : images;
  const remainingCount = count > 4 ? count - 3 : 0;

  const handleImageLoad = (idx) => {
    setLoadedMap((prev) => ({ ...prev, [idx]: true }));
  };

  const handleImageError = (idx) => {
    setErrorMap((prev) => ({ ...prev, [idx]: true }));
  };

  // 1 single image
  if (count === 1) {
    const img = images[0];
    const isLoaded = loadedMap[0];
    const isError = errorMap[0];

    return (
      <div className="relative rounded-2xl overflow-hidden max-w-xs sm:max-w-sm bg-base-300/40 border border-black/5 dark:border-white/5 shadow-2xs group">
        {!isLoaded && !isError && (
          <div className="aspect-[4/3] w-full bg-base-300 animate-pulse flex items-center justify-center text-xs opacity-50" />
        )}
        {isError ? (
          <div className="aspect-[4/3] w-full flex flex-col items-center justify-center gap-1.5 p-4 bg-base-300/60 text-base-content/60 text-xs">
            <LuImageOff className="size-6 text-error/70" />
            <span>Image failed to load</span>
          </div>
        ) : (
          <img
            src={img.thumbnailUrl || img.url}
            alt={img.originalName || "Chat photo"}
            loading="lazy"
            onLoad={() => handleImageLoad(0)}
            onError={() => handleImageError(0)}
            onClick={() => onSelectImage?.(0)}
            className={`w-full max-h-80 object-cover cursor-pointer transition-all duration-200 group-hover:opacity-95 ${
              isLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
            }`}
          />
        )}
      </div>
    );
  }

  // 2 images: side-by-side
  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden max-w-xs sm:max-w-sm shadow-2xs border border-black/5 dark:border-white/5 bg-base-300/30">
        {images.map((img, idx) => (
          <div
            key={img.id || idx}
            onClick={() => onSelectImage?.(idx)}
            className="relative aspect-square cursor-pointer overflow-hidden group bg-base-300/60"
          >
            {!loadedMap[idx] && !errorMap[idx] && (
              <div className="absolute inset-0 bg-base-300 animate-pulse" />
            )}
            {errorMap[idx] ? (
              <div className="absolute inset-0 flex items-center justify-center bg-base-300/70 text-error">
                <LuImageOff className="size-5" />
              </div>
            ) : (
              <img
                src={img.thumbnailUrl || img.url}
                alt={img.originalName || `Chat photo ${idx + 1}`}
                loading="lazy"
                onLoad={() => handleImageLoad(idx)}
                onError={() => handleImageError(idx)}
                className="size-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  // 3 images: 1 top spanning full width, 2 bottom side-by-side
  if (count === 3) {
    return (
      <div className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden max-w-xs sm:max-w-sm shadow-2xs border border-black/5 dark:border-white/5 bg-base-300/30">
        {/* Top full-width image */}
        <div
          onClick={() => onSelectImage?.(0)}
          className="col-span-2 relative aspect-[16/9] cursor-pointer overflow-hidden group bg-base-300/60"
        >
          {!loadedMap[0] && !errorMap[0] && (
            <div className="absolute inset-0 bg-base-300 animate-pulse" />
          )}
          {errorMap[0] ? (
            <div className="absolute inset-0 flex items-center justify-center bg-base-300/70 text-error">
              <LuImageOff className="size-5" />
            </div>
          ) : (
            <img
              src={images[0].thumbnailUrl || images[0].url}
              alt={images[0].originalName || "Chat photo 1"}
              loading="lazy"
              onLoad={() => handleImageLoad(0)}
              onError={() => handleImageError(0)}
              className="size-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          )}
        </div>

        {/* 2 bottom images */}
        {images.slice(1, 3).map((img, i) => {
          const idx = i + 1;
          return (
            <div
              key={img.id || idx}
              onClick={() => onSelectImage?.(idx)}
              className="relative aspect-square cursor-pointer overflow-hidden group bg-base-300/60"
            >
              {!loadedMap[idx] && !errorMap[idx] && (
                <div className="absolute inset-0 bg-base-300 animate-pulse" />
              )}
              {errorMap[idx] ? (
                <div className="absolute inset-0 flex items-center justify-center bg-base-300/70 text-error">
                  <LuImageOff className="size-5" />
                </div>
              ) : (
                <img
                  src={img.thumbnailUrl || img.url}
                  alt={img.originalName || `Chat photo ${idx + 1}`}
                  loading="lazy"
                  onLoad={() => handleImageLoad(idx)}
                  onError={() => handleImageError(idx)}
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // 4 or 5+ images: 2x2 grid with +N remaining overlay on the 4th item
  return (
    <div className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden max-w-xs sm:max-w-sm shadow-2xs border border-black/5 dark:border-white/5 bg-base-300/30">
      {visibleImages.map((img, idx) => {
        const isFourthWithOverlay = idx === 3 && remainingCount > 0;

        return (
          <div
            key={img.id || idx}
            onClick={() => onSelectImage?.(idx)}
            className="relative aspect-square cursor-pointer overflow-hidden group bg-base-300/60"
          >
            {!loadedMap[idx] && !errorMap[idx] && (
              <div className="absolute inset-0 bg-base-300 animate-pulse" />
            )}
            {errorMap[idx] ? (
              <div className="absolute inset-0 flex items-center justify-center bg-base-300/70 text-error">
                <LuImageOff className="size-5" />
              </div>
            ) : (
              <img
                src={img.thumbnailUrl || img.url}
                alt={img.originalName || `Chat photo ${idx + 1}`}
                loading="lazy"
                onLoad={() => handleImageLoad(idx)}
                onError={() => handleImageError(idx)}
                className="size-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            )}

            {/* Remaining Count Overlay (Facebook Messenger style) */}
            {isFourthWithOverlay && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-white font-bold text-xl sm:text-2xl transition-all group-hover:bg-black/70">
                +{remainingCount}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
