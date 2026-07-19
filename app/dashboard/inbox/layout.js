import ChatSidebar from "@/components/dashboard/inbox/ChatSidebar";

const layout = ({ children }) => {
  return (
    <main className="flex flex-col gap-4">
      {/* <Msgs /> */}
      <section className="">
        <div className="bg-base-300 rounded-box overflow-hidden">
          <div className="drawer drawer-open">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">{children}</div>

            <ChatSidebar />
          </div>
        </div>
      </section>
    </main>
  );
};

export default layout;
