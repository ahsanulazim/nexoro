"use client";

import {
  LuEllipsis,
  LuEllipsisVertical,
  LuMessageCircle,
  LuTrash2,
  LuTriangleAlert,
} from "react-icons/lu";
import SearchChat from "./SearchChat";
import { useSocket } from "@/context/SocketProvider";
import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "@/context/MyProvider";
import { auth } from "@/firebase/firebase.config";
import Link from "next/link";
import { useParams } from "next/navigation";
import DeleteChatModal from "./DeleteChatModal";
import { useQuery } from "@tanstack/react-query";
import api from "@/axios/axiosInstance";

const ChatSidebar = () => {
  const { message: currentRoom } = useParams();
  const { socket, onlineStatuses, unreadCounts, setConversations } =
    useSocket();
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(MyContext);
  const deleteRef = useRef();

  const {
    data: conversations,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      try {
        const token = await auth.currentUser?.getIdToken();

        const res = await api.get("/conversations/getSidebarConversations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setConversations(res.data.data);
          return res.data.data;
        }
      } catch (err) {
        console.log("Error fetching sidebar:", err);
      }
    },
  });

  useEffect(() => {
    if (!socket) return;
    // রিয়েলটাইমে নতুন কোনো কাস্টমার মেসেজ দিলে সাইডবার আপডেট হবে
    socket.on("newConversationUpdate", () => {
      refetch();
    });

    return () => {
      socket.off("newConversationUpdate");
    };
  }, [socket, currentUser]);

  const handleDeleteChat = (conversation) => {
    deleteRef.current.showModal();
    setChat(conversation);
  };

  return (
    <div className="drawer-side h-[calc(100dvh-96px)] bg-base-200">
      <DeleteChatModal ref={deleteRef} chat={chat} />
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
          {isLoading ? (
            <p className="p-5">Loading...</p>
          ) : isError ? (
            <p>Something went wrong</p>
          ) : !conversations || conversations.length === 0 ? (
            <p className="p-5 text-center">No conversation found</p>
          ) : (
            conversations?.map((conversation) => (
              <li key={conversation?._id} className="relative group">
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
                <div className="dropdown dropdown-end absolute top-1/2 right-5 z-50 -translate-y-1/2 hidden group-hover:inline-block">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn m-1 btn-circle btn-sm"
                  >
                    <LuEllipsis />
                  </div>
                  <ul
                    tabIndex="-1"
                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-2 shadow-sm"
                  >
                    <li>
                      <a>
                        <LuTriangleAlert /> Close Chat
                      </a>
                    </li>
                    <li>
                      <button onClick={() => handleDeleteChat(conversation)}>
                        <LuTrash2 /> Delete Chat
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ChatSidebar;
