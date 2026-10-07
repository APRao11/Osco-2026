import React from 'react';
import { Link } from 'react-router-dom';
import { getCraftSlug } from '../data/craftRoutes';

export default function CraftCard({ craft }) {
  return (
    <Link
      className="craft-card"
      to={`/crafts/${getCraftSlug(craft)}`}
      aria-label={`Explore products in ${craft.name}`}
    >
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
