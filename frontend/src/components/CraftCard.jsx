import { Link } from 'react-router-dom';

export default function CraftCard({ craft }) {
  return (
    <Link className="craft-card" to={`/crafts/${craft.id}`} aria-label={`Explore ${craft.name}`}>
      <div className="craft-image-wrap">
        <img src={craft.image} alt={craft.name} />
      </div>
      <div className="craft-card-body">
        <h3>{craft.name}</h3>
        <p>{craft.description}</p>
      </div>
    </Link>
  );
}
