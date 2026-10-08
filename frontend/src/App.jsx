import React, { useState } from 'react';
import { initialArtisanProfile, initialProducts } from './data/mockData.jsx';
import { Navbar } from './components/Navbar.jsx';
import { ArtisanLogin } from './pages/ArtisanLogin.jsx';
import { ArtisanProfile } from './pages/ArtisanProfile.jsx';
import { AddProduct } from './pages/AddProduct.jsx';
import { EditProduct } from './pages/EditProduct.jsx';
import { ManageProducts } from './pages/ManageProducts.jsx';

function Footer() {
  return (
    <footer className="mt-auto border-t border-[#D8C7B2] bg-[#FFF9F0] py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#756A60]">

        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-[#6B4632]">
            Tide & Timber
          </span>

          <span>
            &mdash; Coastal Crafts Marketplace &bull; Artisan Studio
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>Handcrafted Heritage</span>
          <span>&bull;</span>
          <span>Natural Fibers & Tidal Drift Materials</span>
        </div>

      </div>
    </footer>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentPage, setCurrentPage] = useState('manage-products');

  const [artisan, setArtisan] = useState(initialArtisanProfile);
  const [products, setProducts] = useState(initialProducts);

  const [editingProduct, setEditingProduct] = useState(null);

  const goToManageProducts = () => {
    setCurrentPage('manage-products');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    goToManageProducts();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
  };

  const handleSaveProduct = (savedProduct) => {
    setProducts((prev) => {
      const index = prev.findIndex(
        (p) => p.id === savedProduct.id
      );

      if (index === -1) {
        return [savedProduct, ...prev];
      }

      const updated = [...prev];
      updated[index] = savedProduct;

      return updated;
    });

    setEditingProduct(null);
    goToManageProducts();
  };

  const handleDeleteProduct = (productId) => {
    setProducts((prev) =>
      prev.filter((p) => p.id !== productId)
    );
  };

  const handleStartEditProduct = (product) => {
    setEditingProduct(product);
    setCurrentPage('edit-product');
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    goToManageProducts();
  };

  // Login page
  if (!isLoggedIn) {
    return (
      <ArtisanLogin
        onLogin={handleLogin}
        artisanName={artisan.name}
        artisanEmail={artisan.email}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EBDD] text-[#2F2924] flex flex-col font-sans">

      {/* Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          if (page !== 'edit-product') {
            setCurrentPage(page);
          }
        }}
        artisan={artisan}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Profile */}
        {currentPage === 'profile' && (
          <ArtisanProfile
            artisan={artisan}
            onSaveProfile={setArtisan}
          />
        )}

        {/* Add Product */}
        {currentPage === 'add-product' && (
          <AddProduct
            artisan={artisan}
            onSaveProduct={handleSaveProduct}
            onCancel={goToManageProducts}
          />
        )}

        {/* Edit Product */}
        {currentPage === 'edit-product' && editingProduct && (
          <EditProduct
            product={editingProduct}
            artisan={artisan}
            onSaveProduct={handleSaveProduct}
            onCancel={handleCancelEdit}
          />
        )}

        {/* Manage Products */}
        {currentPage === 'manage-products' && (
          <ManageProducts
            products={products}
            artisan={artisan}
            onAddProduct={() => setCurrentPage('add-product')}
            onEditProduct={handleStartEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}