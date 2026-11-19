"use client";

import ChatSidebar from "@/components/dashboard/inbox/ChatSidebar";
import { useParams } from "next/navigation";

const InboxLayout = ({ children }) => {
  const params = useParams();
  const currentRoom = params?.message;
  const hasSelectedRoom = Boolean(currentRoom);

  return (
    <main className="flex flex-col">
      <section className="bg-base-100 rounded-box overflow-hidden border border-base-300/60 shadow-2xs">
        <div className="flex h-[calc(100dvh-98px)] w-full overflow-hidden relative">
          {/* Left Sidebar (Conversations List) */}
          <aside
            className={`h-full bg-base-100 border-r border-base-300 shrink-0 transition-all ${
              hasSelectedRoom
                ? "hidden lg:flex lg:w-80 xl:w-84"
                : "flex w-full lg:w-80 xl:w-84"
            }`}
          >
            <ChatSidebar />
          </aside>

          {/* Right Main Content (Active Chat or Empty Placeholder) */}
          <div
            className={`flex-1 flex-col min-w-0 h-full ${
              hasSelectedRoom ? "flex w-full" : "hidden lg:flex"
            }`}
          >
            {children}
          </div>
        </div>
      </section>
    </main>
  );
};

export default InboxLayout;
