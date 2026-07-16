import ChatNav from "@/components/dashboard/inbox/ChatNav";
import Conversation from "@/components/dashboard/inbox/Conversation";

const page = async ({ params }) => {
  const { message } = await params;

  console.log("response", message);

  return (
    <div className="drawer-content flex flex-col">
      <ChatNav />
      {/* Page content here */}
      <Conversation currentRoom={message} />
    </div>
  );
};

export default page;
