import React from "react";
import Marquee from "react-fast-marquee";
import ReviewCard from "./ReviewCard";

const ReviewMarquee = ({ direction }) => {
  return (
    <Marquee
      gradient={true}
      gradientColor="#15191e"
      autoFill={true}
      direction={direction}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <ReviewCard key={i} />
      ))}
    </Marquee>
  );
};

export default ReviewMarquee;
