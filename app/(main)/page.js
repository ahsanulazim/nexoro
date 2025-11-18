import ClientLogo from "@/components/ClientLogo";
import Hero from "@/components/Hero";
import Contact from "@/components/Home/Contact";
import Portfolio from "@/components/Home/Portfolio";
import Review from "@/components/Home/Review";
import Services from "@/components/Home/Services";
import Teams from "@/components/Home/Teams";

export default function page() {
  return (
    <main>
      <Hero />
      <ClientLogo />
      <Services />
      <Portfolio />
      <Teams />
      <Contact />
      <Review />
    </main>
  );
}
