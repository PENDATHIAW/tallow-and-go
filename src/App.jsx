import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ShopLayout from './layouts/ShopLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLogin from './pages/admin/AdminLogin'
import AdminProducts from './pages/admin/AdminProducts'
import AdminContent from './pages/admin/AdminContent'
import BundlesPage from './pages/BundlesPage'
import DeliveryPage from './pages/DeliveryPage'
import FaqPage from './pages/FaqPage'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import LegalPage from './pages/LegalPage'
import NotFoundPage from './pages/NotFoundPage'
import OrderPage from './pages/OrderPage'
import ProductPage from './pages/ProductPage'
import QuizPage from './pages/QuizPage'
import RoutinesPage from './pages/RoutinesPage'
import UniversePage from './pages/UniversePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ShopLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/boutique" element={<ShopPage />} />
          <Route path="/univers/:slug" element={<UniversePage />} />
          <Route path="/produit/:productId" element={<ProductPage />} />
          <Route path="/routines" element={<RoutinesPage />} />
          <Route path="/coffrets" element={<BundlesPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/livraison" element={<DeliveryPage />} />
          <Route path="/commande" element={<OrderPage />} />
          <Route path="/cgv" element={<LegalPage />} />
          <Route path="/retours" element={<LegalPage />} />
          <Route path="/confidentialite" element={<LegalPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/content" element={<AdminContent />} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
