export function formatTime(pastDate) {
  const now = new Date();
  const diffMs = now - pastDate; // milliseconds difference
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return "Few seconds ago";
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  } else if (diffDay === 1) {
    return "Yesterday";
  } else {
    // Show direct date & time
    return pastDate.toLocaleString("en-BD", {
      timeZone: "Asia/Dhaka",
      dateStyle: "medium",
    });
    // e.g. "12/14/2025, 5:30 PM"
  }
}
