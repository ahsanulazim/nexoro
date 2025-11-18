const TeamCard = ({ team }) => {
  return (
    <div className="card bg-base-300 shadow-sm">
      <figure>
        <img
          className="w-full"
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{team.name}</h2>
        <p>
          A card component has a figure, a body part, and inside body there are
          title and actions parts
        </p>
      </div>
    </div>
  );
};

export default TeamCard;
