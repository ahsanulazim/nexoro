import ClientLogo from "@/components/ClientLogo";
import HeroTwo from "@/components/HeroTwo";
import Contact from "@/components/Home/Contact";
import Portfolio from "@/components/Home/Portfolio";
import Review from "@/components/Home/Review";
import Teams from "@/components/Home/Teams";
import Works from "@/components/Home/Works";

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
