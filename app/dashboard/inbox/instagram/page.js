// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
//export const instant = false;

const page = () => {
  return (
    <div className="h-[calc(100dvh-96px)] grid place-items-center text-base-content/50 bg-base-100">
      Select an Instagram conversation to start chatting.
    </div>
  );
};

export default page;
