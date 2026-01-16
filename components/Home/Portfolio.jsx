"use client";

import GradText from "../ui/GradText";
import portfolios from "@/json/portfolio.json";
import PortfolioCard from "../ui/PortfolioCard";
import { useEffect, useRef } from "react";
import { useAnimation, useInView, motion } from "motion/react";

const portVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const gridVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2, // each card delayed by 0.2s
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Portfolio = () => {

  const portRef = useRef();
  const inView = useInView(portRef, {
    once: true,
    amount: 0.2,
  });
  const portControls = useAnimation();
  const cardControls = useAnimation();

  useEffect(() => {
    async function sequence() {
      if (inView) {
        await portControls.start("visible");
        await cardControls.start("visible");
      }
    }
    sequence();
  }, [inView, portControls, cardControls]);


  return (
    <section ref={portRef} className="bg-base-300" id="services">
      <div className="max-w-[1426px] px-5 py-20 mx-auto z-10">
        <div className="max-w-4xl mx-auto mb-10">
          <motion.h1 variants={portVariant} initial="hidden" animate={portControls} className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-balance">
            Nexoro Offers a Full Suite of <GradText>Digital Services</GradText>
          </motion.h1>
        </div>
        <motion.div variants={gridVariant} initial="hidden" animate={cardControls} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {portfolios.map((project) => (
            <PortfolioCard key={project.title} project={project} variants={cardVariant} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
