'use client'

import ContactForm from "../ui/ContactForm";
import { useEffect, useRef } from "react";
import { useAnimation, useInView, motion } from "motion/react";

const contactVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const formVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Contact = () => {

  const contactRef = useRef();
  const inView = useInView(contactRef, {
    once: true,
    amount: 0.2,
  });
  const contactControls = useAnimation();

  useEffect(() => {
    if (inView) {
      contactControls.start("visible");
    }
  }, [inView, contactControls]);

  return (
    <section ref={contactRef} id="contact">
      <div className="max-w-[1426px] max-lg:py-10 px-5 py-20 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-14 items-center">
          <motion.div initial='hidden' variants={contactVariant} animate={contactControls} className="lg:col-span-6">
            <img
              className="rounded-2xl"
              src="/assets/nexoro-team.jpg"
              alt="building"
            />
          </motion.div>
          <motion.div initial='hidden' variants={formVariant} animate={contactControls} className="lg:col-span-6">
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
