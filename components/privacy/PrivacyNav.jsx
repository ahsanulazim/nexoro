import Link from "next/link";

const PrivacyNav = () => {
  return (
    <ul className="menu p-0 md:col-span-3 w-full sticky top-30 hidden md:flex">
      <li className="menu-title">Privacy Policy</li>
      <li>
        <Link href="#info">Information We Collect</Link>
      </li>
      <li>
        <Link href="#useInfo">How We Use Your Information</Link>
      </li>
      <li>
        <Link href="#protection">Data Protection</Link>
      </li>
      <li>
        <Link href="#cookie">Cookies Policy</Link>
      </li>
      <li>
        <Link href="#thirdParty">Third-Party Services</Link>
      </li>
      <li>
        <Link href="#rights">Your Rights</Link>
      </li>
      <li>
        <Link href="#updates">Policy Updates</Link>
      </li>
      <li>
        <Link href="#contact">Contact Us</Link>
      </li>
    </ul>
  );
};

export default PrivacyNav;
