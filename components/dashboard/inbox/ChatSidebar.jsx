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
import { useParams, usePathname } from "next/navigation";
import DeleteChatModal from "./DeleteChatModal";
import { useQuery } from "@tanstack/react-query";
import api from "@/axios/axiosInstance";
import ConversationTabs from "./ConversationTabs";

const ChatSidebar = () => {
  const { message: currentRoom } = useParams();
  const { socket, onlineStatuses, unreadCounts, setConversations } =
    useSocket();
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(MyContext);
  const deleteRef = useRef();

  const pathName = usePathname();
  const platform = pathName.split("/").pop();

  const {
    data: conversations,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["conversations", platform],
    queryFn: async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const headers = { Authorization: `Bearer ${token}` };

        let data = [];

        if (platform === "inbox") {
          // Combine all platforms
          const [webRes, fbRes] = await Promise.all([
            api.get("/conversations/getSidebarConversations", { headers }),
            api.get("/facebook/conversations", { headers }),
          ]);
          const webData = webRes.data.success ? webRes.data.data : [];
          const fbData = fbRes.data.success ? fbRes.data.data : [];
          data = [...webData, ...fbData].sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
          );
        } else if (platform === "facebook") {
          const res = await api.get("/facebook/conversations", { headers });
          data = res.data.success ? res.data.data : [];
        } else if (platform === "whatsapp") {
          // Add whatsapp integration here later
          data = [];
        } else {
          // Default to web
          const res = await api.get("/conversations/getSidebarConversations", {
            headers,
          });
          data = res.data.success ? res.data.data : [];
        }

        setConversations(data);
        return data;
      } catch (err) {
        console.log("Error fetching sidebar:", err);
        return [];
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
        <ConversationTabs />
        <ul className="list w-80 px-4 overflow-y-auto h-[calc(100dvh-280px)]">
          {/* Sidebar content here */}
          {isLoading ? (
            Array.from({ length: 10 }).map((_, idx) => (
              <li key={idx} className="list-row">
                <div className="avatar">
                  <div className="size-10 skeleton rounded-full"></div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 skeleton rounded w-4/5"></div>
                  <div className="h-3 skeleton rounded w-1/2"></div>
                </div>
              </li>
            ))
          ) : isError ? (
            <p>Something went wrong</p>
          ) : !conversations || conversations.length === 0 ? (
            <p className="p-5 text-center">No conversation found</p>
          ) : (
            conversations?.map((conversation) => {
              const customerName =
                conversation?.customer?.userName ||
                conversation?.customer?.name ||
                "Customer";
              const customerId =
                conversation?.customer?._id || conversation?.customer?.id;
              const customerAvatar = conversation?.customer?.avatar;

              return (
                <li
                  key={conversation?._id || conversation?.roomId}
                  className="relative group"
                >
                  <Link
                    href={`/dashboard/inbox/${platform}/${conversation?.roomId}`}
                    className={`list-row cursor-pointer hover:bg-main-dark items-center ${
                      currentRoom === conversation?.roomId ? "bg-main-dark" : ""
                    }`}
                  >
                    <div
                      className={`avatar ${onlineStatuses[customerId] ? "avatar-online" : "avatar-offline"}`}
                    >
                      <div className="size-10 rounded-full bg-primary text-neutral-content">
                        {customerAvatar ? (
                          <img src={customerAvatar} alt="avatar" />
                        ) : (
                          <span className="text-xs uppercase font-bold grid place-items-center h-full">
                            {customerName.slice(0, 2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>{customerName}</div>
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
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
};

export default ChatSidebar;
