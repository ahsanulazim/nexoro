/**
 * Helpers for Facebook Messenger-style chat attachment handling.
 */

export const FILE_CATEGORIES = {
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
  DOCUMENT: "document",
};

export const DISALLOWED_EXTENSIONS = [
  "exe", "bat", "cmd", "sh", "php", "js", "vbs", "msi", "jar", "apk", "com", "scr", "pif", "application", "gadget"
];

export const CHANNEL_LIMITS = {
  web: {
    maxFilesPerMessage: 10,
    maxImageSize: 10 * 1024 * 1024, // 10MB
    maxVideoSize: 50 * 1024 * 1024, // 50MB
    maxAudioSize: 25 * 1024 * 1024, // 25MB
    maxDocSize: 25 * 1024 * 1024,   // 25MB
  },
  facebook: {
    maxFilesPerMessage: 10,
    maxImageSize: 10 * 1024 * 1024,
    maxVideoSize: 25 * 1024 * 1024,
    maxAudioSize: 25 * 1024 * 1024,
    maxDocSize: 25 * 1024 * 1024,
  },
  instagram: {
    maxFilesPerMessage: 10,
    maxImageSize: 8 * 1024 * 1024,
    maxVideoSize: 25 * 1024 * 1024,
    maxAudioSize: 25 * 1024 * 1024,
    maxDocSize: 25 * 1024 * 1024,
  },
  whatsapp: {
    maxFilesPerMessage: 10,
    maxImageSize: 5 * 1024 * 1024,
    maxVideoSize: 16 * 1024 * 1024,
    maxAudioSize: 16 * 1024 * 1024,
    maxDocSize: 100 * 1024 * 1024,
  },
};

/**
 * Categorizes an attachment or file into 'image', 'video', 'audio', or 'document'.
 */
export const categorizeAttachment = (mimeType = "", filename = "", url = "") => {
  const mime = (mimeType || "").toLowerCase();
  const name = (filename || url || "").toLowerCase();
  const ext = name.split("?")[0].split("#")[0].split(".").pop() || "";

  if (
    mime.startsWith("image/") ||
    ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico", "avif"].includes(ext)
  ) {
    return FILE_CATEGORIES.IMAGE;
  }

  if (
    mime.startsWith("video/") ||
    ["mp4", "webm", "mov", "mkv", "avi", "m4v", "flv"].includes(ext)
  ) {
    return FILE_CATEGORIES.VIDEO;
  }

  if (
    mime.startsWith("audio/") ||
    mime === "voice" ||
    ["mp3", "wav", "ogg", "m4a", "aac", "flac", "weba", "opus"].includes(ext)
  ) {
    return FILE_CATEGORIES.AUDIO;
  }

  return FILE_CATEGORIES.DOCUMENT;
};

/**
 * Format bytes into human-readable string (e.g. 1.2 MB)
 */
export const formatFileSize = (bytes) => {
  if (bytes === null || bytes === undefined || isNaN(bytes)) return "";
  const num = Number(bytes);
  if (num === 0) return "0 B";
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  if (num < 1024 * 1024 * 1024) return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  return `${(num / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

/**
 * Checks if a file has an executable or unsafe extension.
 */
export const isUnsafeExtension = (filename = "") => {
  if (!filename) return false;
  const clean = filename.toLowerCase().split("?")[0].split("#")[0];
  const parts = clean.split(".");
  if (parts.length <= 1) return false;
  const ext = parts.pop();
  return DISALLOWED_EXTENSIONS.includes(ext);
};

/**
 * Validates a single file before upload.
 */
export const validateFile = (file, channel = "web") => {
  if (!file) return { valid: false, error: "No file provided" };

  const filename = file.name || "";
  if (isUnsafeExtension(filename)) {
    return {
      valid: false,
      error: `File type (.${filename.split(".").pop()}) is executable and not permitted for security.`,
    };
  }

  const limits = CHANNEL_LIMITS[channel] || CHANNEL_LIMITS.web;
  const category = categorizeAttachment(file.type, filename);

  let limit = limits.maxDocSize;
  if (category === FILE_CATEGORIES.IMAGE) limit = limits.maxImageSize;
  else if (category === FILE_CATEGORIES.VIDEO) limit = limits.maxVideoSize;
  else if (category === FILE_CATEGORIES.AUDIO) limit = limits.maxAudioSize;

  if (file.size > limit) {
    return {
      valid: false,
      error: `"${filename}" exceeds the ${formatFileSize(limit)} size limit for ${category}s on ${channel}.`,
    };
  }

  return { valid: true };
};

/**
 * Validates a batch of files against channel limits.
 */
export const validateFileBatch = (files = [], currentCount = 0, channel = "web") => {
  const limits = CHANNEL_LIMITS[channel] || CHANNEL_LIMITS.web;
  const total = files.length + currentCount;

  if (total > limits.maxFilesPerMessage) {
    return {
      valid: false,
      error: `You can only attach up to ${limits.maxFilesPerMessage} files per message on ${channel}.`,
    };
  }

  for (const file of files) {
    const res = validateFile(file, channel);
    if (!res.valid) {
      return res;
    }
  }

  return { valid: true };
};

/**
 * Normalizes an attachment object from any platform or raw structure.
 */
export const normalizeAttachment = (att = {}) => {
  const category = att.category || categorizeAttachment(att.type, att.originalName || att.name, att.url);
  return {
    id: att.id || att._id || att.publicId || `att_${Math.random().toString(36).substring(2, 9)}`,
    originalName: att.originalName || att.name || "Attachment",
    mimeType: att.mimeType || att.type || "application/octet-stream",
    size: att.size || null,
    category,
    url: att.url || "",
    thumbnailUrl: att.thumbnailUrl || att.previewUrl || (category === "image" ? att.url : ""),
    publicId: att.publicId || "",
    duration: att.duration || null,
    width: att.width || null,
    height: att.height || null,
    createdAt: att.createdAt || new Date().toISOString(),
  };
};

/**
 * Calculates responsive grid configuration for a list of images (Facebook Messenger style).
 *
 * 1 image: 1 full-width preview
 * 2 images: 2-column grid
 * 3 images: 1 large on top, 2 side-by-side on bottom
 * 4 images: 2x2 grid
 * 5+ images: 2x2 grid with +N remaining count overlay on the 4th image
 */
export const computeImageGridLayout = (count = 1) => {
  if (count <= 1) {
    return {
      gridClass: "grid-cols-1",
      visibleCount: 1,
      layoutType: "single",
    };
  }
  if (count === 2) {
    return {
      gridClass: "grid-cols-2",
      visibleCount: 2,
      layoutType: "duo",
    };
  }
  if (count === 3) {
    return {
      gridClass: "grid-cols-2",
      visibleCount: 3,
      layoutType: "trio",
    };
  }
  return {
    gridClass: "grid-cols-2",
    visibleCount: 4,
    layoutType: count === 4 ? "quad" : "multi",
  };
};
