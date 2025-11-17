import Footer from "./Footer";
import Navbar from "./Navbar";
import DrawerNav from "./drawer/DrawerNav";

export default function Header({ children }) {
  const navItem = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "Services",
      link: "/#services",
    },
    {
      title: "Pricing",
      link: "/pricing",
    },
    {
      title: "About",
      link: "/about-us",
    },
  ];

  return (
    <div className="drawer drawer-end">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <Navbar />
        {/* Page content here */}
        {children}
        <Footer />
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {/* Sidebar content here */}
          {navItem.map((item) => (
            <DrawerNav key={item.title} link={item.link}>
              {item.title}
            </DrawerNav>
          ))}
        </ul>
      </div>
    </div>
  );
}
