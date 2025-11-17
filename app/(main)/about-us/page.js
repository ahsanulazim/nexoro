import CompanyDetails from "@/components/about/CompanyDetails";
import PartnerShip from "@/components/about/PartnerShip";
import ClientLogo from "@/components/ClientLogo";
import TitleBanner from "@/components/ui/TitleBanner";

const About = () => {
  return (
    <main>
      <TitleBanner />
      <CompanyDetails />
      <PartnerShip />
    </main>
  );
};

export default About;
