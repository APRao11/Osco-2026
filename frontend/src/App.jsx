import React from 'react';

import { useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ArtisanNavbar from './components/ArtisanNavbar.jsx';
import { ProductDetailModal } from './components/ProductDetailModal.jsx';
import { initialArtisanProfile, initialProducts } from './data/mockData.jsx';
import HomePage from './pages/HomePage';
import CraftCategoryPage from './pages/CraftCategoryPage';
import ProductRoutePlaceholder from './pages/ProductRoutePlaceholder';
import { ArtisanLogin } from './pages/ArtisanLogin.jsx';
import { ArtisanDashboard } from './pages/ArtisanDashboard.jsx';
import { ArtisanProfile } from './pages/ArtisanProfile.jsx';
import { AddProduct } from './pages/AddProduct.jsx';
import { EditProduct } from './pages/EditProduct.jsx';
import { ManageProducts } from './pages/ManageProducts.jsx';

function EditArtisanProduct({ products, editingProduct, artisan, onSaveProduct, onCancel }) {
  const { productId } = useParams();
  const product = editingProduct?.id === productId
    ? editingProduct
    : products.find((item) => String(item.id) === productId);

  if (!product) return <p className="empty-state">Product not found.</p>;

  return (
    <EditProduct
      product={product}
      artisan={artisan}
      onSaveProduct={onSaveProduct}
      onCancel={onCancel}
    />
  );
}

function ArtisanWorkspace() {
  const navigate = useNavigate();
  const location = useLocation();
  const [artisan, setArtisan] = useState(initialArtisanProfile);
  const [products, setProducts] = useState(initialProducts);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const isLoginPage = location.pathname.endsWith('/login');
  const currentPage = location.pathname.endsWith('/profile')
    ? 'profile'
    : location.pathname.endsWith('/products/add')
      ? 'add-product'
      : location.pathname.includes('/products/edit/')
        ? 'edit-product'
        : location.pathname.endsWith('/products')
          ? 'manage-products'
          : 'dashboard';

  const navigateTo = (page) => {
    const paths = {
      dashboard: '/artisan/dashboard',
      profile: '/artisan/profile',
      'add-product': '/artisan/products/add',
      'manage-products': '/artisan/products',
    };
    if (paths[page]) navigate(paths[page]);
  };

  const saveProduct = (savedProduct) => {
    setProducts((current) => {
      const index = current.findIndex((product) => product.id === savedProduct.id);
      if (index === -1) return [savedProduct, ...current];
      const updated = [...current];
      updated[index] = savedProduct;
      return updated;
    });
    setEditingProduct(null);
    navigateTo('manage-products');
  };

  const startEditingProduct = (product) => {
    setEditingProduct(product);
    navigate(`/artisan/products/edit/${product.id}`);
  };

  const cancelEditingProduct = () => {
    setEditingProduct(null);
    navigateTo('manage-products');
  };

  return (
    <>
      {!isLoginPage && (
        <ArtisanNavbar
          currentPage={currentPage}
          onNavigate={navigateTo}
          artisan={artisan}
          onLogout={() => navigate('/artisan/login')}
          productCount={products.length}
        />
      )}

      <div className={isLoginPage ? '' : 'artisan-content-shell'}>
        <Routes>
          <Route
            path="login"
            element={<ArtisanLogin onLogin={() => navigate('/artisan/dashboard')} artisanName={artisan.name} artisanEmail={artisan.email} />}
          />
          <Route
            path="dashboard"
            element={<ArtisanDashboard artisan={artisan} products={products} onNavigate={navigateTo} onEditProduct={startEditingProduct} onViewProduct={setViewingProduct} />}
          />
          <Route path="profile" element={<ArtisanProfile artisan={artisan} onSaveProfile={setArtisan} />} />
          <Route
            path="products/add"
            element={<AddProduct artisan={artisan} onSaveProduct={saveProduct} onCancel={() => navigateTo('manage-products')} />}
          />
          <Route
            path="products/edit/:productId"
            element={<EditArtisanProduct products={products} editingProduct={editingProduct} artisan={artisan} onSaveProduct={saveProduct} onCancel={cancelEditingProduct} />}
          />
          <Route
            path="products"
            element={<ManageProducts products={products} artisan={artisan} onAddProduct={() => navigateTo('add-product')} onEditProduct={startEditingProduct} onDeleteProduct={(id) => setProducts((current) => current.filter((product) => product.id !== id))} />}
          />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>

      <ProductDetailModal
        product={viewingProduct}
        artisan={artisan}
        isOpen={Boolean(viewingProduct)}
        onClose={() => setViewingProduct(null)}
        onEdit={(product) => {
          setViewingProduct(null);
          startEditingProduct(product);
        }}
      />
    </>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="app-shell">
      {!location.pathname.startsWith('/artisan') && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/crafts/:craftSlug" element={<CraftCategoryPage />} />
        <Route path="/products/:productId" element={<ProductRoutePlaceholder />} />
        <Route path="/artisan/*" element={<ArtisanWorkspace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}
