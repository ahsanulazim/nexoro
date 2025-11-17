import ContactForm from "../ui/ContactForm";

const Contact = () => {
  return (
    <section id="contact">
      <div className="max-w-[1426px] max-lg:py-10 px-5 py-20 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-14 items-center">
          <div className="lg:col-span-6">
            <img
              className="rounded-2xl"
              src="/assets/nexoro-team.jpg"
              alt="building"
            />
          </div>
          <div className="lg:col-span-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
