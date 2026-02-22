"use client";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useAnimation, useInView, motion } from "motion/react";
import GradText from "../ui/GradText";
import { useEffect, useRef } from "react";

const portVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Works = () => {

    const workRef = useRef();
    const inView = useInView(workRef, {
        once: true,
        amount: 0.2,
    });

    const portControls = useAnimation();

    useEffect(() => {
        async function sequence() {
            if (inView) {
                await portControls.start("visible");
            }
        }
        sequence();
    }, [inView, portControls]);

    return (
        <section ref={workRef}>
            <div className="max-w-[1426px] max-lg:py-10 px-5 py-20 mx-auto">
                <div className="max-w-4xl mx-auto mb-10">
                    <motion.h1 variants={portVariant} initial="hidden" animate={portControls} className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-balance">
                        Our <GradText>Best Works</GradText>
                    </motion.h1>
                </div>
                <Carousel
                    additionalTransfrom={0}
                    arrows={false}
                    autoPlaySpeed={3000}
                    centerMode={false}
                    className=""
                    containerClass="container"
                    dotListClass=""
                    draggable
                    focusOnSelect={false}
                    infinite
                    itemClass=""
                    keyBoardControl
                    minimumTouchDrag={80}
                    pauseOnHover
                    renderArrowsWhenDisabled={false}
                    renderButtonGroupOutside={false}
                    renderDotsOutside={false}
                    responsive={{
                        desktop: {
                            breakpoint: {
                                max: 3000,
                                min: 1024
                            },
                            items: 1
                        },
                        mobile: {
                            breakpoint: {
                                max: 464,
                                min: 0
                            },
                            items: 1
                        },
                        tablet: {
                            breakpoint: {
                                max: 1024,
                                min: 464
                            },
                            items: 1
                        }
                    }}
                    rewind={false}
                    rewindWithAnimation={false}
                    rtl={false}
                    shouldResetAutoplay
                    showDots={false}
                    sliderClass=""
                    slidesToSlide={1}
                    swipeable
                >
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1549989476-69a92fa57c36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
                            className="w-full m-auto rounded-xl"
                        />
                        <div className=" sm:absolute w-full sm:bottom-0 sm:p-6 text-gray-900 mt-5">
                            <div className="bg-white rounded-lg p-5 gap-5 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between sm:shadow-lg">
                                <h2 className="text-3xl font-bold">Branding Development Kit</h2>
                                <div className="flex max-xs:flex-col xs:items-center gap-3 xs:gap-10">
                                    <div>
                                        <h3 className="opacity-50">Published Date</h3>
                                        <p className="font-semibold">February 2026</p>
                                    </div>
                                    <div>
                                        <h3 className="opacity-50">Services</h3>
                                        <p className="font-semibold">Web Design and Development</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Carousel>
            </div>
        </section>
    )
}

export default Works