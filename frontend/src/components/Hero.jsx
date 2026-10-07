import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero container">
      <div className="hero-copy">
        <p className="eyebrow">Curated coastal heritage</p>
        <h1>Discover the crafts of coastal Karnataka.</h1>
        <p className="hero-text">
          Explore handcrafted heirlooms, woven textures, and timeless artistry from the
          shoreline communities that keep tradition alive.
        </p>
        <div className="hero-actions">
          <Link className="primary-button" to="/#explore">
            Explore Coastal Crafts
          </Link>
          <Link className="secondary-button" to="/crafts/kasuti">
            Browse a collection
          </Link>
        </div>
      </div>

      <div className="hero-visual" aria-label="Craft display collage">
        <div className="hero-card tall">
          <img
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"
            alt="Kasuti embroidered textiles"
          />
        </div>
        <div className="hero-card short">
          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
            alt="Wooden coastal craft furniture"
          />
        </div>
        <div className="hero-card accent">
          <span>Handwoven stories</span>
        </div>
      </div>
    </section>
  );
}
