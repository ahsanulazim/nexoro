"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/axios/axiosInstance";
import DashBread from "@/components/dashboard/DashBread";
import { useAuth } from "@/context/AuthProvider";
import { useDashTheme } from "@/context/DashThemeProvider";
import { useSocket } from "@/context/SocketProvider";
import { auth } from "@/firebase/firebase.config";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  getStoredProfileMeta,
  saveStoredProfileMeta,
} from "@/utils/userInfo";
import {
  getNotificationCategoryPrefs,
  isNotificationSoundEnabled,
  setNotificationCategoryPrefs,
  setNotificationSoundEnabled,
} from "@/utils/browserNotification";
import {
  LuBell,
  LuBuilding2,
  LuCamera,
  LuCheck,
  LuCircleCheck,
  LuCopy,
  LuCreditCard,
  LuEye,
  LuEyeOff,
  LuGlobe,
  LuImagePlus,
  LuKeyRound,
  LuLaptop,
  LuLink,
  LuLock,
  LuLogOut,
  LuMail,
  LuMapPin,
  LuMessageSquare,
  LuMoon,
  LuPackage,
  LuPalette,
  LuPhone,
  LuRefreshCw,
  LuSave,
  LuSend,
  LuSettings,
  LuShieldCheck,
  LuSparkles,
  LuSun,
  LuTrash2,
  LuTrophy,
  LuUpload,
  LuUser,
  LuVolume2,
  LuVolumeX,
} from "react-icons/lu";

const AVATAR_PRESETS = [
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Alexander",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=NexoroPro",
  "https://api.dicebear.com/9.x/micah/svg?seed=Sophia",
];

const WORKSPACE_STORAGE_KEY = "nexoro_workspace_settings";
const UI_PREFS_STORAGE_KEY = "nexoro_ui_preferences";

