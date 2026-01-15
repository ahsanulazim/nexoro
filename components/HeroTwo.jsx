'use client'

import { IoIosArrowForward } from "react-icons/io";
import Button from "./ui/Button";
import HeroMarquee from "./HeroMarquee";
import Badge from "./Badge";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import { useRef } from "react";

const HeroTwo = () => {


  const badgeRef = useRef()

  useGSAP(() => {
    const heroSplit = new SplitText(".heroTitle", { type: "chars, words" });
    const desSplit = new SplitText(".heroDes", { type: "lines" });

    gsap.from(heroSplit.words, {
      opacity: 0,
      yPercent: 100,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.05
    })

    gsap.from(desSplit.lines, {
      opacity: 0,
      yPercent: 100,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.05,
      delay: 0.7
    })

    gsap.from(badgeRef.current, {
      opacity: 0,
      yPercent: 100,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.05,
      delay: 0.5
    })

    gsap.from(".startBtn", {
      opacity: 0,
      xPercent: -100,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.05,
      delay: 0.7
    })

    gsap.from(".portBtn", {
      opacity: 0,
      xPercent: 100,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.05,
      delay: 0.7
    })

  }, [])

  return (
    <section className=" bg-[url('/hero.webp')] bg-cover bg-center bg-no-repeat pt-28 md:pt-40">
      <div className="hero mb-10 md:mb-20">
        <div className="hero-content text-center">
          <div className="">
            <Badge ref={badgeRef} />
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-balance heroTitle">
              Creative Strategy that Drives Real Results
            </h1>
            <p className="py-6 md:text-xl text-balance max-w-3xl mx-auto heroDes">
              We&apos;re a team of expert who&apos;ve been delivering digital
              success for more than a decade. Discover why businesses trust us
              to drive their growth.
            </p>
            <div className="max-xs:mt-5">
              <Link href="/pricing">
                <Button className="startBtn">Get Started</Button>
              </Link>
              <Link href="/#portfolio">
                <button className="btn sm:btn-lg btn-link no-underline text-white hover:text-main shadow-none portBtn">
                  Portfolio <IoIosArrowForward className="size-5 text-main" />
                </button>
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
