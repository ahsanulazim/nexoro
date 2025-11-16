import Marquee from "react-fast-marquee";

const LogoMarquee = () => {
  const logos = [
    {
      image: "/assets/brand/logoipsum-398.svg",
      title: "Brand 1",
    },
    {
      image: "/assets/brand/logoipsum-400.svg",
      title: "Brand 2",
    },
    {
      image: "/assets/brand/logoipsum-402.svg",
      title: "Brand 3",
    },
    {
      image: "/assets/brand/logoipsum-408.svg",
      title: "Brand 4",
    },
    {
      image: "/assets/brand/logoipsum-410.svg",
      title: "Brand 5",
    },
  ];

  return (
    <Marquee autoFill={true}>
      {logos.map((logo) => (
        <img
          className="max-w-32 sm:max-w-40 xl:max-w-60 mr-10"
          src={logo.image}
          alt={logo.title}
          key={logo.title}
        />
      ))}
    </Marquee>
  );
};

export default LogoMarquee;
