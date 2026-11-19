import ClientLogo from "@/components/ClientLogo";
import HeroTwo from "@/components/HeroTwo";
import Contact from "@/components/Home/Contact";
import Portfolio from "@/components/Home/Portfolio";
import Review from "@/components/Home/Review";
import Teams from "@/components/Home/Teams";
import Works from "@/components/Home/Works";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
//export const instant = false;

export default function page() {
  return (
    <main>
      <HeroTwo />
      <ClientLogo />
      {/* <Services /> */}
      <Portfolio />
      <Works />
      <Teams />
      <Contact />
      <Review />
    </main>
  );
}
