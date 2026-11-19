"use client";
import {
  LuX,
  LuFile,
  LuAlertCircle,
  LuRotateCcw,
  LuCheck,
  LuFilm,
  LuMusic,
} from "react-icons/lu";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { formatFileSize } from "@/utils/attachmentHelper";

/**
 * Preview bar above composer for selected attachments awaiting send.
 * Shows thumbnail/icon, filename, size, upload progress ring/bar, and remove/retry buttons.
 */
export default function AttachmentComposerPreview({
  stagedFiles = [],
  onRemove = () => {},
  onRetry = () => {},
}) {
  if (!stagedFiles || stagedFiles.length === 0) return null;

  const renderIconOrThumb = (item) => {
    if (item.category === "image" && item.localPreviewUrl) {
      return (
        <img
          src={item.localPreviewUrl}
          alt={item.name}
          className="size-full object-cover"
        />
      );
    }
    if (item.category === "video") {
      return <LuFilm className="size-5 text-purple-400" />;
    }
    if (item.category === "audio") {
      return <LuMusic className="size-5 text-emerald-400" />;
    }
    if (item.name?.toLowerCase().endsWith(".pdf")) {
      return <BsFileEarmarkPdfFill className="size-5 text-red-400" />;
    }
    return <LuFile className="size-5 text-base-content/70" />;
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
      {stagedFiles.map((item) => {
        const isError = item.status === "error";
        const isUploading = item.status === "uploading";
        const isReady = item.status === "ready";

        return (
          <div
            key={item.id}
            className={`relative flex items-center gap-2 p-1.5 pl-2 pr-1.5 rounded-xl border text-xs shrink-0 max-w-[210px] sm:max-w-60 transition-all ${
              isError
                ? "bg-error/10 border-error/30 text-error"
                : isReady
                  ? "bg-base-200/90 border-success/30 text-base-content"
                  : "bg-base-200 border-base-300 text-base-content"
            }`}
          >
            {/* Thumbnail / Icon container */}
            <div className="size-9 rounded-lg overflow-hidden bg-base-300/80 shrink-0 flex items-center justify-center relative">
              {renderIconOrThumb(item)}

              {/* Uploading progress spinner overlay */}
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                  <span className="loading loading-spinner loading-xs text-primary"></span>
                </div>
              )}

              {/* Ready checkmark badge */}
              {isReady && (
                <div className="absolute bottom-0 right-0 size-3.5 bg-success text-success-content rounded-tl-md flex items-center justify-center">
                  <LuCheck className="size-2.5 stroke-3" />
                </div>
              )}
            </div>

            {/* Filename & size / status */}
            <div className="min-w-0 flex-1 flex flex-col">
              <span
                className="truncate font-medium text-[11px]"
                title={item.name}
              >
                {item.name}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] opacity-75">
                <span>{formatFileSize(item.size)}</span>
                {isUploading && (
                  <span className="text-info font-mono">
                    {item.progress || 0}%
                  </span>
                )}
                {isError && (
                  <span
                    className="text-error font-medium truncate"
                    title={item.errorMessage}
                  >
                    Failed
                  </span>
                )}
              </div>
            </div>

            {/* Actions: Retry or Remove */}
            <div className="flex items-center gap-0.5 shrink-0 ml-1">
              {isError && (
                <button
                  type="button"
                  onClick={() => onRetry(item.id)}
                  className="btn btn-ghost btn-circle btn-xs text-error hover:bg-error/20"
                  title="Retry upload"
                  aria-label="Retry upload"
                >
                  <LuRotateCcw className="size-3" />
                </button>
              )}
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="btn btn-ghost btn-circle btn-xs text-base-content/60 hover:text-error hover:bg-base-300"
                title="Remove attachment"
                aria-label="Remove attachment"
              >
                <LuX className="size-3.5" />
              </button>
            </div>

            {/* Progress bar line for uploading item */}
            {isUploading && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-base-300 overflow-hidden rounded-b-xl">
                <div
                  className="h-full bg-info transition-all duration-150"
                  style={{ width: `${item.progress || 0}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
