import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaThreads,
  FaTiktok,
  FaUpwork,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <>
      <footer className="bg-base-200">
        <div className="footer sm:footer-horizontal text-base-content p-10 px-5 max-w-[1426px] mx-auto">
          <aside>
            <img
              src="/assets/nexoro_logo.png"
              alt="nexoro logo"
              className="max-w-36"
            />
            <p>Creative strategy that drives real results</p>
          </aside>
          <nav>
            <h6 className="footer-title">Quick Links</h6>
            <Link href="/" className="link link-hover">
              Home
            </Link>
            <Link href="/#services" className="link link-hover">
              Services
            </Link>
            <Link href="/about-us" className="link link-hover">
              About us
            </Link>
            <Link href="/privacy-policy" className="link link-hover">
              Privacy Policy
            </Link>
          </nav>
          <nav>
            <h6 className="footer-title">Contact</h6>
            <a href="tel:+8801408431173">+8801408431173</a>
            <a href="mailto:nexorosolution@gmail.com">
              nexorosolution@gmail.com
            </a>
            <p>Khulna, Bagerhat-9300</p>
          </nav>
          <nav>
            <h6 className="footer-title">Social</h6>
            <div className="grid grid-flow-col gap-4">
              <a href="http://facebook.com/nexorosolution">
                <FaFacebook className="size-6 hover:text-main" />
              </a>
              <a href="https://www.instagram.com/nexorosolution">
                <FaInstagram className="size-6 hover:text-main" />
              </a>
              <a href="https://www.upwork.com/agencies/1948679868712020249">
                <FaUpwork className="size-6 hover:text-main" />
              </a>
              <a href="https://www.threads.com/@nexorosolution">
                <FaThreads className="size-6 hover:text-main" />
              </a>
              <a href="https://www.tiktok.com/@nexoro.solution">
                <FaTiktok className="size-6 hover:text-main" />
              </a>
            </div>
          </nav>
        </div>
      </footer>
      <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by
            Nexoro Solutions
          </p>
        </aside>
      </footer>
    </>
  );
};

export default Footer;
