import React from 'react';

import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ArtisanNavbar from './components/ArtisanNavbar.jsx';
import { ProductDetailModal } from './components/ProductDetailModal.jsx';
import { initialArtisanProfile } from './data/mockData.jsx';
import HomePage from './pages/HomePage';
import CraftCategoryPage from './pages/CraftCategoryPage';
import ProductRoutePlaceholder from './pages/ProductRoutePlaceholder';
import OrderCheckoutPage from './pages/OrderCheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import { ArtisanLogin } from './pages/ArtisanLogin.jsx';
import { ArtisanDashboard } from './pages/ArtisanDashboard.jsx';
import { ArtisanProfile } from './pages/ArtisanProfile.jsx';
import { AddProduct } from './pages/AddProduct.jsx';
import { EditProduct } from './pages/EditProduct.jsx';
import { ManageProducts } from './pages/ManageProducts.jsx';
import {
  createProduct,
  deleteProduct,
  getArtisanProfile,
  getArtisanProducts,
  getCrafts,
  normalizeProduct,
  normalizeArtisan,
  artisanProfilePayload,
  productPayload,
  updateArtisanProfile,
  updateProduct,
} from './data/artisanApi.js';

const ARTISAN_SESSION_KEY = 'osco.artisan.session.v1';

function readArtisanSession() {
  try {
    const saved = window.sessionStorage.getItem(ARTISAN_SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function createWorkspaceArtisan(record) {
  return {
    ...initialArtisanProfile,
    ...normalizeArtisan(record),
    photo: record.photo || initialArtisanProfile.photo,
  };
}

function EditArtisanProduct({ products, crafts, loading, editingProduct, artisan, onSaveProduct, onCancel }) {
  const { productId } = useParams();
  const product = editingProduct?.id === productId
    ? editingProduct
    : products.find((item) => String(item.id) === productId);

  if (!product && loading) return <p className="empty-state" role="status">Loading product...</p>;
  if (!product) return <p className="empty-state">Product not found.</p>;

  return (
    <EditProduct
      product={product}
      crafts={crafts}
      artisan={artisan}
      onSaveProduct={onSaveProduct}
      onCancel={onCancel}
    />
  );
}

function ArtisanWorkspace() {
  const navigate = useNavigate();
  const location = useLocation();
  const [artisan, setArtisan] = useState(readArtisanSession);
  const [products, setProducts] = useState([]);
  const [crafts, setCrafts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [workspaceError, setWorkspaceError] = useState('');
  const [mutationNotice, setMutationNotice] = useState('');
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

  const reloadWorkspaceData = useCallback(async (artisanId) => {
    setProductsLoading(true);
    setWorkspaceError('');
    try {
      const [craftRows, productRows, artisanRecord] = await Promise.all([
        getCrafts(),
        getArtisanProducts(artisanId),
        getArtisanProfile(artisanId),
      ]);
      setCrafts(craftRows);
      setProducts(productRows.map(normalizeProduct));
      const savedProfile = createWorkspaceArtisan(artisanRecord);
      setArtisan(savedProfile);
      window.sessionStorage.setItem(ARTISAN_SESSION_KEY, JSON.stringify(savedProfile));
      return true;
    } catch (error) {
      setWorkspaceError(error.message || 'Could not load artisan products.');
      return false;
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (artisan?.id) {
      reloadWorkspaceData(artisan.id);
    } else {
      setProducts([]);
      setCrafts([]);
    }
  }, [artisan?.id, reloadWorkspaceData]);

  const signIn = (record) => {
    const workspaceArtisan = createWorkspaceArtisan(record);
    window.sessionStorage.setItem(ARTISAN_SESSION_KEY, JSON.stringify(workspaceArtisan));
    setArtisan(workspaceArtisan);
    setMutationNotice('');
    navigate('/artisan/dashboard');
  };

  const signOut = () => {
    window.sessionStorage.removeItem(ARTISAN_SESSION_KEY);
    setArtisan(null);
    setMutationNotice('');
    navigate('/artisan/login');
  };

  const saveProduct = async (product) => {
    const { id, ...payload } = product;
    if (id) {
      await updateProduct(id, productPayload(payload), artisan.id);
    } else {
      await createProduct(productPayload(payload));
    }
    const refreshed = await reloadWorkspaceData(artisan.id);
    setMutationNotice(
      refreshed
        ? `Product ${id ? 'updated' : 'created'} successfully.`
        : 'Product saved to SQLite, but the product list could not be refreshed. Retry the load.',
    );
    setEditingProduct(null);
    navigateTo('manage-products');
  };

  const saveProfile = async (profile) => {
    const saved = await updateArtisanProfile(artisan.id, artisanProfilePayload(profile));
    const workspaceArtisan = createWorkspaceArtisan(saved);
    setArtisan(workspaceArtisan);
    window.sessionStorage.setItem(ARTISAN_SESSION_KEY, JSON.stringify(workspaceArtisan));
    return workspaceArtisan;
  };

  const startEditingProduct = (product) => {
    setEditingProduct(product);
    navigate(`/artisan/products/edit/${product.id}`);
  };

  const cancelEditingProduct = () => {
    setEditingProduct(null);
    navigateTo('manage-products');
  };

  if (!artisan && !isLoginPage) {
    return <Navigate to="/artisan/login" replace />;
  }

  return (
    <>
      {!isLoginPage && (
        <ArtisanNavbar
          currentPage={currentPage}
          onNavigate={navigateTo}
          artisan={artisan}
          onLogout={signOut}
          productCount={products.length}
        />
      )}

      <div className={isLoginPage ? '' : 'artisan-content-shell'}>
        {!isLoginPage && productsLoading && <p className="artisan-muted" role="status">Loading your products and craft categories...</p>}
        {!isLoginPage && workspaceError && (
          <div className="artisan-login-error" role="alert">
            <p>{workspaceError}</p>
            <button type="button" className="artisan-text-link" onClick={() => reloadWorkspaceData(artisan.id)}>Retry</button>
          </div>
        )}
        <Routes>
          <Route
            path="login"
            element={<ArtisanLogin onLogin={signIn} />}
          />
          <Route
            path="dashboard"
            element={<ArtisanDashboard artisan={artisan} artisanId={artisan.id} products={products} onNavigate={navigateTo} onEditProduct={startEditingProduct} onViewProduct={setViewingProduct} />}
          />
          <Route path="profile" element={<ArtisanProfile artisan={artisan} onSaveProfile={saveProfile} />} />
          <Route
            path="products/add"
            element={<AddProduct artisan={artisan} crafts={crafts} onSaveProduct={saveProduct} onCancel={() => navigateTo('manage-products')} />}
          />
          <Route
            path="products/edit/:productId"
            element={<EditArtisanProduct products={products} crafts={crafts} loading={productsLoading} editingProduct={editingProduct} artisan={artisan} onSaveProduct={saveProduct} onCancel={cancelEditingProduct} />}
          />
          <Route
            path="products"
            element={<ManageProducts products={products} crafts={crafts} artisan={artisan} loading={productsLoading} notice={mutationNotice} onNoticeDismiss={() => setMutationNotice('')} onAddProduct={() => navigateTo('add-product')} onEditProduct={startEditingProduct} onDeleteProduct={async (id) => {
              await deleteProduct(id, artisan.id);
              const refreshed = await reloadWorkspaceData(artisan.id);
              setMutationNotice(refreshed ? 'Product deleted successfully.' : 'Product deleted from SQLite, but the list could not be refreshed. Retry the load.');
            }} />}
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
        <Route path="/products/:productId/order" element={<OrderCheckoutPage />} />
        <Route path="/products/:productId" element={<ProductRoutePlaceholder />} />
        <Route path="/orders/:orderId/confirmation" element={<OrderConfirmationPage />} />
        <Route path="/artisan/*" element={<ArtisanWorkspace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}
