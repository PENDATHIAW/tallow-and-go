import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ShopApp from './ShopApp'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLogin from './pages/admin/AdminLogin'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShopApp />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
