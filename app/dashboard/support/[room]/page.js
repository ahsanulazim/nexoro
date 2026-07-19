import ChatNav from "@/components/dashboard/inbox/ChatNav";
import Conversation from "@/components/dashboard/inbox/Conversation";

const page = async ({ params }) => {
  const { room } = await params;

  return (
    <>
      <ChatNav />
      <Conversation currentRoom={room} />
    </>
  );
};

export default page;
