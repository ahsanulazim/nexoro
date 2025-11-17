import Link from "next/link";

const CompanyDetails = () => {
  return (
    <section>
      <div className="max-w-[1426px] mx-auto px-5 py-10 lg:py-20 grid gap-5 xl:gap-10 grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h1 className="text-2xl sm:text-4xl xl:text-5xl font-semibold mb-5 text-balance">
            We help brands grow through smart marketing and creative design
          </h1>
          <p className="text-gray-400 text-sm sm:text-base xl:text-lg">
            At{" "}
            <Link href="/" className="text-base-content font-semibold">
              Nexoro Solutions
            </Link>
            , We are a Marketing & Design agency helping brands grow with smart
            strategies, impactful campaigns, and creative visuals. Our goal is
            simple, to turn your vision into success.
          </p>
          <br />
          <p className="text-gray-400 text-sm sm:text-base xl:text-lg">
            We think different. At our agency, we don&apos;t just follow trends,
            we set them. Every project we take on is an opportunity to combine
            creativity, strategy, and technology to craft unique solutions that
            make brands stand out.
          </p>
          <br />
          <p className="text-gray-400 text-sm sm:text-base xl:text-lg">
            From digital marketing and branding to graphic design and campaign
            management, we focus on delivering impactful results that connect
            with audiences and drive growth. Our team believes in thinking
            outside the box, challenging the ordinary, and turning bold ideas
            into meaningful experiences.
          </p>
          <br />
          <p className="text-gray-400 text-sm sm:text-base xl:text-lg">
            We&apos;re passionate about helping brands tell their story, engage
            their audience, and achieve success that lasts. For us, every detail
            matters — because we know that the smallest idea, when executed
            creatively, can create the biggest impact.
          </p>
        </div>
        <div className="lg:col-span-6">
          <img
            src="/assets/nexoro-team.jpg"
            alt="Nexoro Team"
            className="rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default CompanyDetails;