export default function SettingsPage() {
  const [firebaseUser] = useAuthState(auth);
  const { currentUser, setCurrentUser } = useAuth();
  const { isDark, setIsDark } = useDashTheme();
  const {
    browserPermission,
    isBrowserAlertActive,
    enableBrowserNotifications,
    toggleBrowserNotifications,
    showBrowserNotification,
    playNotificationSound,
  } = useSocket();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const userRole = currentUser?.user?.role || "customer";
  const isAdmin = userRole === "admin";

  const [activeTab, setActiveTab] = useState("profile");

  // 1. Profile State
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "+880",
    company: "",
    jobTitle: "",
    address: "Dhaka, Bangladesh",
    bio: "",
    photoURL: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [showCustomUrlInput, setShowCustomUrlInput] = useState(false);

  // 2. Security State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  // 3. Appearance & UI State
  const [uiPrefs, setUiPrefs] = useState({
    compactTables: false,
    animationsEnabled: true,
    timeFormat24h: false,
    showOnlineBadge: true,
  });

  // 4. Notifications State
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifCategories, setNotifCategories] = useState({
    orders: true,
    messages: true,
    payments: true,
    points: true,
    inAppToast: true,
  });

  // 5. Admin Workspace State
  const [workspaceSettings, setWorkspaceSettings] = useState({
    agencyName: "Nexoro Digital Agency",
    tagline: "Building Digital Products & Growth Experiences",
    supportEmail: "support@nexoro.com",
    supportPhone: "+880 1700-000000",
    officeAddress: "Dhaka, Bangladesh",
    websiteUrl: "https://nexoro.com",
    whatsappNumber: "+8801700000000",
    facebookUrl: "https://facebook.com/nexoro",
    linkedinUrl: "https://linkedin.com/company/nexoro",
    currency: "BDT (৳)",
    acceptingNewOrders: true,
    enableLeaderboard: true,
  });
  const [isSavingWorkspace, setIsSavingWorkspace] = useState(false);

  // Load initial data from Firebase, AuthContext, and LocalStorage
  useEffect(() => {
    const email = firebaseUser?.email || currentUser?.user?.email;
    const storedMeta = getStoredProfileMeta(email);

    setProfileForm({
      name:
        storedMeta.name ||
        currentUser?.user?.name ||
        firebaseUser?.displayName ||
        "",
      phone: storedMeta.phone || currentUser?.user?.phone || "+880",
      company: storedMeta.company || "Nexoro",
      jobTitle:
        storedMeta.jobTitle ||
        (userRole === "admin"
          ? "Administrator"
          : userRole === "member"
            ? "Team Member"
            : "Client"),
      address: storedMeta.address || "Dhaka, Bangladesh",
      bio: storedMeta.bio || "",
      photoURL:
        storedMeta.photoURL ||
        firebaseUser?.photoURL ||
        currentUser?.user?.photoURL ||
        "",
    });

    // Load notification prefs
    setSoundEnabled(isNotificationSoundEnabled());
    setNotifCategories(getNotificationCategoryPrefs());

    // Load UI prefs
    try {
      const savedUi = localStorage.getItem(UI_PREFS_STORAGE_KEY);
      if (savedUi) {
        setUiPrefs((prev) => ({ ...prev, ...JSON.parse(savedUi) }));
      }
    } catch {}

    // Load Workspace settings
    try {
      const savedWorkspace = localStorage.getItem(WORKSPACE_STORAGE_KEY);
      if (savedWorkspace) {
        setWorkspaceSettings((prev) => ({
          ...prev,
          ...JSON.parse(savedWorkspace),
        }));
      }
    } catch {}
  }, [firebaseUser, currentUser, userRole]);

  // Image File Upload + Center Crop & Compression to 256x256 Data URL
  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPG, PNG, WebP, or AVIF)");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Profile picture size must be less than 5MB");
      return;
    }

    setIsProcessingImage(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const targetSize = 256;
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext("2d");

          // Center square crop
          const minSide = Math.min(img.width, img.height);
          const sx = (img.width - minSide) / 2;
          const sy = (img.height - minSide) / 2;

          ctx.drawImage(
            img,
            sx,
            sy,
            minSide,
            minSide,
            0,
            0,
            targetSize,
            targetSize,
          );

          const compressedDataUrl = canvas.toDataURL("image/webp", 0.88);
          setProfileForm((prev) => ({
            ...prev,
            photoURL: compressedDataUrl,
          }));
          setUploadedFileName(file.name);
          toast.info(
            "Photo ready! Click 'Save Profile Changes' to apply.",
            { autoClose: 2500 },
          );
        } catch (err) {
          console.error("Error processing image:", err);
          toast.error("Failed to process image file");
        } finally {
          setIsProcessingImage(false);
        }
      };
      img.onerror = () => {
        setIsProcessingImage(false);
        toast.error("Invalid image file");
      };
      img.src = event.target?.result;
    };

    reader.onerror = () => {
      setIsProcessingImage(false);
      toast.error("Failed to read file");
    };

    reader.readAsDataURL(file);
  };

  // Handlers: Profile
  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }

    setIsSavingProfile(true);
    try {
      const email = firebaseUser?.email || currentUser?.user?.email;
      const trimmedPhoto = profileForm.photoURL.trim();
      const isHttpUrl = /^https?:\/\//i.test(trimmedPhoto);

      // 1. Update Firebase Auth profile (Firebase photoURL only accepts short HTTP URLs, not base64 data URLs)
      if (auth.currentUser) {
        const firebaseUpdatePayload = {
          displayName: profileForm.name.trim(),
        };
        if (isHttpUrl && trimmedPhoto.length <= 2000) {
          firebaseUpdatePayload.photoURL = trimmedPhoto;
        } else if (!trimmedPhoto) {
          firebaseUpdatePayload.photoURL = "";
        }
        await updateProfile(auth.currentUser, firebaseUpdatePayload);
      }

      // 2. Save extended profile fields (including uploaded photo data URL or preset URL) in localStorage
      saveStoredProfileMeta(email, {
        ...profileForm,
        name: profileForm.name.trim(),
        photoURL: trimmedPhoto,
        updatedAt: new Date().toISOString(),
      });

      // 3. Sync AuthProvider currentUser state so Navbar/Dropdown update immediately
      if (currentUser) {
        const updatedUserObj = {
          ...currentUser,
          user: {
            ...currentUser.user,
            name: profileForm.name.trim(),
            photoURL: trimmedPhoto,
            phone: profileForm.phone.trim(),
          },
        };
        setCurrentUser(updatedUserObj);
        localStorage.setItem("user", JSON.stringify(updatedUserObj));
      }

      // 4. Sync profile & avatar to backend database so leaderboard & system display it
      try {
        const token = await auth.currentUser?.getIdToken();
        if (token) {
          await api.put(
            "/users/updateUser",
            {
              name: profileForm.name.trim(),
              photoURL: trimmedPhoto,
              phone: profileForm.phone.trim(),
              company: profileForm.company.trim(),
              jobTitle: profileForm.jobTitle.trim(),
              address: profileForm.address.trim(),
              bio: profileForm.bio.trim(),
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
        }
      } catch (syncErr) {
        console.warn("Backend user sync notice:", syncErr?.message);
      }

      toast.success("Profile settings updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handlers: Security
  const hasPasswordProvider = firebaseUser?.providerData?.some(
    (p) => p.providerId === "password",
  );
  const authProviders =
    firebaseUser?.providerData?.map((p) => p.providerId) || [];

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "None", color: "bg-base-300" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    const map = [
      { label: "Too Short", color: "bg-error" },
      { label: "Weak", color: "bg-error" },
      { label: "Fair", color: "bg-warning" },
      { label: "Good", color: "bg-info" },
      { label: "Strong", color: "bg-success" },
    ];
    return { score, ...map[score] };
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error("No authenticated user found");
      }

      if (hasPasswordProvider && currentPassword) {
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword,
        );
        await reauthenticateWithCredential(user, credential);
      }

      await updatePassword(user, newPassword);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password updated successfully!");
    } catch (error) {
      console.error("Password update error:", error);
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        toast.error("Current password is incorrect.");
      } else if (error.code === "auth/requires-recent-login") {
        toast.error(
          "Please enter your current password or sign in again to update your password.",
        );
      } else {
        toast.error(error.message || "Failed to update password");
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSendPasswordReset = async () => {
    const email = firebaseUser?.email || currentUser?.user?.email;
    if (!email) {
      toast.error("No email address associated with this account");
      return;
    }
    setIsSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(`Password reset link sent to ${email}`);
    } catch (error) {
      toast.error(error?.message || "Failed to send password reset email");
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handlers: Appearance & UI Preferences
  const handleThemeSelection = (dark) => {
    setIsDark(dark);
    localStorage.setItem("isDark", dark);
    toast.info(`Switched to ${dark ? "Dark" : "Light"} theme`, {
      autoClose: 1500,
    });
  };

  const handleUiPrefToggle = (key) => {
    const updated = { ...uiPrefs, [key]: !uiPrefs[key] };
    setUiPrefs(updated);
    localStorage.setItem(UI_PREFS_STORAGE_KEY, JSON.stringify(updated));
    toast.success("Preference saved", { autoClose: 1200 });
  };

  // Handlers: Notifications
  const handleSoundToggle = (enabled) => {
    setSoundEnabled(enabled);
    setNotificationSoundEnabled(enabled);
    if (enabled) {
      playNotificationSound(true);
    }
    toast.info(
      enabled ? "Notification sound enabled" : "Notification sound muted",
      { autoClose: 1500 },
    );
  };

  const handleCategoryToggle = (key) => {
    const updated = { ...notifCategories, [key]: !notifCategories[key] };
    setNotifCategories(updated);
    setNotificationCategoryPrefs(updated);
  };

  // Handlers: Admin Workspace
  const handleSaveWorkspace = (e) => {
    e.preventDefault();
    setIsSavingWorkspace(true);
    try {
      localStorage.setItem(
        WORKSPACE_STORAGE_KEY,
        JSON.stringify(workspaceSettings),
      );
      toast.success("Agency workspace settings saved!");
    } catch {
      toast.error("Failed to save workspace settings");
    } finally {
      setIsSavingWorkspace(false);
    }
  };

  const handleClearLocalCache = () => {
    localStorage.removeItem(UI_PREFS_STORAGE_KEY);
    localStorage.removeItem("nexoro_notif_banner_dismissed");
    toast.success("Local cache & dismissed banners reset!");
  };

  // Navigation Tabs Configuration
  const tabs = [
    {
      id: "profile",
      label: "Profile & Account",
      description: "Personal info, photo & bio",
      icon: LuUser,
    },
    {
      id: "security",
      label: "Security & Login",
      description: "Password, auth & sessions",
      icon: LuShieldCheck,
    },
    {
      id: "appearance",
      label: "Appearance",
      description: "Theme mode & UI display",
      icon: LuPalette,
    },
    {
      id: "notifications",
      label: "Notifications & Sound",
      description: "Desktop alerts & audio chimes",
      icon: LuBell,
    },
    ...(isAdmin
      ? [
          {
            id: "workspace",
            label: "Agency Workspace",
            description: "Company info & system rules",
            icon: LuBuilding2,
          },
        ]
      : []),
  ];

  const passStrength = getPasswordStrength(passwordForm.newPassword);

  return (
    <main className="space-y-6 pb-12">
      {/* Top Breadcrumb & Page Title */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <DashBread title="Settings" />
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3 mt-1">
            <LuSettings className="text-primary size-8" /> Account & System
            Settings
          </h1>
          <p className="text-sm opacity-60 mt-1">
            Manage your personal profile, security credentials, dashboard
            appearance, and notification alerts.
          </p>
        </div>

        {/* User Summary Pill */}
        <div className="flex items-center gap-3 bg-base-100 px-4 py-2.5 rounded-box border border-base-200 shadow-xs self-start sm:self-auto">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center overflow-hidden ring-2 ring-primary/20">
              {profileForm.photoURL ? (
                <img
                  src={profileForm.photoURL}
                  alt={profileForm.name || "Avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-bold text-base uppercase">
                  {(profileForm.name || "U").charAt(0)}
                </span>
              )}
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm truncate">
                {profileForm.name || "Nexoro User"}
              </p>
              <span className="badge badge-xs badge-primary capitalize font-semibold">
                {userRole}
              </span>
            </div>
            <p className="text-xs opacity-60 truncate">
              {firebaseUser?.email || currentUser?.user?.email}
            </p>
          </div>
        </div>
      </section>

      {/* Main Layout: Left Sidebar Tabs + Right Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Vertical Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-base-100 rounded-box border border-base-200 p-3 shadow-xs lg:sticky lg:top-20">
          <div className="flex lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all shrink-0 lg:w-full cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-content shadow-sm font-semibold"
                      : "hover:bg-base-200/80 text-base-content/80"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isActive
                        ? "bg-primary-content/15 text-primary-content"
                        : "bg-base-200 text-primary"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm leading-tight whitespace-nowrap">
                      {tab.label}
                    </p>
                    <p
                      className={`text-[11px] hidden lg:block truncate mt-0.5 ${
                        isActive ? "opacity-85" : "opacity-55"
                      }`}
                    >
                      {tab.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:block border-t border-base-200 mt-4 pt-3 px-2">
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-sm btn-ghost text-error hover:bg-error/10 w-full justify-start gap-2 font-medium"
            >
              <LuLogOut className="size-4" /> Sign Out of Account
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <section className="lg:col-span-9 space-y-6">
          {/* TAB 1: PROFILE & ACCOUNT INFO */}
          {activeTab === "profile" && (
            <form
              onSubmit={handleProfileSave}
              className="bg-base-100 rounded-box border border-base-200 shadow-xs overflow-hidden"
            >
              <div className="p-6 border-b border-base-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <LuUser className="text-primary size-5" /> Personal &
                    Account Information
                  </h2>
                  <p className="text-xs opacity-60 mt-1">
                    Update your profile picture, display name, and contact
                    details shown across the Nexoro workspace.
                  </p>
                </div>
                <span className="badge badge-soft badge-primary font-medium text-xs">
                  Synced with Profile
                </span>
              </div>

              <div className="p-6 space-y-6">
                {/* Profile Picture Upload + Avatar Presets Section */}
                <div className="p-5 rounded-2xl bg-base-200/50 border border-base-200 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    {/* Interactive Avatar Preview with Camera Overlay */}
                    <div className="relative group shrink-0">
                      <div className="w-24 h-24 rounded-2xl bg-primary/10 text-primary flex items-center justify-center overflow-hidden ring-2 ring-primary/30 shadow-xs">
                        {isProcessingImage ? (
                          <span className="loading loading-spinner loading-md text-primary" />
                        ) : profileForm.photoURL ? (
                          <img
                            src={profileForm.photoURL}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <LuUser className="size-10 opacity-60" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        title="Upload profile picture"
                        className="absolute inset-0 rounded-2xl bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer"
                      >
                        <LuCamera className="size-5" />
                        <span className="text-[10px] font-semibold">
                          Upload
                        </span>
                      </button>
                    </div>

                    {/* Hidden File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/gif"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />

                    {/* Upload Controls & Preset Avatars */}
                    <div className="flex-1 space-y-3 w-full">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-sm flex items-center gap-1.5">
                            Profile Picture & Avatar
                          </h3>
                          <p className="text-xs opacity-60">
                            Upload a custom photo (JPG, PNG, WebP up to 5MB) or
                            pick a preset avatar below.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isProcessingImage}
                            className="btn btn-sm btn-primary gap-1.5 font-semibold"
                          >
                            <LuUpload className="size-4" />
                            Upload Photo
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setShowCustomUrlInput(!showCustomUrlInput)
                            }
                            className="btn btn-sm btn-ghost border border-base-300 gap-1"
                          >
                            <LuLink className="size-3.5" />
                            Image URL
                          </button>

                          {profileForm.photoURL && (
                            <button
                              type="button"
                              onClick={() => {
                                setProfileForm({
                                  ...profileForm,
                                  photoURL: "",
                                });
                                setUploadedFileName("");
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                                }
                              }}
                              className="btn btn-sm btn-ghost text-error hover:bg-error/10 gap-1"
                              title="Remove current photo"
                            >
                              <LuTrash2 className="size-4" />
                              Remove
                            </button>
                          )}
                        </div>
                      </div>

                      {uploadedFileName && (
                        <div className="text-xs text-success flex items-center gap-1.5 font-medium">
                          <LuCircleCheck className="size-3.5" />
                          Selected file: {uploadedFileName}
                        </div>
                      )}

                      {/* Optional Custom Image URL Input */}
                      {showCustomUrlInput && (
                        <div className="pt-1">
                          <input
                            type="url"
                            value={
                              profileForm.photoURL.startsWith("data:")
                                ? ""
                                : profileForm.photoURL
                            }
                            onChange={(e) => {
                              setUploadedFileName("");
                              setProfileForm({
                                ...profileForm,
                                photoURL: e.target.value,
                              });
                            }}
                            placeholder="Paste direct image URL (https://example.com/avatar.png)"
                            className="input input-sm input-bordered w-full"
                          />
                        </div>
                      )}

                      {/* Quick Preset Avatars Row */}
                      <div className="flex items-center gap-2.5 flex-wrap pt-1">
                        <span className="text-xs font-medium opacity-65">
                          Or choose an avatar:
                        </span>
                        {AVATAR_PRESETS.map((presetUrl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setUploadedFileName("");
                              setProfileForm({
                                ...profileForm,
                                photoURL: presetUrl,
                              });
                            }}
                            className={`size-9 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 cursor-pointer ${
                              profileForm.photoURL === presetUrl
                                ? "border-primary ring-2 ring-primary/30 scale-105"
                                : "border-base-300 opacity-85 hover:opacity-100"
                            }`}
                            title={`Select preset avatar ${idx + 1}`}
                          >
                            <img
                              src={presetUrl}
                              alt={`Preset ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-sm flex items-center gap-1.5">
                        <LuUser className="size-3.5 opacity-70" /> Full Name *
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      placeholder="Your full name"
                      className="input input-bordered w-full"
                    />
                  </div>

                  {/* Email Address (Read-only) */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-sm flex items-center gap-1.5">
                        <LuMail className="size-3.5 opacity-70" /> Email Address
                      </span>
                      <span className="badge badge-xs badge-success gap-1">
                        <LuCheck className="size-2.5" /> Verified
                      </span>
                    </label>
                    <div className="join w-full">
                      <input
                        type="email"
                        disabled
                        value={
                          firebaseUser?.email ||
                          currentUser?.user?.email ||
                          "N/A"
                        }
                        className="input input-bordered join-item w-full opacity-75 cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            firebaseUser?.email ||
                              currentUser?.user?.email ||
                              "",
                          );
                          toast.info("Email copied to clipboard", {
                            autoClose: 1200,
                          });
                        }}
                        className="btn btn-neutral join-item"
                        title="Copy email"
                      >
                        <LuCopy className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-sm flex items-center gap-1.5">
                        <LuPhone className="size-3.5 opacity-70" /> Phone Number
                      </span>
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+880 1XXX-XXXXXX"
                      className="input input-bordered w-full"
                    />
                  </div>

                  {/* Job Title / Role */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-sm flex items-center gap-1.5">
                        <LuSparkles className="size-3.5 opacity-70" /> Job Title
                        / Designation
                      </span>
                    </label>
                    <input
                      type="text"
                      value={profileForm.jobTitle}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          jobTitle: e.target.value,
                        })
                      }
                      placeholder="e.g. Product Designer, Project Manager"
                      className="input input-bordered w-full"
                    />
                  </div>

                  {/* Company / Organization */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-sm flex items-center gap-1.5">
                        <LuBuilding2 className="size-3.5 opacity-70" /> Company /
                        Organization
                      </span>
                    </label>
                    <input
                      type="text"
                      value={profileForm.company}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          company: e.target.value,
                        })
                      }
                      placeholder="Your company or brand name"
                      className="input input-bordered w-full"
                    />
                  </div>

                  {/* Location / Address */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-sm flex items-center gap-1.5">
                        <LuMapPin className="size-3.5 opacity-70" /> Location /
                        Address
                      </span>
                    </label>
                    <input
                      type="text"
                      value={profileForm.address}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          address: e.target.value,
                        })
                      }
                      placeholder="City, Country"
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-sm">
                      Short Bio / Notes
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, bio: e.target.value })
                    }
                    placeholder="Write a brief introduction about your role or preferences..."
                    className="textarea textarea-bordered w-full"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 bg-base-200/40 border-t border-base-200 flex items-center justify-between gap-3">
                <span className="text-xs opacity-60">
                  Account Created:{" "}
                  {firebaseUser?.metadata?.creationTime
                    ? new Date(
                        firebaseUser.metadata.creationTime,
                      ).toLocaleDateString("en-BD", {
                        dateStyle: "medium",
                      })
                    : "Active"}
                </span>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="btn btn-primary gap-2 font-semibold"
                >
                  {isSavingProfile ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <LuSave className="size-4" />
                  )}
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SECURITY & LOGIN */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Connected Authentication Method */}
              <div className="bg-base-100 rounded-box border border-base-200 p-6 shadow-xs space-y-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <LuShieldCheck className="text-primary size-5" />{" "}
                    Authentication & Sign-In Methods
                  </h2>
                  <p className="text-xs opacity-60 mt-1">
                    Overview of how your account is authenticated with Firebase
                    Security.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-base-200/50 border border-base-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-primary/15 text-primary">
                        <LuKeyRound className="size-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          Connected Providers
                        </p>
                        <p className="text-xs opacity-65">
                          {authProviders.length > 0
                            ? authProviders
                                .map((p) =>
                                  p === "google.com"
                                    ? "Google OAuth"
                                    : p === "password"
                                      ? "Email & Password"
                                      : p,
                                )
                                .join(", ")
                            : "Standard Session"}
                        </p>
                      </div>
                    </div>
                    <span className="badge badge-success badge-sm">
                      Protected
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-base-200/50 border border-base-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-info/15 text-info">
                        <LuLaptop className="size-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Last Sign-In</p>
                        <p className="text-xs opacity-65">
                          {firebaseUser?.metadata?.lastSignInTime
                            ? new Date(
                                firebaseUser.metadata.lastSignInTime,
                              ).toLocaleString("en-BD", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "Current Active Session"}
                        </p>
                      </div>
                    </div>
                    <span className="badge badge-info badge-sm">Online</span>
                  </div>
                </div>
              </div>

              {/* Change Password Card */}
              <form
                onSubmit={handlePasswordChange}
                className="bg-base-100 rounded-box border border-base-200 shadow-xs overflow-hidden"
              >
                <div className="p-6 border-b border-base-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <LuLock className="text-primary size-5" /> Update Password
                    </h3>
                    <p className="text-xs opacity-60 mt-0.5">
                      Choose a strong password with at least 6 characters.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendPasswordReset}
                    disabled={isSendingReset}
                    className="btn btn-xs sm:btn-sm btn-outline btn-primary gap-1.5 self-start sm:self-auto"
                  >
                    {isSendingReset ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <LuSend className="size-3.5" />
                    )}
                    Send Reset Email Instead
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {hasPasswordProvider && (
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text font-semibold text-sm">
                          Current Password
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPass ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              currentPassword: e.target.value,
                            })
                          }
                          placeholder="Enter current password to verify"
                          className="input input-bordered w-full pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
                        >
                          {showCurrentPass ? (
                            <LuEyeOff className="size-4" />
                          ) : (
                            <LuEye className="size-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text font-semibold text-sm">
                          New Password
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPass ? "text" : "password"}
                          required
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword: e.target.value,
                            })
                          }
                          placeholder="New password (min. 6 chars)"
                          className="input input-bordered w-full pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
                        >
                          {showNewPass ? (
                            <LuEyeOff className="size-4" />
                          ) : (
                            <LuEye className="size-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text font-semibold text-sm">
                          Confirm New Password
                        </span>
                      </label>
                      <input
                        type={showNewPass ? "text" : "password"}
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Re-enter new password"
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>

                  {/* Password Strength Meter */}
                  {passwordForm.newPassword && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs">
                        <span className="opacity-70">Password Strength</span>
                        <span className="font-semibold">
                          {passStrength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 h-1.5">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`rounded-full transition-all ${
                              passStrength.score >= step
                                ? passStrength.color
                                : "bg-base-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 bg-base-200/40 border-t border-base-200 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="btn btn-primary gap-2 font-semibold"
                  >
                    {isUpdatingPassword ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <LuKeyRound className="size-4" />
                    )}
                    Update Password
                  </button>
                </div>
              </form>

              {/* Session & Cache Management */}
              <div className="bg-base-100 rounded-box border border-base-200 p-6 shadow-xs space-y-4">
                <h3 className="text-lg font-bold text-base-content">
                  Session & Local Storage
                </h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-base-200/40 border border-base-200">
                  <div>
                    <p className="font-semibold text-sm">
                      Reset Local Dashboard Cache
                    </p>
                    <p className="text-xs opacity-65">
                      Clears saved UI layout preferences and re-enables
                      dismissed notification banners without logging you out.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearLocalCache}
                    className="btn btn-sm btn-outline gap-1.5 shrink-0"
                  >
                    <LuRefreshCw className="size-4" /> Reset UI Cache
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: APPEARANCE & INTERFACE */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              {/* Theme Mode Picker */}
              <div className="bg-base-100 rounded-box border border-base-200 p-6 shadow-xs space-y-5">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <LuPalette className="text-primary size-5" /> Dashboard
                    Theme Mode
                  </h2>
                  <p className="text-xs opacity-60 mt-1">
                    Select your preferred color scheme for the Nexoro Dashboard.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Light Mode Card */}
                  <button
                    type="button"
                    onClick={() => handleThemeSelection(false)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      !isDark
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-base-200 hover:border-base-300"
                    }`}
                  >
                    <div className="rounded-xl bg-[#f8fafc] border border-slate-200 p-3 mb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="size-2.5 rounded-full bg-indigo-500" />
                          <div className="h-2 w-16 rounded bg-slate-300" />
                        </div>
                        <LuSun className="size-4 text-amber-500" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <div className="h-8 rounded bg-white border border-slate-200" />
                        <div className="h-8 rounded bg-white border border-slate-200" />
                        <div className="h-8 rounded bg-white border border-slate-200" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm flex items-center gap-2">
                          <LuSun className="size-4 text-amber-500" /> Light Mode
                        </p>
                        <p className="text-xs opacity-60">
                          Clean, bright workspace ideal for daylight
                        </p>
                      </div>
                      {!isDark && (
                        <span className="badge badge-primary badge-sm">
                          Active
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Dark Mode Card */}
                  <button
                    type="button"
                    onClick={() => handleThemeSelection(true)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      isDark
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-base-200 hover:border-base-300"
                    }`}
                  >
                    <div className="rounded-xl bg-[#0f172a] border border-slate-800 p-3 mb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="size-2.5 rounded-full bg-indigo-400" />
                          <div className="h-2 w-16 rounded bg-slate-700" />
                        </div>
                        <LuMoon className="size-4 text-indigo-300" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <div className="h-8 rounded bg-slate-800/90 border border-slate-700" />
                        <div className="h-8 rounded bg-slate-800/90 border border-slate-700" />
                        <div className="h-8 rounded bg-slate-800/90 border border-slate-700" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm flex items-center gap-2">
                          <LuMoon className="size-4 text-indigo-400" /> Dark
                          Mode
                        </p>
                        <p className="text-xs opacity-60">
                          Easy on the eyes in low-light environments
                        </p>
                      </div>
                      {isDark && (
                        <span className="badge badge-primary badge-sm">
                          Active
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Interface Display Preferences */}
              <div className="bg-base-100 rounded-box border border-base-200 p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="text-lg font-bold">
                    Interface & Display Preferences
                  </h3>
                  <p className="text-xs opacity-60 mt-0.5">
                    Customize how data tables, timestamps, and status indicators
                    behave.
                  </p>
                </div>

                <div className="divide-y divide-base-200">
                  {[
                    {
                      key: "compactTables",
                      title: "Compact Table Density",
                      desc: "Reduce row padding in Orders, Users, and Expenses tables to fit more rows on screen.",
                    },
                    {
                      key: "animationsEnabled",
                      title: "Smooth UI Transitions",
                      desc: "Enable subtle motion transitions on cards, modals, and drawers.",
                    },
                    {
                      key: "timeFormat24h",
                      title: "Use 24-Hour Time Format",
                      desc: "Display timestamps as 14:30 instead of 2:30 PM.",
                    },
                    {
                      key: "showOnlineBadge",
                      title: "Show Active Online Presence",
                      desc: "Display green online indicators next to connected users in Inbox and Team views.",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="py-3.5 flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-xs opacity-60">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={!!uiPrefs[item.key]}
                        onChange={() => handleUiPrefToggle(item.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS & SOUND ALERTS */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              {/* Desktop Browser Push Notifications Card */}
              <div className="bg-base-100 rounded-box border border-base-200 p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-3 rounded-xl shrink-0 ${
                        browserPermission === "granted"
                          ? "bg-success/15 text-success"
                          : browserPermission === "denied"
                            ? "bg-error/15 text-error"
                            : "bg-primary/15 text-primary"
                      }`}
                    >
                      <LuBell className="size-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl font-bold">
                          Desktop Push Notifications
                        </h2>
                        <span
                          className={`badge badge-sm font-semibold ${
                            browserPermission === "granted"
                              ? isBrowserAlertActive
                                ? "badge-success"
                                : "badge-warning"
                              : browserPermission === "denied"
                                ? "badge-error"
                                : "badge-ghost"
                          }`}
                        >
                          {browserPermission === "granted"
                            ? isBrowserAlertActive
                              ? "Active"
                              : "Muted"
                            : browserPermission === "denied"
                              ? "Blocked in Browser"
                              : "Not Enabled"}
                        </span>
                      </div>
                      <p className="text-xs opacity-65 mt-1 max-w-xl">
                        {browserPermission === "granted"
                          ? "Real-time desktop alerts are enabled. You will receive system popups even when your browser tab is in the background."
                          : browserPermission === "denied"
                            ? "Browser notifications are blocked. Click the lock/tune icon next to the URL address bar and allow Notifications."
                            : "Grant browser permission to receive instant desktop alerts for orders, messages, and tasks."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {browserPermission === "default" && (
                      <button
                        type="button"
                        onClick={enableBrowserNotifications}
                        className="btn btn-sm btn-primary font-semibold"
                      >
                        Enable Desktop Alerts
                      </button>
                    )}

                    {browserPermission === "granted" && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            toggleBrowserNotifications(!isBrowserAlertActive)
                          }
                          className="btn btn-sm btn-outline"
                        >
                          {isBrowserAlertActive ? "Mute Alerts" : "Unmute"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            showBrowserNotification({
                              title: "Nexoro Settings Test 🔔",
                              message:
                                "Your desktop notification and sound settings are working properly!",
                              tag: "settings_test_" + Date.now(),
                            })
                          }
                          className="btn btn-sm btn-primary font-semibold"
                        >
                          Send Test Alert
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Audio Chime Control */}
                <div className="p-4 rounded-xl bg-base-200/50 border border-base-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/15 text-primary">
                      {soundEnabled ? (
                        <LuVolume2 className="size-5" />
                      ) : (
                        <LuVolumeX className="size-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        Notification Sound Chime
                      </p>
                      <p className="text-xs opacity-65">
                        Play a subtle dual-tone audio chime when a new
                        notification arrives.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => playNotificationSound(true)}
                      className="btn btn-xs btn-ghost border border-base-300"
                    >
                      Preview Sound
                    </button>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={soundEnabled}
                      onChange={(e) => handleSoundToggle(e.target.checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Granular Alert Categories */}
              <div className="bg-base-100 rounded-box border border-base-200 p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="text-lg font-bold">
                    Notification Event Categories
                  </h3>
                  <p className="text-xs opacity-60 mt-0.5">
                    Choose which dashboard events trigger alerts for your
                    account.
                  </p>
                </div>

                <div className="divide-y divide-base-200">
                  {[
                    {
                      key: "orders",
                      icon: LuPackage,
                      color: "text-primary bg-primary/10",
                      title: "Orders & Project Assignments",
                      desc: "New orders, status changes, task updates, and project assignments.",
                    },
                    {
                      key: "messages",
                      icon: LuMessageSquare,
                      color: "text-info bg-info/10",
                      title: "Direct Messages & Live Chat",
                      desc: "Incoming client and team messages in the Inbox.",
                    },
                    {
                      key: "payments",
                      icon: LuCreditCard,
                      color: "text-success bg-success/10",
                      title: "Payments & Invoices",
                      desc: "Payment confirmations, due reminders, and billing updates.",
                    },
                    {
                      key: "points",
                      icon: LuTrophy,
                      color: "text-warning bg-warning/10",
                      title: "Points & Leaderboard Activity",
                      desc: "Work submissions, points earned, and review updates.",
                    },
                    {
                      key: "inAppToast",
                      icon: LuCircleCheck,
                      color: "text-secondary bg-secondary/10",
                      title: "In-App Toast Popups",
                      desc: "Show floating toast banners in the corner of the dashboard.",
                    },
                  ].map((cat) => {
                    const CatIcon = cat.icon;
                    return (
                      <div
                        key={cat.key}
                        className="py-3.5 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${cat.color}`}>
                            <CatIcon className="size-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{cat.title}</p>
                            <p className="text-xs opacity-60">{cat.desc}</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={!!notifCategories[cat.key]}
                          onChange={() => handleCategoryToggle(cat.key)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ADMIN AGENCY WORKSPACE SETTINGS */}
          {activeTab === "workspace" && isAdmin && (
            <form
              onSubmit={handleSaveWorkspace}
              className="bg-base-100 rounded-box border border-base-200 shadow-xs overflow-hidden"
            >
              <div className="p-6 border-b border-base-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <LuBuilding2 className="text-primary size-5" /> Agency
                    Workspace Configuration
                  </h2>
                  <p className="text-xs opacity-60 mt-1">
                    Administrator controls for agency contact details, social
                    channels, and operational rules.
                  </p>
                </div>
                <span className="badge badge-warning badge-sm font-semibold">
                  Admin Only
                </span>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-sm">
                        Agency / Workspace Name
                      </span>
                    </label>
                    <input
                      type="text"
                      value={workspaceSettings.agencyName}
                      onChange={(e) =>
                        setWorkspaceSettings({
                          ...workspaceSettings,
                          agencyName: e.target.value,
                        })
                      }
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-sm">
                        Default Currency
                      </span>
                    </label>
                    <select
                      value={workspaceSettings.currency}
                      onChange={(e) =>
                        setWorkspaceSettings({
                          ...workspaceSettings,
                          currency: e.target.value,
                        })
                      }
                      className="select select-bordered w-full"
                    >
                      <option value="BDT (৳)">BDT (৳) - Bangladeshi Taka</option>
                      <option value="USD ($)">USD ($) - US Dollar</option>
                      <option value="EUR (€)">EUR (€) - Euro</option>
                      <option value="GBP (£)">GBP (£) - British Pound</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-sm">
                        Official Support Email
                      </span>
                    </label>
                    <input
                      type="email"
                      value={workspaceSettings.supportEmail}
                      onChange={(e) =>
                        setWorkspaceSettings({
                          ...workspaceSettings,
                          supportEmail: e.target.value,
                        })
                      }
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-sm">
                        Support Phone / Hotline
                      </span>
                    </label>
                    <input
                      type="text"
                      value={workspaceSettings.supportPhone}
                      onChange={(e) =>
                        setWorkspaceSettings({
                          ...workspaceSettings,
                          supportPhone: e.target.value,
                        })
                      }
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-sm flex items-center gap-1.5">
                        <LuGlobe className="size-3.5 opacity-70" /> Website URL
                      </span>
                    </label>
                    <input
                      type="url"
                      value={workspaceSettings.websiteUrl}
                      onChange={(e) =>
                        setWorkspaceSettings({
                          ...workspaceSettings,
                          websiteUrl: e.target.value,
                        })
                      }
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-sm">
                        WhatsApp Business Number
                      </span>
                    </label>
                    <input
                      type="text"
                      value={workspaceSettings.whatsappNumber}
                      onChange={(e) =>
                        setWorkspaceSettings({
                          ...workspaceSettings,
                          whatsappNumber: e.target.value,
                        })
                      }
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-sm">
                      Office Address
                    </span>
                  </label>
                  <input
                    type="text"
                    value={workspaceSettings.officeAddress}
                    onChange={(e) =>
                      setWorkspaceSettings({
                        ...workspaceSettings,
                        officeAddress: e.target.value,
                      })
                    }
                    className="input input-bordered w-full"
                  />
                </div>

                {/* Operational Toggles */}
                <div className="pt-2 border-t border-base-200 space-y-3">
                  <h3 className="font-bold text-sm uppercase tracking-wider opacity-70">
                    Workspace Operations
                  </h3>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-base-200/50 border border-base-200">
                    <div>
                      <p className="font-semibold text-sm">
                        Accepting New Client Orders
                      </p>
                      <p className="text-xs opacity-60">
                        Allow clients to place new service orders from the
                        pricing & services pages.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-success"
                      checked={workspaceSettings.acceptingNewOrders}
                      onChange={(e) =>
                        setWorkspaceSettings({
                          ...workspaceSettings,
                          acceptingNewOrders: e.target.checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-base-200/50 border border-base-200">
                    <div>
                      <p className="font-semibold text-sm">
                        Enable Team Points Leaderboard
                      </p>
                      <p className="text-xs opacity-60">
                        Display monthly point rankings and performance badges to
                        team members.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={workspaceSettings.enableLeaderboard}
                      onChange={(e) =>
                        setWorkspaceSettings({
                          ...workspaceSettings,
                          enableLeaderboard: e.target.checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-base-200/40 border-t border-base-200 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingWorkspace}
                  className="btn btn-primary gap-2 font-semibold"
                >
                  <LuSave className="size-4" /> Save Workspace Settings
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
