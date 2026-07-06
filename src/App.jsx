import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ShopLayout from './layouts/ShopLayout'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import UniversePage from './pages/UniversePage'
import ProductPage from './pages/ProductPage'
import RoutinesPage from './pages/RoutinesPage'
import BundlesPage from './pages/BundlesPage'
import BundlePage from './pages/BundlePage'
import QuizPage from './pages/QuizPage'
import FaqPage from './pages/FaqPage'
import DeliveryPage from './pages/DeliveryPage'
import OrderPage from './pages/OrderPage'
import LegalPage from './pages/LegalPage'
import NotFoundPage from './pages/NotFoundPage'

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminContent = lazy(() => import('./pages/admin/AdminContent'))
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia'))

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-tg-cream text-sm text-earth-soft">
      Chargement…
    </div>
  )
}

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
          <Route path="/coffret/:bundleId" element={<BundlePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/livraison" element={<DeliveryPage />} />
          <Route path="/commande" element={<OrderPage />} />
          <Route path="/cgv" element={<LegalPage />} />
          <Route path="/retours" element={<LegalPage />} />
          <Route path="/confidentialite" element={<LegalPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminDashboard />
            </Suspense>
          }
        />
        <Route
          path="/admin/products"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminProducts />
            </Suspense>
          }
        />
        <Route
          path="/admin/content"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminContent />
            </Suspense>
          }
        />
        <Route
          path="/admin/media"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminMedia />
            </Suspense>
          }
        />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
