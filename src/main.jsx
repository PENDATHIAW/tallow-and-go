import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CartProvider } from './context/CartContext'
import { LocaleProvider } from './context/LocaleContext'
import { ThemeProvider } from './context/ThemeContext'
import { ShopConfigProvider } from './context/ShopConfigContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <LocaleProvider>
        <ShopConfigProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ShopConfigProvider>
      </LocaleProvider>
    </ThemeProvider>
  </StrictMode>,
)
