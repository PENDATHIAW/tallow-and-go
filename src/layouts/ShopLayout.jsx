import { Outlet } from 'react-router-dom'
import CartDrawer from '../components/CartDrawer'
import Footer from '../components/Footer'
import Header from '../components/Header'
import WhatsAppButton from '../components/WhatsAppButton'

export default function ShopLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  )
}
