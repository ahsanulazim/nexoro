"use client";
import { useState } from "react";
import { LuBuilding, LuMail, LuSmartphone, LuUserRound } from "react-icons/lu";

const ContactForm = () => {
  const [loading, setLoading] = useState(false);

  return (
    <form className="fieldset">
      <h2 className="text-2xl md:text-3xl lg:text-5xl font-semibold">
        Let&apos;s Get in Touch
      </h2>
      <p className="text-gray-500 text-sm md:text-lg mb-5">
        or reach us manually at{" "}
        <a href="mailto:contact@nexoro.com" className="text-main font-semibold">
          contact@nexoro.com
        </a>
      </p>
      <label className="label">Name</label>
      <label className="input input-md  w-full rounded-full mb-3">
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
      <label className="input input-md  w-full rounded-full mb-3">
        <LuBuilding />
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          className="grow"
        />
      </label>
      <label className="label">Email</label>
      <label className="input input-md  w-full rounded-full mb-3">
        <LuMail />
        <input type="text" name="email" placeholder="Email" className="grow" />
      </label>
      <label className="label">Phone</label>
      <label className="input input-md  w-full rounded-full mb-3">
        <LuSmartphone />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          className="grow"
          required
        />
      </label>
      <label className="label">Message</label>
      <textarea
        name="message"
        rows="6"
        className="textarea w-full rounded-2xl mb-5"
        placeholder="Write your query"
        required
      />

      <button
        type="submit"
        className="btn btn-primary bg-main border-main rounded-full"
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
  );
};

export default ContactForm;
