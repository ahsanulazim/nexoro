import ChatNav from "@/components/dashboard/inbox/ChatNav";
import Conversation from "@/components/dashboard/inbox/Conversation";

const page = async ({ params }) => {
  const { message } = await params;

  return (
    <>
      <ChatNav />
      {/* Page content here */}
      <Conversation currentRoom={message} />
    </>
  );
};

export default page;
