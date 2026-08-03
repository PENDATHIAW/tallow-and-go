import { isSupabaseConfigured, supabase } from './supabase'

const notConfigured = {
  ok: false,
  message: 'Supabase n’est pas configuré. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.',
}

function errorMessage(error, fallback = 'Une erreur est survenue.') {
  if (!error) return fallback
  if (error.code === '42P01') {
    return 'Les tables EDEN ne sont pas encore installées dans Supabase. Exécutez la migration EDEN.'
  }
  return error.message || fallback
}

export async function getEdenSession() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session ?? null
}

export function onEdenAuthChange(callback) {
  if (!supabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session))
  return () => data.subscription.unsubscribe()
}

export async function loginEden(email, password) {
  if (!isSupabaseConfigured || !supabase) return notConfigured
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { ok: false, message: 'Email ou mot de passe incorrect.' }
  return { ok: true, session: data.session }
}

export async function logoutEden() {
  if (!supabase) return
  await supabase.auth.signOut()
}

export async function fetchEdenDashboard() {
  if (!isSupabaseConfigured || !supabase) return notConfigured

  const [scentsRes, salesRes, expensesRes, batchesRes, materialsRes, recipesRes] = await Promise.all([
    supabase
      .from('eden_scents')
      .select('*, odyssey:eden_odyssees(id,name,accent,prologue,sort_order)')
      .order('id'),
    supabase
      .from('eden_sales')
      .select('*, items:eden_sale_items(*, scent:eden_scents(id,name,odyssey_id))')
      .order('created_at', { ascending: false })
      .limit(100),
    supabase.from('eden_expenses').select('*').order('spent_on', { ascending: false }).limit(100),
    supabase
      .from('eden_batches')
      .select('*, scent:eden_scents(id,name,odyssey_id)')
      .order('created_at', { ascending: false }),
    supabase.from('eden_materials').select('*').order('category').order('name'),
    supabase.from('eden_recipes').select('*'),
  ])

  const firstError = [scentsRes, salesRes, expensesRes, batchesRes, materialsRes, recipesRes].find((r) => r.error)?.error
  if (firstError) return { ok: false, message: errorMessage(firstError) }

  return {
    ok: true,
    scents: scentsRes.data ?? [],
    sales: salesRes.data ?? [],
    expenses: expensesRes.data ?? [],
    batches: batchesRes.data ?? [],
    materials: materialsRes.data ?? [],
    recipes: recipesRes.data ?? [],
  }
}

export async function recordEdenSale({
  scentId,
  quantity,
  customerName,
  customerPhone,
  channel,
  paymentMethod,
}) {
  if (!supabase) return notConfigured
  const { data, error } = await supabase.rpc('eden_record_sale', {
    p_scent_id: Number(scentId),
    p_quantity: Number(quantity),
    p_customer_name: customerName?.trim() || 'Cliente de passage',
    p_customer_phone: customerPhone?.trim() || null,
    p_channel: channel,
    p_payment_method: paymentMethod,
  })
  if (error) return { ok: false, message: errorMessage(error, 'La vente n’a pas pu être enregistrée.') }
  return { ok: true, saleId: data }
}

export async function adjustEdenStock(scentId, delta, reason = 'Ajustement manuel') {
  if (!supabase) return notConfigured
  const { data, error } = await supabase.rpc('eden_adjust_stock', {
    p_scent_id: Number(scentId),
    p_delta: Number(delta),
    p_reason: reason,
  })
  if (error) return { ok: false, message: errorMessage(error, 'Le stock n’a pas pu être modifié.') }
  return { ok: true, stock: data }
}

export async function updateEdenScent(scentId, patch) {
  if (!supabase) return notConfigured
  const { error } = await supabase
    .from('eden_scents')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', Number(scentId))
  if (error) return { ok: false, message: errorMessage(error) }
  return { ok: true }
}

export async function createEdenExpense({ label, category, amount, spentOn, notes }) {
  if (!supabase) return notConfigured
  const { error } = await supabase.from('eden_expenses').insert({
    label: label.trim(),
    category,
    amount: Number(amount),
    spent_on: spentOn,
    notes: notes?.trim() || '',
  })
  if (error) return { ok: false, message: errorMessage(error, 'La dépense n’a pas pu être enregistrée.') }
  return { ok: true }
}

