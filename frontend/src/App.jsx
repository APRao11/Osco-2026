import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CraftCategoryPage from './pages/CraftCategoryPage';
import ProductRoutePlaceholder from './pages/ProductRoutePlaceholder';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/crafts/:craftSlug" element={<CraftCategoryPage />} />
        <Route path="/products/:productId" element={<ProductRoutePlaceholder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </div>
  );
}
