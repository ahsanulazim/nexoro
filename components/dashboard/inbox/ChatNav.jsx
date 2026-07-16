"use client";
import Status from "@/components/ui/Status";
import { useSocket } from "@/context/SocketProvider";
import { useParams } from "next/navigation";

const ChatNav = () => {
  const { message: currentRoom } = useParams();
  const { onlineStatuses, conversations } = useSocket();
  const currentConversation = conversations?.find(
    (c) => c?.roomId === currentRoom,
  );
  const isOnline = currentConversation
    ? onlineStatuses[currentConversation.customer._id]
    : false;

  return (
    <div className="navbar bg-base-300 shadow-sm px-4 justify-between border-b border-base-100">
      <div className="flex items-center gap-2">
        <div>
          <h3 className="font-bold text-lg">
            {currentConversation?.customer?.userName || "Customer Support"}
          </h3>
          {currentConversation?.customer && (
            <span className="text-xs block">
              {isOnline ? (
                <>
                  <Status type="success" /> Active
                </>
              ) : (
                <>
                  <Status type="error" /> Offline
                </>
              )}
            </span>
          )}
        </div>
      </div>
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatNav;
