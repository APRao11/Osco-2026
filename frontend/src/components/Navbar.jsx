import { useState } from 'react';
import { User, PlusCircle, Package, LogOut, Menu, X } from 'lucide-react';

export function Navbar({ currentPage, onNavigate, artisan, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: 'profile', label: 'Artisan Profile', icon: User },
    { id: 'add-product', label: 'Add Product', icon: PlusCircle },
    { id: 'manage-products', label: 'Manage Products', icon: Package },
  ];

  // go to a page and close the mobile menu if it was open
  const go = (page) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  // "Manage Products" should stay highlighted while editing a product
  const isActive = (id) => currentPage === id || (id === 'manage-products' && currentPage === 'edit-product');

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F0] border-b border-[#D8C7B2] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">
        {/* brand (text only), links back to Manage Products */}
        <button onClick={() => go('manage-products')} className="text-left group">
          <span className="font-serif font-bold text-lg sm:text-xl text-[#6B4632] tracking-tight block leading-tight group-hover:text-[#8A6248] transition-colors">
            Coastal Craft
          </span>
          <span className="text-[11px] uppercase tracking-wider text-[#756A60] font-medium block">Artisan Studio</span>
        </button>

        {/* desktop links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                isActive(id) ? 'bg-[#6B4632] text-white shadow-xs' : 'text-[#2F2924] hover:bg-[#EFE4D3] hover:text-[#6B4632]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive(id) ? 'text-[#A68A64]' : 'text-[#756A60]'}`} />
              {label}
            </button>
          ))}
        </nav>

        {/* desktop profile chip + logout */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => go('profile')}
            title="View artisan profile"
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[#F5EBDD] border border-[#D8C7B2] hover:border-[#8A6248] transition-colors group"
          >
            <img src={artisan.photo} alt={artisan.name} className="w-8 h-8 rounded-full object-cover border border-[#D8C7B2]" />
            <div className="text-left">
              <span className="block text-xs font-bold text-[#2F2924] group-hover:text-[#6B4632] leading-tight">
                {artisan.name}
              </span>
              <span className="block text-[10px] text-[#756A60] leading-tight truncate max-w-[120px]">
                {artisan.location?.split(',')[0] || 'Coastal'}
              </span>
            </div>
          </button>

          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-2 text-[#756A60] hover:text-rose-800 hover:bg-[#EFE4D3] rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* mobile: avatar + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => go('profile')} className="p-1 rounded-full border border-[#D8C7B2]">
            <img src={artisan.photo} alt={artisan.name} className="w-7 h-7 rounded-full object-cover" />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="p-2 rounded-lg text-[#2F2924] hover:bg-[#EFE4D3]"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#D8C7B2] bg-[#FFF9F0] px-4 pt-3 pb-6 space-y-2">
          <div className="flex items-center gap-3 p-3 bg-[#F5EBDD] rounded-xl border border-[#D8C7B2] mb-3">
            <img src={artisan.photo} alt={artisan.name} className="w-10 h-10 rounded-full object-cover border border-[#D8C7B2]" />
            <div>
              <p className="text-xs font-bold text-[#2F2924]">{artisan.name}</p>
              <p className="text-[11px] text-[#756A60]">{artisan.craftSpeciality}</p>
            </div>
          </div>

          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                isActive(id) ? 'bg-[#6B4632] text-white' : 'text-[#2F2924] hover:bg-[#EFE4D3]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" /> {label}
              </span>
            </button>
          ))}

          <div className="pt-3 border-t border-[#D8C7B2]/70">
            <button
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
              className="w-full px-3.5 py-2.5 rounded-lg text-xs font-semibold text-rose-800 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}