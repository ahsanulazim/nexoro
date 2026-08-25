import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

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

  return (
    <div role="tablist" className="tabs tabs-box">
      <Link
        href={mainLink}
        role="tab"
        className={`${platform === "inbox" ? "tab-active" : ""} tab flex-1`}
      >
        All
      </Link>
      <Link
        href={`${mainLink}/web`}
        role="tab"
        className={`${platform === "web" ? "tab-active" : ""} tab flex-1`}
      >
        Web
      </Link>
      <Link
        href={`${mainLink}/facebook`}
        role="tab"
        className={`${platform === "facebook" ? "tab-active" : ""} tab flex-1`}
      >
        Facebook
      </Link>
      <Link
        href={`${mainLink}/whatsapp`}
        role="tab"
        className={`${platform === "whatsapp" ? "tab-active" : ""} tab flex-1`}
      >
        Whatsapp
      </Link>
    </div>
  );
};

export default ConversationTabs;
