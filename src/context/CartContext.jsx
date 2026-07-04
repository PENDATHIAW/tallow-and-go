import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { bundles, getProduct } from '../data/catalog'
import { translations } from '../i18n/translations'

const CartContext = createContext()
const STORAGE_KEY = 'tg-cart'

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('cart')
  const [lastOrder, setLastOrder] = useState(null)

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
    [items],
  )

  const total = resolved.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  const getWhatsAppUrl = (locale) => {
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '221785890153'
    const label = locale === 'fr' ? 'Commande Tallow & Go' : 'Tallow & Go order'
    const tr = translations[locale]?.cart ?? translations.fr.cart
    const fmt = (amount) => `${amount.toLocaleString('fr-FR')} F`

    // Après validation, le panier est vidé : on s'appuie sur lastOrder, pas sur le cart.
    if (lastOrder) {
      const itemLines = (lastOrder.items ?? []).map(
        (item) => `• ${item.name} × ${item.quantity} — ${fmt(item.unitPrice * item.quantity)}`,
      )
      const localityName = lastOrder.locality?.name?.[locale] ?? lastOrder.locality?.name?.fr ?? ''
      const paymentLabel = tr.paymentMethods?.[lastOrder.paymentMethod] ?? lastOrder.paymentMethod
      const text = [
        label,
        '',
        `${tr.orderNumber} : ${lastOrder.orderNumber}`,
        `${lastOrder.customer.name} · ${lastOrder.customer.phone}`,
        localityName,
        lastOrder.customer.address,
        '',
        ...itemLines,
        '',
        `${tr.subtotal} : ${fmt(lastOrder.subtotal)}`,
        `${tr.shipping} : ${fmt(lastOrder.shippingFee)}`,
        `${tr.total} : ${fmt(lastOrder.total)}`,
        `${tr.payment} : ${paymentLabel}`,
      ]
        .filter(Boolean)
        .join('\n')

      if (!phone) return `https://wa.me/?text=${encodeURIComponent(text)}`
      return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
    }

    const lines = resolved.map((item) => {
      const name = item.type === 'bundle' ? item.bundle?.name : item.product?.name
      return `• ${name} × ${item.quantity}`
    })
    const text = `${label}\n\n${lines.join('\n')}\n\n${tr.total} : ${fmt(total)}`
    if (!phone) return `https://wa.me/?text=${encodeURIComponent(text)}`
    return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
  }

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
        getWhatsAppUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
