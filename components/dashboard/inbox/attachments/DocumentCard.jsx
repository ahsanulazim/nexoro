"use client";
import {
  LuDownload,
  LuFile,
  LuFileText,
  LuFileSpreadsheet,
  LuFolderArchive,
  LuFileCode,
} from "react-icons/lu";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { formatFileSize } from "@/utils/attachmentHelper";

export default function DocumentCard({ attachment, isMe }) {
  const filename = attachment.originalName || "Document";
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const size = formatFileSize(attachment.size);

  const getDocIcon = () => {
    if (ext === "pdf" || attachment.mimeType === "application/pdf") {
      return <BsFileEarmarkPdfFill className="size-6 text-red-500 shrink-0" />;
    }
    if (["doc", "docx", "odt", "rtf"].includes(ext)) {
      return <LuFileText className="size-6 text-blue-500 shrink-0" />;
    }
    if (["xls", "xlsx", "csv", "ods"].includes(ext)) {
      return <LuFileSpreadsheet className="size-6 text-emerald-500 shrink-0" />;
    }
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
      return <LuFolderArchive className="size-6 text-amber-500 shrink-0" />;
    }
    if (["json", "xml", "html", "css", "sql"].includes(ext)) {
      return <LuFileCode className="size-6 text-purple-500 shrink-0" />;
    }
    return <LuFile className="size-6 text-base-content/70 shrink-0" />;
  };

  return (
    <div
      className={`flex items-center justify-between gap-3 p-2.5 rounded-xl max-w-xs sm:max-w-sm transition-all border ${
        isMe
          ? "bg-black/15 text-primary-content border-white/10 hover:bg-black/25"
          : "bg-base-200 text-base-content border-base-300 hover:bg-base-300/80"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="size-9 rounded-lg flex items-center justify-center bg-base-100/40 shrink-0">
          {getDocIcon()}
        </div>
        <div className="min-w-0 flex flex-col">
          <span
            className="text-xs font-medium truncate max-w-[170px] sm:max-w-[190px]"
            title={filename}
          >
            {filename}
          </span>
          {size && (
            <span className="text-[10px] opacity-70 font-mono">
              {size}
            </span>
          )}
        </div>
      </div>

      <a
        href={attachment.url}
        download={filename}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn btn-circle btn-xs shrink-0 ${
          isMe
            ? "btn-ghost text-primary-content hover:bg-white/20"
            : "btn-ghost text-base-content hover:bg-base-300"
        }`}
        title={`Download ${filename}`}
        aria-label={`Download ${filename}`}
      >
        <LuDownload className="size-3.5" />
      </a>
    </div>
  );
}
