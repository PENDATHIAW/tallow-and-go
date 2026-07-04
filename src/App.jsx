import BundlesSection from './components/BundlesSection'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import RoutinesSection from './components/RoutinesSection'
import UniverseNav from './components/UniverseNav'
import UniverseSection from './components/UniverseSection'

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <UniverseNav />
        <UniverseSection universeId="skin" />
        <UniverseSection universeId="body" />
        <UniverseSection universeId="essentials" />
        <UniverseSection universeId="nomades" />
        <UniverseSection universeId="home" />
        <RoutinesSection />
        <BundlesSection />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
