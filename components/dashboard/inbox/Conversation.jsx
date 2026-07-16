"use client";
import api from "@/axios/axiosInstance";
import { MyContext } from "@/context/MyProvider";
import { useSocket } from "@/context/SocketProvider";
import { auth } from "@/firebase/firebase.config";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { LuImage, LuPaperclip, LuSend, LuX } from "react-icons/lu";

const Conversation = ({ currentRoom }) => {
  const { socket, activeUser } = useSocket();
  const { currentUser } = useContext(MyContext);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [replyTo, setReplyTo] = useState(null);

  const chatBottomRef = useRef(null);
  const role = currentUser?.user?.role;

  console.log("currentRoom", currentRoom);

  // ১. রুম চেঞ্জ হলে মেসেজ হিস্ট্রি ফেচ করা
  useEffect(() => {
    if (!currentRoom || !currentUser) return;

    if (socket) {
      socket.emit("joinRoom", { roomId: currentRoom });
      socket.emit("markAsRead", { roomId: currentRoom });
    }

    const fetchMessages = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();

        const res = await api.get("/conversations/getMessages", {
          params: {
            roomId: currentRoom,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = res.data;
        console.log("Message", result);
        if (result.success) {
          setMessages(result.data);
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
      if (socket) {
        socket.emit("leaveRoom", { roomId: currentRoom });
      }
    };
  }, [currentRoom, currentUser, socket]);

  // ২. রিয়েলটাইম মেসেজ রিসিভ লিসেনার
  useEffect(() => {
    if (!socket || !currentRoom) return;

    socket.on("receiveMessage", (newMsg) => {
      console.log("new message", newMsg);
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
    });

    socket.on("messagesRead", ({ roomId }) => {
      if (roomId === currentRoom) {
        setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messagesRead");
    };
  }, [socket, currentRoom, role]);

  // ৩. মেসেজ সাবমিট হ্যান্ডলার (FormData vs Socket.io)
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    const receiverId = role === "admin" ? activeUser?._id : "admin";

    if (file) {
      // ফাইল থাকলে HTTP POST (Multipart FormData) রিকোয়েস্ট যাবে
      try {
        const token = await auth.currentUser.getIdToken();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("text", text);
        formData.append("receiverId", receiverId);
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
        className="p-5 overflow-y-auto space-y-3"
        style={{ height: `calc(100dvh - ${replyTo ? 309 : 241}px)` }}
      >
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
                      <img
                        src={att.url}
                        alt="attachment"
                        className="w-full object-cover max-h-48"
                      />
                    ) : (
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 p-2 bg-black/20 text-xs rounded hover:underline"
                      >
                        📄 {att.originalName || "View Document"}
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
            📎 {file.name}
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
