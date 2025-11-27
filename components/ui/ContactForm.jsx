"use client";
import { useRef, useState } from "react";
import { LuBuilding, LuMail, LuSmartphone, LuUserRound } from "react-icons/lu";
import ContactModal from "./ContactModal";

const ContactForm = () => {
  const sendModal = useRef();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = {
      name: e.target.name.value,
      company: e.target.company.value,
      email: e.target.email.value,
      phone: e.target.phone.value.trim() === "" ? null : e.target.phone.value,
      message: e.target.message.value,
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      sendModal.current.showModal();
      e.target.reset();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ContactModal ref={sendModal} />
      <form className="fieldset" onSubmit={handleSubmit}>
        <h2 className="text-2xl md:text-3xl xl:text-5xl font-semibold">
          Let&apos;s Get in Touch
        </h2>
        <p className="text-gray-500 text-sm md:text-lg mb-5">
          or reach us manually at{" "}
          <a href="mailto:contact@nexoro.com" className="text-main font-semibold">
            contact@nexoro.com
          </a>
        </p>
        <label className="label">Name</label>
        <label className="input xl:input-md  w-full rounded-full mb-3">
          <LuUserRound />
          <input
            type="text"
            placeholder="Name"
            name="name"
            className="grow"
            required
          />
        </label>
        <label className="label">Company Name</label>
        <label className="input xl:input-md  w-full rounded-full mb-3">
          <LuBuilding />
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            className="grow"
          />
        </label>
        <label className="label">Email</label>
        <label className="input xl:input-md  w-full rounded-full mb-3">
          <LuMail />
          <input type="text" name="email" placeholder="Email" className="grow" required />
        </label>
        <label className="label">Phone</label>
        <label className="input xl:input-md  w-full rounded-full mb-3">
          <LuSmartphone />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            className="grow"
          />
        </label>
        <label className="label">Message</label>
        <textarea
          name="message"
          rows="4"
          className="textarea w-full rounded-2xl mb-5"
          placeholder="Write your query"
          required
        />

        <button
          type="submit"
          className={`btn btn-primary ${loading ? "" : "btn-nexoro-primary"} rounded-full`}
          disabled={loading ? true : false}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner"></span>
              loading
            </>
          ) : (
            <>Send</>
          )}
        </button>
      </form>
    </>
  );
};

export default ContactForm;
