import Link from "next/link";
import { LuGlobe, LuMail } from "react-icons/lu";

const PrivacyContent = () => {
  return (
    <div className="md:col-span-9">
      <p className="mb-5 text-gray-400">
        Welcome to Nexoro Solution. Your privacy is important to us. This
        Privacy Policy explains how we collect, use, and protect your personal
        information when you visit or interact with our website{" "}
        <Link href="/" className="text-white">
          https://nexorosolution.com
        </Link>{" "}
        or use our services.
      </p>
      <div className="mb-5" id="info">
        <h2 className="text-3xl lg:text-5xl font-semibold mb-3">
          Information We Collect
        </h2>
        <p className="text-gray-400">
          We may collect the following types of information:
        </p>
        <ul className="list-disc text-gray-400">
          <li>
            Personal Information: such as your name, email address, phone
            number, or company details when you fill out a form or contact us.
          </li>
          <li>
            Usage Data: including your browser type, IP address, device
            information, and browsing behavior on our site.
          </li>
          <li>
            Cookies: small files stored on your device to improve website
            performance and user experience.
          </li>
        </ul>
      </div>
      <div className="mb-5" id="useInfo">
        <h2 className="text-3xl lg:text-5xl font-semibold mb-3">
          How We Use Your Information
        </h2>
        <p className="text-gray-400">We use your information to:</p>
        <ul className="list-disc text-gray-400">
          <li>Respond to your inquiries and provide requested services</li>
          <li>Improve our website and service quality</li>
          <li>
            Send promotional emails or marketing updates (only if you opt in)
          </li>
          <li>Analyze traffic and performance to enhance user experience</li>
        </ul>
      </div>
      <div className="mb-5" id="protection">
        <h2 className="text-3xl lg:text-5xl font-semibold mb-3">
          Data Protection
        </h2>
        <p className="text-gray-400">
          We use secure technologies and standard security measures to protect
          your personal data from unauthorized access, alteration, or
          disclosure.
        </p>
      </div>
      <div className="mb-5" id="cookie">
        <h2 className="text-3xl lg:text-5xl font-semibold mb-3">
          Cookies Policy
        </h2>
        <p className="text-gray-400">
          Our website uses cookies to personalize content and analyze traffic.
          You can choose to disable cookies through your browser settings,
          though some site features may not function properly without them.
        </p>
      </div>
      <div className="mb-5" id="thirdParty">
        <h2 className="text-3xl lg:text-5xl font-semibold mb-3">
          Third-Party Services
        </h2>
        <p className="text-gray-400">
          We may use trusted third-party services such as Google Analytics, Meta
          Pixel, or email marketing tools. These services may collect anonymous
          usage data as per their own privacy policies.
        </p>
      </div>
      <div className="mb-5" id="rights">
        <h2 className="text-3xl lg:text-5xl font-semibold mb-3">Your Rights</h2>
        <p className="text-gray-400">You have the right to:</p>
        <ul className="list-disc text-gray-400">
          <li>Access, update, or delete your personal information</li>
          <li>Opt out of marketing communications</li>
          <li>Request details of how your data is used</li>
        </ul>
        <p className="text-gray-400">
          To exercise these rights, please contact us at{" "}
          <a href="mailto:info@nexorosolution.com" className="text-white">
            info@nexorosolution.com
          </a>
          .
        </p>
      </div>
      <div className="mb-5" id="updates">
        <h2 className="text-3xl lg:text-5xl font-semibold mb-3">
          Policy Updates
        </h2>
        <p className="text-gray-400">
          We may update this Privacy Policy periodically. Any changes will be
          posted on this page with an updated “Last Updated” date.
        </p>
      </div>
      <div id="contact">
        <h2 className="text-3xl lg:text-5xl font-semibold mb-3">Contact Us</h2>
        <p className="text-gray-400 mb-2">
          If you have any questions about this Privacy Policy or how we handle
          your data, please contact:
        </p>
        <ul>
          <li>
            <a
              href="mailto:info@nexorosolution.com"
              className="text-white flex items-center gap-2"
            >
              <LuMail /> info@nexorosolution.com
            </a>
          </li>
          <li>
            <Link href="/" className="flex items-center gap-2">
              <LuGlobe />
              nexorosolution.com
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyContent;
