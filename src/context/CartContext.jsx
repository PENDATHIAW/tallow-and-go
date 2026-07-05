import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useShopConfig } from './ShopConfigContext'

const CartContext = createContext()
const STORAGE_KEY = 'tg-cart'
const ORDER_KEY = 'tg-last-order'

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function loadLastOrder() {
  try {
    const raw = sessionStorage.getItem(ORDER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function CartProvider({ children }) {
  const { catalog } = useShopConfig()
  const { bundles, getProduct } = catalog
  const [items, setItems] = useState(loadCart)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('cart')
  const [lastOrder, setLastOrderState] = useState(loadLastOrder)

  const setLastOrder = (order) => {
    setLastOrderState(order)
    if (order) {
      sessionStorage.setItem(ORDER_KEY, JSON.stringify(order))
    } else {
      sessionStorage.removeItem(ORDER_KEY)
    }
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addProduct = (productId, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.type === 'product' && i.id === productId)
      if (existing) {
        return prev.map((i) =>
          i.type === 'product' && i.id === productId ? { ...i, quantity: i.quantity + quantity } : i,
        )
      }
      return [...prev, { type: 'product', id: productId, quantity }]
    })
    setOpen(true)
  }

  const addBundle = (bundleId, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.type === 'bundle' && i.id === bundleId)
      if (existing) {
        return prev.map((i) =>
          i.type === 'bundle' && i.id === bundleId ? { ...i, quantity: i.quantity + quantity } : i,
        )
      }
      return [...prev, { type: 'bundle', id: bundleId, quantity }]
    })
    setOpen(true)
  }

  const addRoutine = (productIds) => {
    setItems((prev) => {
      let next = [...prev]
      for (const productId of productIds) {
        const existing = next.find((i) => i.type === 'product' && i.id === productId)
        if (existing) {
          next = next.map((i) =>
            i.type === 'product' && i.id === productId ? { ...i, quantity: i.quantity + 1 } : i,
          )
        } else {
          next = [...next, { type: 'product', id: productId, quantity: 1 }]
        }
      }
      return next
    })
    setOpen(true)
  }

  const updateQuantity = (type, id, quantity) => {
    if (quantity < 1) {
      removeItem(type, id)
      return
    }
    setItems((prev) => prev.map((i) => (i.type === type && i.id === id ? { ...i, quantity } : i)))
  }

  const removeItem = (type, id) => {
    setItems((prev) => prev.filter((i) => !(i.type === type && i.id === id)))
  }

  const clearCart = () => setItems([])

  const closeCart = () => {
    setOpen(false)
    setStep('cart')
  }

  const openCheckout = () => setStep('form')

  const resolved = useMemo(
    () =>
      items.map((item) => {
        if (item.type === 'bundle') {
          const bundle = bundles.find((b) => b.id === item.id)
          return { ...item, bundle, unitPrice: bundle?.price ?? 0 }
        }
        const product = getProduct(item.id)
        return { ...item, product, unitPrice: product?.price ?? 0 }
      }),
    [items, bundles, getProduct],
  )

  const total = resolved.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        resolved,
        total,
        count,
        open,
        setOpen,
        step,
        setStep,
        lastOrder,
        setLastOrder,
        closeCart,
        openCheckout,
        addProduct,
        addBundle,
        addRoutine,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
