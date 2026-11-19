import PrivacyContent from "@/components/privacy/PrivacyContent";
import PrivacyNav from "@/components/privacy/PrivacyNav";
import TitleBanner from "@/components/ui/TitleBanner";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
//export const instant = false;

const PrivacyPolicy = () => {
  return (
    <main>
      <TitleBanner>Privacy Policy</TitleBanner>
      <section>
        <div className="max-w-[1426px] mx-auto p-5 md:py-10 lg:py-20 grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-10 relative items-start">
          <PrivacyNav />
          <PrivacyContent />
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
