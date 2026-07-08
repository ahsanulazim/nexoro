import DashBread from "@/components/dashboard/DashBread";
import ChatNav from "@/components/dashboard/inbox/ChatNav";
import Conversation from "@/components/dashboard/inbox/Conversation";
import Msgs from "@/components/dashboard/inbox/Msgs";
import ChatSidebar from "@/components/dashboard/order/ChatSidebar";

const page = () => {
  return (
    <>
      <main className="flex flex-col gap-4">
        {/* <Msgs /> */}
        <section className="">
          <div className="bg-base-300 rounded-box overflow-hidden">
            <div className="drawer drawer-open">
              <input
                id="my-drawer-3"
                type="checkbox"
                className="drawer-toggle"
              />
              <div className="drawer-content flex flex-col">
                <ChatNav />
                {/* Page content here */}
                <Conversation />
                <label
                  htmlFor="my-drawer-3"
                  className="btn drawer-button lg:hidden"
                >
                  Open drawer
                </label>
              </div>

              <ChatSidebar />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default page;
