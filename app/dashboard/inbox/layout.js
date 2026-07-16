"use client";
import ChatSidebar from "@/components/dashboard/order/ChatSidebar";
import { useSocket } from "@/context/SocketProvider";
import { useState } from "react";

const layout = ({ children }) => {
  const { setActiveUser } = useSocket();
  const [currentRoom, setCurrentRoom] = useState(null);

  const handleSelectRoom = (conv) => {
    setCurrentRoom(conv.roomId);
    setActiveUser(conv.customer);
  };

  return (
    <main className="flex flex-col gap-4">
      {/* <Msgs /> */}
      <section className="">
        <div className="bg-base-300 rounded-box overflow-hidden">
          <div className="drawer drawer-open">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">{children}</div>

            <ChatSidebar
              currentRoom={currentRoom}
              onSelectRoom={handleSelectRoom}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default layout;
