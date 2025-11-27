import Marquee from "react-fast-marquee";

const LogoMarquee = async () => {

  const clientData = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/clients`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  const logos = await clientData.json();

  return (
    <Marquee autoFill={true}>
      {logos.map((logo) => (
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
