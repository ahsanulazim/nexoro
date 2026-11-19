import ChatNav from "@/components/dashboard/inbox/ChatNav";
import Conversation from "@/components/dashboard/inbox/Conversation";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
//export const instant = false;

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
