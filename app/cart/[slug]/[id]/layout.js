import FooterYear from "@/components/FooterYear";
import Link from "next/link";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
//export const instant = false;

const layout = ({ children }) => {
  return (
    <main className="min-h-dvh flex flex-col justify-between">
      <div className="p-5 sm:px-10">
        <Link href="/" className="block max-w-fit">
          <img
            className="w-full max-w-36"
            src="/assets/nexoro_logo.png"
            alt="Nexoro Logo"
          />
        </Link>
      </div>
      {children}
      <FooterYear />
    </main>
  );
};

export default layout;
