'use client'

import GradText from "../ui/GradText";
import WorkMarquee from "../ui/WorkMarquee";
import { useEffect, useRef } from "react";
import { useAnimation, useInView, motion } from "motion/react";

const prevVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const PreviousWork = () => {

  const prevRef = useRef();
  const inView = useInView(prevRef, {
    once: true,
    amount: 0.2,
  });
  const prevControls = useAnimation();

  useEffect(() => {
    async function sequence() {
      if (inView) {
        await prevControls.start("visible");
      }
    }
    sequence();
  }, [inView, prevControls]);

  return (
    <section ref={prevRef} className="bg-base-300" id="portfolio">
      <div className=" py-10 lg:py-20">
        <div className="max-w-4xl mx-auto mb-10">
          <motion.h1 initial="hidden" variants={prevVariant} animate={prevControls} className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-balance">
            We Combine <GradText> Creative</GradText> Storytelling Strategy
          </motion.h1>
        </div>
        <div>
          <WorkMarquee />
        </div>
      </div>
    </section>
  );
};

export default PreviousWork;
