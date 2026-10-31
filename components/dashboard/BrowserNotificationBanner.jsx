"use client";

import { useEffect, useState } from "react";
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  showBrowserNotification,
} from "@/utils/browserNotification";
import { LuBellRing, LuX } from "react-icons/lu";

const DISMISS_KEY = "nexoro_notif_banner_dismissed";

export default function BrowserNotificationBanner() {
  const [permission, setPermission] = useState("granted");
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    if (!isNotificationSupported()) {
      return;
    }

    const currentPerm = getNotificationPermission();
    setPermission(currentPerm);

    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (!dismissed && currentPerm === "default") {
      setIsDismissed(false);
    }
  }, []);

  const handleEnable = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === "granted") {
      setIsDismissed(true);
      showBrowserNotification({
        title: "Desktop Alerts Active! 🔔",
        message:
          "You'll now receive instant notifications for orders, messages, and dashboard activity.",
        tag: "nexoro_welcome",
      });
    } else {
      setIsDismissed(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "true");
    } catch {}
  };

  if (isDismissed || permission !== "default") {
    return null;
  }

  return (
    <div className="bg-primary/10 border-b border-primary/20 px-4 py-2.5 text-base-content transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="p-2 rounded-full bg-primary/20 text-primary shrink-0">
            <LuBellRing className="size-4 animate-pulse" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold">
              Enable Desktop Notifications
            </p>
            <p className="text-[11px] sm:text-xs opacity-75">
              Get notified immediately for new orders, customer messages, and
              updates even when Nexoro is in the background.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleEnable}
            className="btn btn-xs sm:btn-sm btn-primary font-medium"
          >
            Enable Notifications
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="btn btn-xs sm:btn-sm btn-ghost btn-circle opacity-70 hover:opacity-100"
          >
            <LuX className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

