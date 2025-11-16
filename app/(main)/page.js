import ClientLogo from "@/components/ClientLogo";
import Hero from "@/components/Hero";
import Contact from "@/components/Home/Contact";
import Portfolio from "@/components/Home/Portfolio";
import Review from "@/components/Home/Review";
import Services from "@/components/Home/Services";

export default function page() {
  return (
    <main>
      <Hero />
      <ClientLogo />
      <Services />
      <Portfolio />
      <Contact />
      <Review />
    </main>
  );
}
