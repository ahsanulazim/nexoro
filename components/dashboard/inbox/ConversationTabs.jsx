"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaGlobe,
  FaInbox,
} from "react-icons/fa6";

const ConversationTabs = () => {
  const pathName = usePathname();
  const { message: currentRoom } = useParams();
  const mainLink = "/dashboard/inbox";

  const pathParts = pathName.split("/").filter(Boolean);
  let platform = "inbox";
  if (pathParts.length > 2) {
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart === currentRoom) {
      platform = pathParts[pathParts.length - 2];
    } else {
      platform = lastPart;
    }
  }

  const tabs = [
    {
      id: "inbox",
      label: "All",
      href: mainLink,
      icon: FaInbox,
      activeColor: "tab-active text-primary font-semibold",
      badgeColor: "bg-primary/10 text-primary",
    },
    {
      id: "web",
      label: "Web",
      href: `${mainLink}/web`,
      icon: FaGlobe,
      activeColor: "tab-active text-indigo-500 font-semibold",
      badgeColor: "bg-indigo-500/10 text-indigo-500",
    },
    {
      id: "facebook",
      label: "Facebook",
      href: `${mainLink}/facebook`,
      icon: FaFacebookF,
      activeColor: "tab-active text-blue-600 font-semibold",
      badgeColor: "bg-blue-600/10 text-blue-600",
    },
    {
      id: "instagram",
      label: "Instagram",
      href: `${mainLink}/instagram`,
      icon: FaInstagram,
      activeColor: "tab-active text-pink-500 font-semibold",
      badgeColor: "bg-pink-500/10 text-pink-500",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: `${mainLink}/whatsapp`,
      icon: FaWhatsapp,
      activeColor: "tab-active text-emerald-500 font-semibold",
      badgeColor: "bg-emerald-500/10 text-emerald-500",
    },
  ];

  return (
    <div
      role="tablist"
      className="tabs tabs-box bg-base-200/60 p-1 rounded-xl flex gap-1"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = platform === tab.id;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            role="tab"
            className={`tab flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs transition-all rounded-lg ${
              isActive
                ? `${tab.activeColor} bg-base-100 shadow-sm`
                : "text-base-content/70 hover:text-base-content hover:bg-base-100/40"
            }`}
          >
            <Icon className={`text-xs ${isActive ? "" : "opacity-70"}`} />
            {/* <span className="hidden sm:inline font-medium">{tab.label}</span> */}
          </Link>
        );
      })}
    </div>
  );
};

export default ConversationTabs;
