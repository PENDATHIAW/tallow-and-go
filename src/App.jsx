import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ShopLayout from './layouts/ShopLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLogin from './pages/admin/AdminLogin'
import BundlesPage from './pages/BundlesPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import ProductPage from './pages/ProductPage'
import RoutinesPage from './pages/RoutinesPage'
import UniversePage from './pages/UniversePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ShopLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/univers/:slug" element={<UniversePage />} />
          <Route path="/produit/:productId" element={<ProductPage />} />
          <Route path="/routines" element={<RoutinesPage />} />
          <Route path="/coffrets" element={<BundlesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
