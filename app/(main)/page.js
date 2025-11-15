import ClientLogo from "@/components/ClientLogo";
import Hero from "@/components/Hero";
import Services from "@/components/Home/Services";

export default function page() {
  return (
    <main>
      <Hero />
      <ClientLogo />
      <Services />
    </main>
  );
}
