'use client'

import { IoIosArrowForward } from "react-icons/io";
import Button from "./ui/Button";
import HeroMarquee from "./HeroMarquee";
import Link from "next/link";
import { motion, useAnimation } from "motion/react"
import { useEffect } from "react";
import { FaStar } from "react-icons/fa6";
import { IoArrowForwardCircle } from "react-icons/io5";

const sentence = "Creative Strategy that Drives Real Results";

const words = sentence.split(" ");

const h1Container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const h1Child = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
};

const badgeVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const buttonVariant = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const startButtonVariant = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};


const lines = [
  "We're a team of expert who've been delivering digital success for more than a decade.",
  "Discover why businesses trust us to drive their growth."
];

const pContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const pChild = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};



const HeroTwo = () => {

  const h1Controls = useAnimation();
  const pControls = useAnimation();
  const badgeControl = useAnimation();

  useEffect(() => {
    async function sequence() {
      await h1Controls.start("visible");
      await pControls.start("visible");
      await badgeControl.start("visible")
    }
    sequence();
  }, [h1Controls, pControls]);


  return (
    <section className=" bg-[url('/hero.webp')] bg-cover bg-center bg-no-repeat pt-28 md:pt-40">
      <div className="hero mb-10 md:mb-20">
        <div className="hero-content text-center">
          <div className="">
            <motion.span variants={badgeVariant} initial="hidden" animate={badgeControl} className="badge md:badge-lg rounded-full mb-2 md:mb-5 shadow-md" data-theme="light"><span className="font-black">5</span><FaStar className="text-yellow-500" />Rated By Thousands</motion.span>
            <motion.h1 initial="hidden" animate={h1Controls} variants={h1Container} className="text-4xl sm:text-6xl lg:text-8xl font-bold text-balance heroTitle">
              {words.map((word, i) => (
                <motion.span key={i} variants={h1Child} className="mr-5 inline-block">
                  {word}
                </motion.span>
              ))}

            </motion.h1>
            <motion.div
              variants={pContainer}
              initial="hidden"
              animate={pControls}
              className="py-6 md:text-lg max-w-3xl mx-auto heroDes"
            >
              {lines.map((line, i) => (
                <motion.p key={i} variants={pChild} className="text-balance">
                  {line}
                </motion.p>
              ))}
            </motion.div>

            <div className="max-xs:mt-5">
              <Link href="/pricing">
                <motion.button variants={startButtonVariant} initial="hidden" animate={badgeControl} className="btn sm:btn-lg btn-nexoro">
                  Get Started <IoArrowForwardCircle className="size-8 sm:size-11" />
                </motion.button>
              </Link>
              <Link href="/#portfolio">
                <motion.button variants={buttonVariant} initial="hidden" animate={badgeControl} className="btn sm:btn-lg btn-link no-underline text-white hover:text-main shadow-none portBtn">
                  Portfolio <IoIosArrowForward className="size-5 text-main" />
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1426px] mx-auto px-5 -mb-5">
        <HeroMarquee />
      </div>
    </section>
  );
};

export default HeroTwo;
