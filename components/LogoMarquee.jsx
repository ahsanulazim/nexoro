'use client'

import { useQuery } from "@tanstack/react-query";
import Marquee from "react-fast-marquee";

const LogoMarquee = () => {

  const { data, isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const clientData = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/clients`, {
        method: "GET", headers: { "Content-Type": "application/json", },
      });
      return clientData.json();
    }
  });

  const logos = data?.filter((slider) => slider.slider === true) || [];

  return (
    <Marquee autoFill={true}>
      {isLoading || error ? <div className="w-3xs h-24 skeleton mr-10"></div> : logos.map((logo) => (
        <img
          className="max-w-32 sm:max-w-40 xl:max-w-60 max-h-14 mr-10"
          src={logo.logo}
          alt={logo.company}
          key={logo.company}
          draggable="false"
        />
      ))}
    </Marquee>
  );
};

export default LogoMarquee;
