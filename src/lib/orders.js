import { supabase, isSupabaseConfigured } from './supabase'

function generateOrderNumber() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `TG-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}

export async function submitOrder({ customer, locality, items, subtotal, shippingFee, total, paymentMethod, notes, locale }) {
  if (!isSupabaseConfigured) {
    return { ok: false, message: locale === 'fr' ? 'Base de données non configurée.' : 'Database not configured.' }
  }

  const orderNumber = generateOrderNumber()
  const orderId = crypto.randomUUID()
  const localityLabel = locality.name[locale] ?? locality.name.fr

  // Insert sans .select() : avec RLS, RETURNING exige une policy SELECT absente ici.
  const { error: orderError } = await supabase.from('orders').insert({
    id: orderId,
    order_number: orderNumber,
    customer_name: customer.name,
    customer_phone: customer.phone,
    customer_email: customer.email || null,
    locality_id: locality.id,
    locality_label: localityLabel,
    address_details: customer.address || null,
    payment_method: paymentMethod,
    subtotal,
    shipping_fee: shippingFee,
    total,
    notes: notes || null,
    status: 'pending',
  })

  if (orderError) {
    return { ok: false, message: orderError.message }
  }

  const lines = items.map((item) => ({
    order_id: orderId,
    item_type: item.type,
    item_id: item.id,
    item_name: item.name,
    unit_price: item.unitPrice,
    quantity: item.quantity,
    line_total: item.unitPrice * item.quantity,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(lines)
  if (itemsError) {
    return { ok: false, message: itemsError.message }
  }

  return { ok: true, orderNumber, orderId }
}

export async function fetchAdminOrders(credentials) {
  if (!isSupabaseConfigured) return { ok: false, orders: [], items: [] }

  const { data: orders, error: ordersError } = await supabase.rpc('admin_get_orders', {
    p_user: credentials.user,
    p_password: credentials.password,
  })

  if (ordersError) {
    return { ok: false, orders: [], items: [], message: ordersError.message }
  }

  const { data: items, error: itemsError } = await supabase.rpc('admin_get_order_items', {
    p_user: credentials.user,
    p_password: credentials.password,
  })

  if (itemsError) {
    return { ok: false, orders: orders ?? [], items: [], message: itemsError.message }
  }

  return { ok: true, orders: orders ?? [], items: items ?? [] }
}

export async function updateOrderStatus(credentials, orderId, status) {
  if (!isSupabaseConfigured) return { ok: false }

  const { error } = await supabase.rpc('admin_update_order_status', {
    p_user: credentials.user,
    p_password: credentials.password,
    p_order_id: orderId,
    p_status: status,
  })

  return { ok: !error, message: error?.message }
}

export function computeStats(orders, items) {
  const totalRevenue = orders.reduce((s, o) => s + (o.status !== 'cancelled' ? o.total : 0), 0)
  const orderCount = orders.filter((o) => o.status !== 'cancelled').length

  const productSales = {}
  for (const line of items) {
    const order = orders.find((o) => o.id === line.order_id)
    if (!order || order.status === 'cancelled') continue
    const key = line.item_name
    productSales[key] = (productSales[key] ?? 0) + line.quantity
  }

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, qty]) => ({ name, qty }))

  return { totalRevenue, orderCount, topProducts }
}
