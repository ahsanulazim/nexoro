"use client";

import { LuEllipsisVertical, LuMessageCircle } from "react-icons/lu";
import SearchChat from "../inbox/SearchChat";
import { useSocket } from "@/context/SocketProvider";
import { useContext, useEffect } from "react";
import { MyContext } from "@/context/MyProvider";
import { auth } from "@/firebase/firebase.config";
import Link from "next/link";
import { useParams } from "next/navigation";

const ChatSidebar = () => {
  const { message: currentRoom } = useParams();
  const {
    socket,
    onlineStatuses,
    unreadCounts,
    conversations,
    setConversations,
  } = useSocket();
  const { currentUser } = useContext(MyContext);

  // ১. সাইডবার কনভার্সেশন লিস্ট লোড করা
  const fetchSidebar = async () => {
    if (!currentUser) return;
    try {
      const token = await auth.currentUser?.getIdToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/conversations/getSidebarConversations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = await res.json();
      if (result.success) {
        setConversations(result.data);
      }
    } catch (err) {
      console.log("Error fetching sidebar:", err);
    }
  };

  useEffect(() => {
    fetchSidebar();

    if (!socket) return;
    // রিয়েলটাইমে নতুন কোনো কাস্টমার মেসেজ দিলে সাইডবার আপডেট হবে
    socket.on("newConversationUpdate", () => {
      fetchSidebar();
    });

    return () => {
      socket.off("newConversationUpdate");
    };
  }, [socket, currentUser]);

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
          {conversations?.map((conversation) => (
            <li key={conversation?._id}>
              <Link
                href={`/dashboard/inbox/${conversation?.roomId}`}
                className={`list-row cursor-pointer hover:bg-main-dark items-center ${
                  currentRoom === conversation?.roomId ? "bg-main-dark" : ""
                }`}
              >
                <div
                  className={`avatar ${onlineStatuses[conversation?.customer._id] ? "avatar-online" : "avatar-offline"}`}
                >
                  <div className="size-10 rounded-full bg-primary text-neutral-content">
                    <span className="text-xs uppercase font-bold grid place-items-center h-full">
                      {conversation?.customer?.userName?.slice(0, 2) || "C"}
                    </span>
                  </div>
                </div>
                <div>
                  <div>{conversation?.customer?.userName}</div>
                  <div className="text-xs line-clamp-1 font-semibold opacity-60">
                    {conversation?.lastMessage}
                  </div>
                </div>
                {unreadCounts[conversation?.roomId] > 0 && (
                  <span className="badge badge-sm badge-info">
                    {unreadCounts[conversation?.roomId]}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatSidebar;
