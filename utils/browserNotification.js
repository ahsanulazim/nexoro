/**
 * Browser Notification Utility for Nexoro Dashboard
 * Uses Web Notification API & Web Audio API
 */

export const isNotificationSupported = () => {
  return typeof window !== "undefined" && "Notification" in window;
};

export const getNotificationPermission = () => {
  if (!isNotificationSupported()) {
    return "unsupported";
  }
  return Notification.permission; // 'default' | 'granted' | 'denied'
};

export const isBrowserNotificationEnabled = () => {
  if (!isNotificationSupported()) return false;
  if (Notification.permission !== "granted") return false;
  try {
    const pref = localStorage.getItem("nexoro_browser_notifications");
    return pref !== "disabled";
  } catch {
    return true;
  }
};

export const setBrowserNotificationEnabled = (enabled) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      "nexoro_browser_notifications",
      enabled ? "enabled" : "disabled"
    );
  } catch (err) {
    console.error("Failed to save notification preference:", err);
  }
};

export const isNotificationSoundEnabled = () => {
  if (typeof window === "undefined") return true;
  try {
    const pref = localStorage.getItem("nexoro_notification_sound");
    return pref !== "disabled";
  } catch {
    return true;
  }
};

export const setNotificationSoundEnabled = (enabled) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      "nexoro_notification_sound",
      enabled ? "enabled" : "disabled"
    );
  } catch (err) {
    console.error("Failed to save sound preference:", err);
  }
};

export const getNotificationCategoryPrefs = () => {
  const defaults = {
    orders: true,
    messages: true,
    payments: true,
    points: true,
    inAppToast: true,
  };
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem("nexoro_notification_categories");
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
};

export const setNotificationCategoryPrefs = (prefs) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      "nexoro_notification_categories",
      JSON.stringify(prefs)
    );
  } catch (err) {
    console.error("Failed to save notification categories:", err);
  }
};

/**
 * Request notification permission from user
 */
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    return "unsupported";
  }

  try {
    let permission;
    if (typeof Notification.requestPermission === "function") {
      permission = await Notification.requestPermission();
    } else {
      // Legacy callback-based fallback
      permission = await new Promise((resolve) => {
        Notification.requestPermission((p) => resolve(p));
      });
    }

    if (permission === "granted") {
      setBrowserNotificationEnabled(true);
    }
    return permission;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return Notification.permission || "denied";
  }
};

/**
 * Play a pleasant audio chime using Web Audio API
 * No external audio files needed; zero latency and no 404 risk.
 */
export const playNotificationSound = (force = false) => {
  if (typeof window === "undefined") return;
  if (!force && !isNotificationSoundEnabled()) return;

  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Dual pleasant tone
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880, now + 0.08); // A5

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch (e) {
    // Audio autoplay might be restricted before first user interaction
  }
};

/**
 * Display desktop browser notification
 */
export const showBrowserNotification = async ({
  title = "Nexoro Dashboard",
  message = "",
  body = "",
  icon = "/assets/nexoro_logo_icon.png",
  badge = "/assets/nexoro_logo_icon.png",
  tag,
  link,
  onNavigate,
  playSound = true,
}) => {
  if (!isBrowserNotificationEnabled()) {
    return null;
  }

  const notificationBody = message || body || "You have a new update in your dashboard.";

  if (playSound) {
    playNotificationSound();
  }

  try {
    // 1. Standard Desktop Web Notification
    const notification = new Notification(title, {
      body: notificationBody,
      icon,
      badge,
      tag: tag || undefined,
      renotify: true,
      data: { link },
    });

    notification.onclick = (event) => {
      event.preventDefault();
      try {
        window.focus();
      } catch (e) {}

      if (link) {
        if (typeof onNavigate === "function") {
          onNavigate(link);
        } else if (typeof window !== "undefined") {
          window.location.href = link;
        }
      }
      notification.close();
    };

    return notification;
  } catch (err) {
    // 2. Service Worker fallback for strict mobile browser engines
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.showNotification) {
          await registration.showNotification(title, {
            body: notificationBody,
            icon,
            badge,
            tag: tag || undefined,
            data: { link },
          });
          return true;
        }
      } catch (swErr) {
        console.error("ServiceWorker notification failed:", swErr);
      }
    }
    console.error("Browser notification failed to display:", err);
    return null;
  }
};

