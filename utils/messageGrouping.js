import moment from "moment";

const SHORT_TIME_FORMATTER =
  typeof Intl !== "undefined"
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null;

const FULL_DATE_TIME_FORMATTER =
  typeof Intl !== "undefined"
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null;

/**
 * Fast, lightweight time formatter ("h:mm A") using native Intl.DateTimeFormat
 * instead of creating a Moment object on every render.
 */
export const formatMessageTime = (rawDate) => {
  const ts = normalizeTimestamp(rawDate);
  if (!ts) return "";
  if (SHORT_TIME_FORMATTER) {
    return SHORT_TIME_FORMATTER.format(new Date(ts));
  }
  return moment(ts).format("h:mm A");
};

/**
 * Fast full timestamp formatter for tooltips ("LLLL").
 */
export const formatFullDateTime = (rawDate) => {
  const ts = normalizeTimestamp(rawDate);
  if (!ts) return "";
  if (FULL_DATE_TIME_FORMATTER) {
    return FULL_DATE_TIME_FORMATTER.format(new Date(ts));
  }
  return moment(ts).format("LLLL");
};

/**
 * Fast relative time string (e.g. "just now", "5m", "2h", "3d") without Moment overhead.
 */
export const formatRelativeShort = (rawDate, nowMs = Date.now()) => {
  const ts = normalizeTimestamp(rawDate);
  if (!ts) return "";
  const diffSec = Math.max(0, Math.floor((nowMs - ts) / 1000));
  if (diffSec < 45) return "now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 30) return `${diffDays}d`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo`;
  return `${Math.floor(diffDays / 365)}y`;
};

/**
 * Default threshold for grouping consecutive messages from the same sender (5 minutes).
 */
export const DEFAULT_GROUPING_THRESHOLD_MS = 5 * 60 * 1000;

/**
 * Extracts 1-2 uppercase letters representing the user name's initials for avatar fallback.
 * e.g. "John Doe" -> "JD", "Ahsan" -> "AH", "Nexoro" -> "NE"
 */
export const getInitials = (name = "") => {
  if (!name || typeof name !== "string") return "U";
  const clean = name.trim();
  if (!clean) return "U";
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
};

/**
 * Deterministic, harmonious background & text color palette for letter avatar badges.
 */
const AVATAR_COLOR_PALETTES = [
  "bg-blue-600/15 text-blue-600 dark:text-blue-400 border-blue-600/25",
  "bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 border-emerald-600/25",
  "bg-violet-600/15 text-violet-600 dark:text-violet-400 border-violet-600/25",
  "bg-amber-600/15 text-amber-600 dark:text-amber-400 border-amber-600/25",
  "bg-rose-600/15 text-rose-600 dark:text-rose-400 border-rose-600/25",
  "bg-cyan-600/15 text-cyan-600 dark:text-cyan-400 border-cyan-600/25",
  "bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 border-indigo-600/25",
  "bg-fuchsia-600/15 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-600/25",
];

export const getAvatarColor = (identifier = "") => {
  if (!identifier) return AVATAR_COLOR_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLOR_PALETTES.length;
  return AVATAR_COLOR_PALETTES[index];
};

/**
 * Normalizes any timestamp or date value to numeric milliseconds.
 * Returns 0 if invalid or missing.
 */
