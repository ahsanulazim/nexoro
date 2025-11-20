export const userInfo = (user) => ({
  name: user?.displayName || "N/A",
  email: user?.email || "N/A",
  phone: "+880",
  address: "Bangladesh",
  company: "Company Name",
  password: "••••••••••••",
  joined:
    new Date(user?.metadata?.creationTime).toLocaleString("en-BD", {
      timeZone: "Asia/Dhaka",
      dateStyle: "medium",
      timeStyle: "short",
    }) || "Unknown",
});
