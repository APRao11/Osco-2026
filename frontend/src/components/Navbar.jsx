import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Explore Crafts', to: '/#explore' },
];

export default function Navbar() {
  return (
    <header className="site-header">
      <nav className="nav container" aria-label="Main navigation">
        <Link className="brand" to="/" aria-label="CoastalCrafts home">
          CoastalCrafts
        </Link>
        <div className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/artisan/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Artisan Studio
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
