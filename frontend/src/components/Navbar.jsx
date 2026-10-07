import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="site-header">
      <nav className="nav container" aria-label="Main navigation">
        <Link className="brand" to="/" aria-label="CoastalCrafts home">
          CoastalCrafts
        </Link>
        <span className="nav-caption">A coastal craft gallery</span>
      </nav>
    </header>
  );
}
