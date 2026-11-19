import Link from "next/link";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
//export const instant = false;

const layout = ({ children }) => {
  return (
    <main>
      <div className="p-5 sm:p-10">
        <Link href="/">
          <img
            className="w-full max-w-36"
            src="/assets/nexoro_logo.png"
            alt="Nexoro Logo"
          />
        </Link>
      </div>
      <div className="p-5 pt-0 md:pb-5">{children}</div>
    </main>
  );
};

export default layout;
