export const getStoredProfileMeta = (email) => {
  if (typeof window === "undefined") return {};
  try {
    const key = email ? `nexoro_profile_${email}` : "nexoro_profile_default";
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveStoredProfileMeta = (email, meta) => {
  if (typeof window === "undefined") return;
  try {
    const key = email ? `nexoro_profile_${email}` : "nexoro_profile_default";
    localStorage.setItem(key, JSON.stringify(meta));
  } catch (err) {
    console.error("Failed to save profile metadata:", err);
  }
};

export const userInfo = (user) => {
  const saved = getStoredProfileMeta(user?.email);
  return {
    name: saved.name || user?.displayName || "N/A",
    email: user?.email || "N/A",
    phone: saved.phone || "+880",
    address: saved.address || "Bangladesh",
    company: saved.company || "Company Name",
    bio: saved.bio || "",
    jobTitle: saved.jobTitle || "",
    photoURL: saved.photoURL || user?.photoURL || "",
    password: "••••••••••••",
    joined: user?.metadata?.creationTime
      ? new Date(user.metadata.creationTime).toLocaleString("en-BD", {
          timeZone: "Asia/Dhaka",
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "Unknown",
  };
};