export async function createEdenBatch({ scentId, quantity, startedOn, maturationDays, notes }) {
  if (!supabase) return notConfigured
  const batchCode = `EDEN-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${Date.now().toString().slice(-5)}`
  const { error } = await supabase.from('eden_batches').insert({
    batch_code: batchCode,
    scent_id: Number(scentId),
    quantity: Number(quantity),
    started_on: startedOn,
    maturation_days: Number(maturationDays),
    notes: notes?.trim() || '',
  })
  if (error) return { ok: false, message: errorMessage(error, 'Le lot n’a pas pu être créé.') }
  return { ok: true, batchCode }
}

export async function receiveEdenBatch(batchId) {
  if (!supabase) return notConfigured
  const { data, error } = await supabase.rpc('eden_receive_batch', { p_batch_id: batchId })
  if (error) return { ok: false, message: errorMessage(error, 'Le lot n’a pas pu entrer en stock.') }
  return { ok: true, stock: data }
}

export async function saveEdenMaterial(material) {
  if (!supabase) return notConfigured
  const payload = {
    name: material.name.trim(),
    category: material.category,
    purchase_price: Number(material.purchasePrice),
    purchase_quantity: Number(material.purchaseQuantity),
    unit: material.unit,
    updated_at: new Date().toISOString(),
  }
  const query = material.id
    ? supabase.from('eden_materials').update(payload).eq('id', material.id)
    : supabase.from('eden_materials').insert(payload)
  const { error } = await query
  if (error) return { ok: false, message: errorMessage(error, 'La matière n’a pas pu être enregistrée.') }
  return { ok: true }
}

export async function saveEdenRecipeLine({ scentId, materialId, quantity }) {
  if (!supabase) return notConfigured
  const { error } = await supabase.from('eden_recipes').upsert(
    {
      scent_id: Number(scentId),
      material_id: materialId,
      quantity: Number(quantity),
    },
    { onConflict: 'scent_id,material_id' },
  )
  if (error) return { ok: false, message: errorMessage(error, 'La recette n’a pas pu être enregistrée.') }
  return { ok: true }
}

export function computeEdenStats({ scents = [], sales = [], expenses = [], batches = [], materials = [], recipes = [] }) {
  const materialById = new Map(materials.map((m) => [m.id, m]))
  const recipeCostByScent = new Map()

  recipes.forEach((line) => {
    const material = materialById.get(line.material_id)
    if (!material) return
    const unitCost = Number(material.purchase_price) / Number(material.purchase_quantity || 1)
    recipeCostByScent.set(
      line.scent_id,
      (recipeCostByScent.get(line.scent_id) || 0) + Number(line.quantity) * unitCost,
    )
  })

  const revenue = sales.reduce((sum, sale) => sum + Number(sale.total || 0), 0)
  const due = sales
    .filter((sale) => sale.payment_status === 'due')
    .reduce((sum, sale) => sum + Number(sale.total || 0), 0)
  const expenseTotal = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
  const costOfSales = sales.reduce((sum, sale) => {
    return sum + (sale.items || []).reduce((itemSum, item) => itemSum + Number(item.unit_cost || 0) * Number(item.quantity || 0), 0)
  }, 0)
  const lowStock = scents.filter((scent) => Number(scent.stock) <= Number(scent.low_stock_threshold))
  const readyBatches = batches.filter((batch) => batch.status !== 'received' && batch.status !== 'cancelled' && daysRemaining(batch) <= 0)
  const stockValue = scents.reduce(
    (sum, scent) => sum + Number(scent.stock || 0) * (recipeCostByScent.get(scent.id) || 0),
    0,
  )

  return {
    revenue,
    due,
    collected: revenue - due,
    expenses: expenseTotal,
    costOfSales,
    net: revenue - expenseTotal - costOfSales,
    pots: scents.reduce((sum, scent) => sum + Number(scent.stock || 0), 0),
    lowStock,
    readyBatches,
    stockValue,
    recipeCostByScent,
  }
}

export function daysRemaining(batch) {
  const start = new Date(`${batch.started_on}T00:00:00`)
  const ready = new Date(start)
  ready.setDate(ready.getDate() + Number(batch.maturation_days || 21))
  return Math.ceil((ready.getTime() - Date.now()) / 86400000)
}
