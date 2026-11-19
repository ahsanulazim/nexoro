import ChatNav from "@/components/dashboard/inbox/ChatNav";
import Conversation from "@/components/dashboard/inbox/Conversation";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
//export const instant = false;

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
