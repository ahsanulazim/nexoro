import { LuMessageSquare } from "react-icons/lu";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
//export const instant = false;

const page = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 bg-base-100">
      <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-inner">
        <LuMessageSquare className="size-8" />
      </div>
      <h3 className="text-lg font-bold text-base-content">
        Select a conversation
      </h3>
      <p className="text-sm text-base-content/60 max-w-sm mt-1">
        Choose a chat from the sidebar on the left to start viewing messages,
        confirming orders, and managing customer details.
      </p>
    </div>
  );
};

export default page;
