import CompanyDetails from "@/components/about/CompanyDetails";
import PartnerShip from "@/components/about/PartnerShip";
import TitleBanner from "@/components/ui/TitleBanner";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
//export const instant = false;

const About = () => {
  return (
    <main>
      <TitleBanner>About Us</TitleBanner>
      <CompanyDetails />
      <PartnerShip />
    </main>
  );
};

export default About;