export const normalizeTimestamp = (rawDate) => {
  if (!rawDate) return 0;
  if (typeof rawDate === "number") return rawDate;
  const parsed = new Date(rawDate).getTime();
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Formats a calendar date key (YYYY-MM-DD) in local time for consistent comparison.
 */
export const getCalendarDateKey = (rawDate) => {
  const ts = normalizeTimestamp(rawDate);
  if (!ts) return "unknown-date";
  const d = new Date(ts);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Formats a date separator label:
 * - "Today" for current local day
 * - "Yesterday" for previous local day
 * - "MMMM D, YYYY" (e.g. "October 22, 2026") otherwise
 */
export const formatDateSeparator = (rawDate, referenceDate = new Date()) => {
  const ts = normalizeTimestamp(rawDate);
  if (!ts) return "";

  const d = new Date(ts);
  const ref = new Date(referenceDate);

  // Compare day boundaries at midnight in local time
  const targetMidnight = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate()
  ).getTime();
  const refMidnight = new Date(
    ref.getFullYear(),
    ref.getMonth(),
    ref.getDate()
  ).getTime();

  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((refMidnight - targetMidnight) / ONE_DAY_MS);

  if (diffDays === 0) {
    return "Today";
  }
  if (diffDays === 1) {
    return "Yesterday";
  }

  // Consistent readable format: e.g. "October 22, 2026"
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Returns Facebook Messenger-inspired corner radius classes based on position and sender side.
 * Outer corners retain full curve (rounded-2xl), while adjacent connected corners are reduced to 4px.
 *
 * @param {'single' | 'first' | 'middle' | 'last'} position
 * @param {boolean} isMe
 */
export const getBubbleCornerClasses = (position, isMe) => {
  if (isMe) {
    // Outgoing (right-aligned): right corners connect vertically
    switch (position) {
      case "first":
        return "rounded-2xl rounded-br-[4px]";
      case "middle":
        return "rounded-2xl rounded-r-[4px]";
      case "last":
        return "rounded-2xl rounded-tr-[4px]";
      case "single":
      default:
        return "rounded-2xl";
    }
  } else {
    // Incoming (left-aligned): left corners connect vertically
    switch (position) {
      case "first":
        return "rounded-2xl rounded-bl-[4px]";
      case "middle":
        return "rounded-2xl rounded-l-[4px]";
      case "last":
        return "rounded-2xl rounded-tl-[4px]";
      case "single":
      default:
        return "rounded-2xl";
    }
  }
};

/**
 * Checks if a message is an internal note or system event.
 */
export const isSystemOrNoteMessage = (msg) => {
  if (!msg) return false;
  return Boolean(
    msg.isInternalNote ||
      msg.isNote ||
      msg.senderRole === "system" ||
      msg.type === "system" ||
      msg.isSystem
  );
};

/**
 * Pure function to sort, deduplicate, and group chat messages into
 * Facebook Messenger-style message groups and date separators.
 *
 * @param {Array} rawMessages
 * @param {Object} options
 * @param {number} [options.thresholdMs] - Max time gap to group consecutive messages (default: 5 min)
 * @param {function} [options.isMeFn] - Function to determine if message is from current user
 * @param {Date} [options.referenceDate] - Reference date for Today/Yesterday calculation
 * @returns {Array} Array of timeline items ({ type: 'date-separator' | 'message-group' | 'system-message', ... })
 */
export const groupMessages = (rawMessages = [], options = {}) => {
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return [];
  }

  const {
    thresholdMs = DEFAULT_GROUPING_THRESHOLD_MS,
    isMeFn = (m) => false,
    referenceDate = new Date(),
  } = options;

  // 1. Safe chronological sorting & deduplication (skip O(N log N) sort if already ordered)
  let needsSort = false;
  for (let i = 1; i < rawMessages.length; i++) {
    const prevTs = normalizeTimestamp(
      rawMessages[i - 1]?.createdAt || rawMessages[i - 1]?.timestamp
    );
    const currTs = normalizeTimestamp(
      rawMessages[i]?.createdAt || rawMessages[i]?.timestamp
    );
    if (currTs < prevTs) {
      needsSort = true;
      break;
    }
  }

  const sorted = needsSort
    ? [...rawMessages].sort((a, b) => {
        const timeA = normalizeTimestamp(a?.createdAt || a?.timestamp);
        const timeB = normalizeTimestamp(b?.createdAt || b?.timestamp);
        if (timeA !== timeB) return timeA - timeB;

        const idA = String(a?._id || a?.metaMessageId || "");
        const idB = String(b?._id || b?.metaMessageId || "");
        return idA.localeCompare(idB);
      })
    : rawMessages;

  const seenIds = new Set();
  const seenContentKeys = new Set();
  const deduplicated = [];
  for (const msg of sorted) {
    if (!msg) continue;

    // 1. Check Mongo ID or Meta ID duplicate
    const mongoId = msg._id ? String(msg._id) : null;
    const metaId = msg.metaMessageId || msg.externalMetaId;

    if (mongoId && seenIds.has(mongoId)) continue;
    if (metaId && seenIds.has(String(metaId))) continue;

    // 2. Semantic deduplication: same text + sender + within 20 seconds window
    const ts = normalizeTimestamp(msg.createdAt || msg.timestamp);
    const timeBucket = Math.floor(ts / 20000); // 20-second bucket
    const sender = msg.senderRole || msg.senderId || "unknown";
    const textKey = (msg.text || "").trim();
    const contentKey = `${sender}_${textKey}_${timeBucket}`;

    if (textKey && seenContentKeys.has(contentKey)) continue;

    if (mongoId) seenIds.add(mongoId);
    if (metaId) seenIds.add(String(metaId));
    if (textKey) seenContentKeys.add(contentKey);
    deduplicated.push(msg);
  }

  const timelineItems = [];
  let currentGroup = null;
  let lastCalendarDate = null;

  const flushCurrentGroup = () => {
    if (!currentGroup || currentGroup.messages.length === 0) {
      currentGroup = null;
      return;
    }

    const count = currentGroup.messages.length;
    currentGroup.messages = currentGroup.messages.map((m, index) => {
      let position = "single";
      if (count > 1) {
        if (index === 0) position = "first";
        else if (index === count - 1) position = "last";
        else position = "middle";
      }

      const rawTs = m.createdAt || m.timestamp;
      return {
        ...m,
        position,
        bubbleCornerClass: getBubbleCornerClasses(position, currentGroup.isMe),
        showAvatar: !currentGroup.isMe && (position === "first" || position === "single"),
        formattedTime: m.formattedTime || formatMessageTime(rawTs),
        formattedFullDate: m.formattedFullDate || formatFullDateTime(rawTs),
      };
    });

    currentGroup.hasMultiple = count > 1;
    currentGroup.firstMessage = currentGroup.messages[0];
    currentGroup.lastMessage = currentGroup.messages[count - 1];

    timelineItems.push(currentGroup);
    currentGroup = null;
  };

  for (const msg of deduplicated) {
    const msgDateKey = getCalendarDateKey(msg.createdAt || msg.timestamp);

    // Day boundary: Insert Date Separator once per calendar day
    if (msgDateKey !== lastCalendarDate) {
      flushCurrentGroup();
      timelineItems.push({
        type: "date-separator",
        id: `date-sep-${msgDateKey}`,
        dateKey: msgDateKey,
        label: formatDateSeparator(msg.createdAt || msg.timestamp, referenceDate),
      });
      lastCalendarDate = msgDateKey;
    }

    // System event or internal note: render standalone, not grouped
    if (isSystemOrNoteMessage(msg)) {
      flushCurrentGroup();
      timelineItems.push({
        type: "system-message",
        id: msg._id || `sys-${normalizeTimestamp(msg.createdAt)}`,
        dateKey: msgDateKey,
        message: msg,
      });
      continue;
    }

    const isMe = isMeFn(msg);
    const senderId = String(msg.senderId || msg.senderRole || "unknown");
    const msgTimestamp = normalizeTimestamp(msg.createdAt || msg.timestamp);

    // Check if message belongs to current active group
    const canGroupWithCurrent =
      currentGroup &&
      currentGroup.isMe === isMe &&
      currentGroup.senderId === senderId &&
      currentGroup.dateKey === msgDateKey &&
      msgTimestamp - currentGroup.lastTimestamp <= thresholdMs &&
      msgTimestamp - currentGroup.lastTimestamp >= 0;

    if (canGroupWithCurrent) {
      currentGroup.messages.push(msg);
      currentGroup.lastTimestamp = msgTimestamp;
    } else {
      flushCurrentGroup();
      currentGroup = {
        type: "message-group",
        id: `group-${msg._id || msgTimestamp}`,
        isMe,
        senderId,
        senderRole: msg.senderRole || (isMe ? "admin" : "customer"),
        dateKey: msgDateKey,
        lastTimestamp: msgTimestamp,
        messages: [msg],
      };
    }
  }

  flushCurrentGroup();

  return timelineItems;
};
