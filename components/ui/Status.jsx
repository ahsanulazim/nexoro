const Status = ({ type }) => {
  return (
    <div className="inline-grid *:[grid-area:1/1]">
      <div
        className={`status ${type === "success" ? "status-success" : "status-error"} animate-ping`}
      ></div>
      <div
        className={`status ${type === "success" ? "status-success" : "status-error"}`}
      ></div>
    </div>
  );
};

export default Status;
