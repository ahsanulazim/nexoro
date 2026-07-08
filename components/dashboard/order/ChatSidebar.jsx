import { LuEllipsisVertical, LuMessageCircle } from "react-icons/lu";
import SearchChat from "../inbox/SearchChat";

const ChatSidebar = () => {
  return (
    <div className="drawer-side h-[calc(100dvh-96px)] bg-base-200">
      <div className="flex flex-col">
        <div className="p-5 bg-base-300">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <LuMessageCircle className="text-2xl" />
              <span className="text-xl font-semibold">Inbox</span>
            </div>
            <button className="btn btn-circle">
              <LuEllipsisVertical />
            </button>
          </div>
          <SearchChat />
        </div>
        <ul className="list w-80 px-4 overflow-y-auto h-[calc(100dvh-232px)]">
          {/* Sidebar content here */}
          <li className="list-row cursor-pointer hover:bg-main-dark">
            <div>
              <img
                className="size-10 rounded-full"
                src="https://img.daisyui.com/images/profile/demo/1@94.webp"
              />
            </div>
            <div>
              <div>Dio Lupa</div>
              <div className="text-xs uppercase font-semibold opacity-60">
                Remaining Reason
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatSidebar;
