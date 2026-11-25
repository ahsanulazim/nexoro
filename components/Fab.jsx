import { FaWhatsapp } from "react-icons/fa6";

const Fab = () => {
  return (
    <a href="https://wa.me/+8801408431173" className="fab">
      <button className="btn btn-lg btn-circle btn-primary bg-main border-main">
        <FaWhatsapp />
      </button>
    </a>
  );
};

export default Fab;
