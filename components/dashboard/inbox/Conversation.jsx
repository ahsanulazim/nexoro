"use client";
import api from "@/axios/axiosInstance";
import { MyContext } from "@/context/MyProvider";
import { useSocket } from "@/context/SocketProvider";
import { auth } from "@/firebase/firebase.config";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import {
  LuArrowUp,
  LuFile,
  LuImage,
  LuPaperclip,
  LuSend,
  LuX,
} from "react-icons/lu";
import { toast } from "react-toastify";

const Conversation = ({ currentRoom }) => {
  const { socket, conversations } = useSocket();
  const { currentUser } = useContext(MyContext);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const chatBottomRef = useRef(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const role = currentUser?.user?.role;

  const handleLoadMore = async () => {
    if (loading || !hasMore || !currentRoom) return;

    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();

      const res = await api.get("/conversations/getMessages", {
        params: {
          roomId: currentRoom,
          page: page + 1,
          limit: 20,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = res.data;
      if (result.success && result.data?.length > 0) {
        // নতুন লোড হওয়া মেসেজগুলো পুরোনো মেসেজের আগে যোগ হবে (reverse করে)
        setMessages((prev) => [...result.data.reverse(), ...prev]);
        setPage((prev) => prev + 1);
        setHasMore(result.pagination?.hasMore ?? false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.log("Error loading more messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // ১. রুম চেঞ্জ হলে মেসেজ হিস্ট্রি ফেচ করা
  useEffect(() => {
    if (!currentRoom || !currentUser || !socket) return;

    const joinRoom = () => {
      socket.emit("joinRoom", { roomId: currentRoom });
      socket.emit("markAsRead", { roomId: currentRoom });
    };

    if (socket.connected) {
      joinRoom();
    }

    socket.on("connect", joinRoom);

    const fetchMessages = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();

        const res = await api.get("/conversations/getMessages", {
          params: {
            roomId: currentRoom,
            page: 1,
            limit: 20,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = res.data;
        if (result.success) {
          setMessages(result.data);
          setPage(1);
          setHasMore(result.pagination?.hasMore ?? false);
          // মেসেজ লোড হওয়ার সাথে সাথে স্ক্রোল ডাউন
          setTimeout(
            () =>
              chatBottomRef.current?.scrollIntoView({ behavior: "instant" }),
            50,
          );
        }
      } catch (err) {
        console.log("Error fetching messages:", err);
      }
    };

    fetchMessages();

    return () => {
      socket.off("connect", joinRoom);
      socket.emit("leaveRoom", { roomId: currentRoom });
    };
  }, [currentRoom, currentUser, socket]);

  // ২. রিয়েলটাইম মেসেজ রিসিভ লিসেনার
  useEffect(() => {
    if (!socket || !currentRoom) return;

    const handleReceiveMessage = (newMsg) => {
      if (newMsg.roomId === currentRoom) {
        setMessages((prev) => [...prev, newMsg]);
        setTimeout(
          () => chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }),
          50,
        );

        // যদি অন্য কেউ মেসেজ পাঠায় তবে লাইভ markAsRead ট্রিগার হবে
        if (newMsg.senderRole !== role) {
          socket.emit("markAsRead", { roomId: currentRoom });
        }
      }
    };

    const handleMessagesRead = ({ roomId }) => {
      if (roomId === currentRoom) {
        setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messagesRead", handleMessagesRead);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [socket, currentRoom, role]);

  // ৩. মেসেজ সাবমিট হ্যান্ডলার (FormData vs Socket.io)
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    let receiverId = "admin";
    if (role === "admin") {
      const currentConversation = conversations?.find(
        (c) => c.roomId === currentRoom,
      );
      if (currentConversation?.customer?._id) {
        receiverId = currentConversation.customer._id;
      } else {
        const customerMsg = messages.find((m) => m.senderRole !== "admin");
        if (customerMsg) receiverId = customerMsg.senderId;
      }
    }

    if (file) {
      // ফাইল থাকলে HTTP POST (Multipart FormData) রিকোয়েস্ট যাবে
      if (file.size > 1024 * 1024 * 5) {
        return toast.error("File size must be less than 5MB");
      }
      try {
        const token = await auth.currentUser.getIdToken();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("text", text);
        formData.append("receiverId", receiverId);
        formData.append("folder", "chat_attachments");
        if (replyTo) {
          formData.append("replyTo", JSON.stringify(replyTo));
        }

        // স্টেট ক্লিয়ার
        setFile(null);
        setText("");
        setReplyTo(null);

        await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/conversations/sendMessage`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          },
        );
      } catch (err) {
        console.log("Error uploading attachment:", err);
      }
    } else {
      // শুধু টেক্সট হলে সরাসরি আল্ট্রা-ফাস্ট Socket.io ইমিট
      const payload = {
        text,
        receiverId,
        replyTo: replyTo
          ? {
              messageId: replyTo.messageId,
              senderId: replyTo.senderId,
              text: replyTo.text,
              attachments: replyTo.attachments,
            }
          : null,
      };

      socket.emit("sendMessage", payload);
      setText("");
      setReplyTo(null);
    }
  };

  if (!currentRoom) {
    return (
      <div className="h-[calc(100dvh-240px)] grid place-items-center text-base-content/50 bg-base-100">
        Select a conversation to start chatting.
      </div>
    );
  }

  return (
    <div className="bg-base-100">
      <div
        ref={chatEndRef}
        className="p-5 overflow-y-auto space-y-3"
        style={{ height: `calc(100dvh - ${replyTo ? 309 : 241}px)` }}
      >
        {hasMore && (
          <div className="flex justify-center py-4">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="btn btn-sm rounded-full"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <LuArrowUp />
                  Load more
                </>
              )}
            </button>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderRole === role;

          return (
            <div
              key={msg._id}
              className={`chat ${isMe ? "chat-end" : "chat-start"}`}
            >
              {/* রিপ্লাই করা ওরিজিনাল মেসেজ প্রিভিউ */}

              <div className="chat-bubble relative group max-w-[75%] p-2">
                {msg.replyTo && (
                  <div className="border-l-3 rounded-sm border-l-info chat-header opacity-60 text-xs bg-base-100 p-2 pointer-events-none mb-1">
                    <p className="truncate">
                      {msg.replyTo.text || "📄 Attachment"}
                    </p>
                  </div>
                )}
                {/* ফাইল অ্যাটাচমেন্ট থাকলে ইমেজ/ডকুমেন্ট রেন্ডার */}
                {msg.attachments?.map((att, i) => (
                  <div
                    key={i}
                    className="mb-1 max-w-xs rounded-lg overflow-hidden"
                  >
                    {att.type === "image" ? (
                      <a href={att.url} target="_blank" rel="noreferrer">
                        <img
                          src={att.thumbnailUrl}
                          alt="attachment"
                          className="w-full object-cover max-h-48"
                        />
                      </a>
                    ) : (
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 p-2 bg-black/20 text-xs rounded hover:underline"
                      >
                        <LuFile /> {att.originalName || "View Document"}
                      </a>
                    )}
                  </div>
                ))}

                {msg.text && (
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                )}

                {/* হোভার রিপ্লাই বাটন */}
                <button
                  type="button"
                  onClick={() =>
                    setReplyTo({
                      messageId: msg._id,
                      senderId: msg.senderId,
                      text: msg.text,
                      attachments: msg.attachments,
                    })
                  }
                  className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 btn btn-circle btn-xs btn-neutral border border-base-300 transition-opacity ${
                    isMe ? "-left-8" : "-right-8"
                  }`}
                >
                  ↩
                </button>
              </div>

              <div className="chat-footer text-[10px] mt-0.5 flex items-center gap-1">
                <span className="opacity-70">
                  {moment(msg.createdAt).calendar()}
                </span>
                {isMe && (
                  <span>
                    {msg.isRead ? (
                      <IoCheckmarkDoneSharp className="text-info text-sm" />
                    ) : (
                      <IoCheckmarkDoneSharp className="text-sm" />
                    )}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={chatBottomRef} />
      </div>
      {/* ইনপুট এরিয়া */}
      <div className="p-5 bg-base-300 border-t border-base-200 space-y-2">
        {/* একটিভ রিপ্লাই বার */}
        {replyTo && (
          <div className="flex items-center justify-between bg-base-200 border-l-4 border-l-info px-3 py-1 rounded-md text-xs mb-5">
            <span className="truncate flex-1">
              {replyTo.text || "Attachment"}
            </span>
            <button
              onClick={() => setReplyTo(null)}
              className="btn btn-circle btn-ghost btn-error"
            >
              <LuX />
            </button>
          </div>
        )}

        {/* ফাইল সিলেক্টেড ব্যাজ */}
        {file && (
          <div className="badge badge-info gap-2 p-3 text-xs">
            <LuPaperclip /> {file.name}
            <button onClick={() => setFile(null)} className="hover:text-error">
              <LuX />
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="flex items-end gap-2">
          <div className="input w-full flex items-center gap-2 bg-red rounded-xl">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              type="text"
              placeholder="Write a message..."
              className="grow bg-transparent focus:outline-none"
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              id="chat-file"
              hidden
            />
            <label
              htmlFor="chat-file"
              className="btn btn-ghost btn-circle btn-sm text-lg cursor-pointer"
            >
              <LuPaperclip />
            </label>
          </div>
          <button type="submit" className="btn btn-circle btn-info">
            <LuSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Conversation;
