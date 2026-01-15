"use client";


import GradText from "../ui/GradText";
import portfolios from "@/json/portfolio.json";
import PortfolioCard from "../ui/PortfolioCard";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);


const Portfolio = () => {

  useGSAP(() => {
    gsap.from("#port h1", {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.05,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#port",
        start: "top 50%",
        toggleActions: "play none none reverse",
      },
    });

    gsap.from(".project-card", {
      opacity: 0,
      yPercent: 100,
      duration: 1,
      ease: "expo.out",
      stagger: 0.2,   // একটার পর একটা animate হবে
      delay: 0.5,
      scrollTrigger: {
        trigger: "#port",
        start: "top 50%",
        toggleActions: "play none none reverse",
      },
    });

  });



  return (
    <section className="bg-base-300" id="port">
      <div className="max-w-[1426px] px-5 py-20 mx-auto z-10">
        <div className="max-w-4xl mx-auto mb-10">
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-balance">
            Nexoro Offers a Full Suite of <GradText>Digital Services</GradText>
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {portfolios.map((project) => (
            <PortfolioCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
