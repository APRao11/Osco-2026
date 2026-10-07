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
    <header className="sticky top-0 z-40 bg-[#FFF9F0] border-b border-[#D8C7B2] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">
        <button onClick={() => go('dashboard')} className="flex items-center gap-2.5 text-left group">
          <span className="w-10 h-10 rounded-xl bg-[#6B4632] flex items-center justify-center">
            <Anchor className="w-5 h-5 text-[#A68A64]" />
          </span>
          <span>
            <span className="font-serif font-bold text-lg sm:text-xl text-[#6B4632] block leading-tight">Tide &amp; Timber</span>
            <span className="text-[11px] uppercase tracking-wider text-[#756A60] block">Artisan Studio</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1" aria-label="Artisan navigation">
          {navItems.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 ${isActive(id) ? 'bg-[#6B4632] text-white' : 'text-[#2F2924] hover:bg-[#EFE4D3]'}`}
            >
              <Icon className="w-4 h-4" /> {label}
              {badge !== undefined && <span className="text-[10px] px-1.5 rounded-full bg-[#EFE4D3] text-[#6B4632]">{badge}</span>}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => go('profile')} className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-[#F5EBDD] border border-[#D8C7B2]">
            <img src={artisan.photo} alt={artisan.name} className="w-8 h-8 rounded-full object-cover" />
            <span className="text-xs font-bold">{artisan.name}</span>
          </button>
          <button onClick={onLogout} title="Sign out" className="p-2 text-[#756A60] hover:text-rose-800"><LogOut className="w-4 h-4" /></button>
          <Link to="/" className="nav-link">Marketplace</Link>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className="p-2 rounded-lg hover:bg-[#EFE4D3]">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[#D8C7B2] bg-[#FFF9F0] px-4 pt-3 pb-6 space-y-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => go(id)} className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${isActive(id) ? 'bg-[#6B4632] text-white' : 'hover:bg-[#EFE4D3]'}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
          <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3.5 py-2.5 text-xs font-semibold">Marketplace</Link>
          <button onClick={() => { setMenuOpen(false); onLogout(); }} className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-rose-800 flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      )}
    </header>
  );
}
