// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
//export const instant = false;

const page = () => {
  return (
    <main className="container mx-auto py-8 min-h-[calc(100dvh-80px)] flex items-center justify-center">
      <h2 className="text-8xl">Payment Cancelled</h2>
    </main>
  );
};

export default page;
