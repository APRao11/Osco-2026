import React from 'react';
import { Anchor, LayoutDashboard, LogOut, Menu, Package, PlusCircle, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ArtisanNavbar({ currentPage, onNavigate, artisan, onLogout, productCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Artisan Profile', icon: User },
    { id: 'add-product', label: 'Add Product', icon: PlusCircle },
    { id: 'manage-products', label: 'Manage Products', icon: Package, badge: productCount },
  ];
  const go = (page) => {
    onNavigate(page);
    setMenuOpen(false);
  };
  const isActive = (id) => currentPage === id || (id === 'manage-products' && currentPage === 'edit-product');

  return (
    <header className="artisan-header">
      <div className="artisan-header-inner">
        <button onClick={() => go('dashboard')} className="artisan-brand-button">
          <span className="artisan-brand-mark">
            <Anchor className="artisan-icon artisan-icon-large" />
          </span>
          <span className="artisan-brand-copy">
            <span className="artisan-brand-name">Tide &amp; Timber</span>
            <span className="artisan-brand-subtitle">Artisan Studio</span>
          </span>
        </button>

        <nav className="artisan-nav-links" aria-label="Artisan navigation">
          {navItems.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`artisan-nav-button ${isActive(id) ? 'is-active' : ''}`}
            >
              <Icon className="artisan-icon" /> {label}
              {badge !== undefined && <span className="artisan-nav-badge">{badge}</span>}
            </button>
          ))}
        </nav>

        <div className="artisan-header-actions">
          <button onClick={() => go('profile')} className="artisan-profile-chip">
            <img src={artisan.photo} alt={artisan.name} className="artisan-avatar" />
            <span>{artisan.name}</span>
          </button>
          <button onClick={onLogout} title="Sign out" className="artisan-icon-button"><LogOut className="artisan-icon" /></button>
          <Link to="/" className="nav-link">Marketplace</Link>
        </div>

        <div className="artisan-mobile-menu-button">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className="artisan-icon-button">
            {menuOpen ? <X className="artisan-icon artisan-icon-menu" /> : <Menu className="artisan-icon artisan-icon-menu" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="artisan-mobile-menu">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => go(id)} className={`artisan-nav-button artisan-mobile-nav-item ${isActive(id) ? 'is-active' : ''}`}>
              <Icon className="artisan-icon" /> {label}
            </button>
          ))}
          <Link to="/" onClick={() => setMenuOpen(false)} className="artisan-mobile-link">Marketplace</Link>
          <button onClick={() => { setMenuOpen(false); onLogout(); }} className="artisan-mobile-link artisan-logout-link">
            <LogOut className="artisan-icon" /> Sign Out
          </button>
        </div>
      )}
    </header>
  );
}
