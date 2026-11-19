import Plans from "@/components/pricing/Plans";
import TitleBanner from "@/components/ui/TitleBanner";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
//export const instant = false;

const Pricing = () => {
  return (
    <main>
      <TitleBanner>Pricing</TitleBanner>
      <Plans />
    </main>
  );
};

export default Pricing;
