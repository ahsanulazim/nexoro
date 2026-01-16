'use client'

import Breadcrums from "./Breadcrums";
import { useEffect, useRef } from "react";
import { useAnimation, useInView, motion } from "motion/react";

const titleVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const TitleBanner = ({ children, subtitle }) => {

  const titleRef = useRef();
  const inView = useInView(titleRef, {
    once: true,
    amount: 0.2,
  });
  const titleControls = useAnimation();

  useEffect(() => {
    if (inView) {
      titleControls.start("visible");
    }
  }, [inView, titleControls]);

  return (
    <section ref={titleRef} className="h-64 xs:h-72 lg:h-96 flex flex-col justify-center bg-[url(/assets/Fractal-Glass.webp)] bg-no-repeat bg-cover relative">
      <div className="h-16 xs:h-24 lg:h-36 absolute top-0 bg-linear-to-t from-transparent to-gray-950 w-full"></div>
      <div className="max-w-[1426px] mx-auto p-5 flex flex-col items-center">
        <motion.h1 initial="hidden" variants={titleVariant} animate={titleControls} className="text-3xl lg:text-5xl font-semibold text-balance text-center mb-2 line-clamp-2">
          {children}
        </motion.h1>
        <motion.div initial="hidden" animate={titleControls} variants={titleVariant} >
          <Breadcrums subtitle={subtitle}>{children}</Breadcrums>
        </motion.div>
      </div>
    </section>
  );
};

export default TitleBanner;
