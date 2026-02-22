"use client";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useAnimation, useInView, motion } from "motion/react";
import GradText from "../ui/GradText";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPortfolios } from "@/api/fetchPortfolios";
import PortCarousel from "../PortCarousel";
import PortSkeleton from "../skeleton/PortSkeleton";

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

    //fetch portfolio data and map through it to show in carousel
    const page = 1;
    const { data: portfolios, isLoading } = useQuery({
        queryKey: ["portfolios", page],
        queryFn: fetchPortfolios,
        keepPreviousData: true,
    });


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
                    autoPlay={true}
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
                    {isLoading ? Array.from({ length: 6 }).map((_, i) => (
                        <PortSkeleton key={i} />
                    )) : portfolios.portfolios.map((port) =>
                        port.carousel && <PortCarousel key={port._id} port={port} />
                    )}
                </Carousel>
            </div>
        </section>
    )
}

export default Works