'use client'

import GradText from "../ui/GradText";
import ReviewMarquee from "../ui/ReviewMarquee";
import { useEffect, useRef } from "react";
import { useAnimation, useInView, motion } from "motion/react";

const clientsVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Review = () => {

  const clientsRef = useRef();
  const inView = useInView(clientsRef, {
    once: true,
    amount: 0.2,
  });
  const clientsControls = useAnimation();

  useEffect(() => {
    if (inView) { clientsControls.start("visible") }
  }, [inView, clientsControls]);

  return (
    <section ref={clientsRef} className="bg-base-300">
      <div className=" max-sm:py-10 px-5 py-20 mx-auto z-10">
        <div className="max-w-4xl mx-auto mb-10">
          <motion.h1 initial="hidden" variants={clientsVariant} animate={clientsControls} className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-balance">
            The Best Reviews from <GradText>Clients</GradText>
          </motion.h1>
        </div>
        <div className="flex flex-col gap-4">
          <ReviewMarquee direction="left" />
          <ReviewMarquee direction="right" />
        </div>
      </div>
    </section>
  );
};

export default Review;
