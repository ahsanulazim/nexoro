import Link from "next/link";
import { usePathname } from "next/navigation";

const ConversationTabs = () => {
  const pathName = usePathname();
  const mainLink = "/dashboard/inbox";
  const isActive = (href) =>
    pathName === href || pathName.includes(href.split("/").pop());

  return (
    <div role="tablist" className="tabs tabs-box">
      <Link
        href={mainLink}
        role="tab"
        className={`${pathName === mainLink ? "tab-active" : ""} tab flex-1`}
      >
        All
      </Link>
      <Link
        href={`${mainLink}/web`}
        role="tab"
        className={`${isActive(`${mainLink}/web`) ? "tab-active" : ""} tab flex-1`}
      >
        Web
      </Link>
      <Link
        href={`${mainLink}/facebook`}
        role="tab"
        className={`${isActive(`${mainLink}/facebook`) ? "tab-active" : ""} tab flex-1`}
      >
        Facebook
      </Link>
      <Link
        href={`${mainLink}/whatsapp`}
        role="tab"
        className={`${isActive(`${mainLink}/whatsapp`) ? "tab-active" : ""} tab flex-1`}
      >
        Whatsapp
      </Link>
    </div>
  );
};

export default ConversationTabs;
