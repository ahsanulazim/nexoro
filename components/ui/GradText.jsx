const GradText = ({ children, className }) => {
  return (
    <span className={`bg-linear-to-r from-main via-main-light to-main bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient ${className ? className : ""}`}>
      {children}
    </span>
  );
};

export default GradText;
