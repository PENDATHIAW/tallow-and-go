import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  Calculator,
  FlaskConical,
  LogOut,
  Minus,
  Package,
  Plus,
  RefreshCw,
  ShoppingBag,
  WalletCards,
} from 'lucide-react'
import {
  adjustEdenStock,
  computeEdenStats,
  createEdenBatch,
  createEdenExpense,
  daysRemaining,
  fetchEdenDashboard,
  logoutEden,
  receiveEdenBatch,
  recordEdenSale,
  saveEdenMaterial,
  saveEdenRecipeLine,
  updateEdenScent,
} from '../../lib/eden'

const TABS = [
  { id: 'bord', label: 'Bord', icon: BarChart3 },
  { id: 'vente', label: 'Vendre', icon: ShoppingBag },
  { id: 'stock', label: 'Stock', icon: Package },
  { id: 'production', label: 'Production', icon: FlaskConical },
  { id: 'couts', label: 'Coûts', icon: Calculator },
  { id: 'argent', label: 'Argent', icon: WalletCards },
]

const PAYMENTS = ['Espèces', 'Wave', 'Orange Money', 'Carte', 'À payer']
const CHANNELS = ['WhatsApp', 'Instagram', 'Boutique', 'Livraison']
const EXPENSE_CATEGORIES = ['Matières', 'Emballage', 'Transport', 'Communication', 'Divers']
const MATERIAL_CATEGORIES = ['Bases', 'Huiles', 'Liquides', 'Bois et résines', 'Poudres', 'Emballage']
const MATERIAL_UNITS = ['ml', 'cl', 'g', 'kg', 'pièce']

const initialSale = {
  odysseyId: 'moon',
  scentId: '',
  quantity: 1,
  customerName: '',
  customerPhone: '',
  channel: 'WhatsApp',
  paymentMethod: 'Espèces',
}

const initialExpense = {
  label: '',
  category: 'Matières',
  amount: '',
  spentOn: new Date().toISOString().slice(0, 10),
  notes: '',
}

const initialBatch = {
  scentId: '',
  quantity: '',
  startedOn: new Date().toISOString().slice(0, 10),
  maturationDays: 21,
  notes: '',
}

const initialMaterial = {
  name: '',
  category: 'Huiles',
  purchasePrice: '',
  purchaseQuantity: '',
  unit: 'ml',
}

const initialRecipe = { scentId: '', materialId: '', quantity: '' }

function formatMoney(value) {
  return `${Math.round(Number(value || 0)).toLocaleString('fr-FR').replaceAll(' ', ' ')} F`
}

function formatDate(value) {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
}

export default function EdenDashboard() {
  const [tab, setTab] = useState('bord')
  const [data, setData] = useState({ scents: [], sales: [], expenses: [], batches: [], materials: [], recipes: [] })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [sale, setSale] = useState(initialSale)
  const [expense, setExpense] = useState(initialExpense)
  const [batch, setBatch] = useState(initialBatch)
  const [material, setMaterial] = useState(initialMaterial)
  const [recipe, setRecipe] = useState(initialRecipe)

  const load = async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true)
    const result = await fetchEdenDashboard()
    if (result.ok) {
      setData({
        scents: result.scents,
        sales: result.sales,
        expenses: result.expenses,
        batches: result.batches,
        materials: result.materials,
        recipes: result.recipes,
      })
      setError('')
    } else {
      setError(result.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 3200)
    return () => window.clearTimeout(timer)
  }, [notice])

  const stats = useMemo(() => computeEdenStats(data), [data])
  const odysseys = useMemo(() => {
    const map = new Map()
    data.scents.forEach((scent) => {
      if (scent.odyssey) map.set(scent.odyssey.id, scent.odyssey)
    })
    return [...map.values()].sort((a, b) => Number(a.sort_order) - Number(b.sort_order))
  }, [data.scents])

  useEffect(() => {
    if (!odysseys.length) return
    if (!odysseys.some((o) => o.id === sale.odysseyId)) {
      setSale((current) => ({ ...current, odysseyId: odysseys[0].id, scentId: '' }))
    }
  }, [odysseys, sale.odysseyId])

  const selectedSaleScent = data.scents.find((scent) => String(scent.id) === String(sale.scentId))

  const run = async (action, successMessage) => {
    setBusy(true)
    setError('')
    const result = await action()
    setBusy(false)
    if (!result.ok) {
      setError(result.message)
      return false
    }
    setNotice(successMessage)
    await load({ quiet: true })
    return true
  }

  const submitSale = async (event) => {
    event.preventDefault()
    if (!sale.scentId) {
      setError('Choisissez une senteur.')
      return
    }
    const ok = await run(
      () => recordEdenSale(sale),
      `${sale.quantity} pot${Number(sale.quantity) > 1 ? 's' : ''} vendu${Number(sale.quantity) > 1 ? 's' : ''}.`,
    )
    if (ok) setSale((current) => ({ ...initialSale, odysseyId: current.odysseyId }))
  }

  const changeStock = async (scent, delta) => {
    await run(
      () => adjustEdenStock(scent.id, delta, delta > 0 ? 'Entrée manuelle' : 'Sortie manuelle'),
      `Stock de ${scent.name} mis à jour.`,
    )
  }

  const submitExpense = async (event) => {
    event.preventDefault()
    if (!expense.label.trim() || Number(expense.amount) <= 0) {
      setError('Renseignez le libellé et le montant de la dépense.')
      return
    }
    const ok = await run(() => createEdenExpense(expense), 'Dépense enregistrée.')
    if (ok) setExpense(initialExpense)
  }

  const submitBatch = async (event) => {
    event.preventDefault()
    if (!batch.scentId || Number(batch.quantity) <= 0) {
      setError('Choisissez une senteur et une quantité.')
      return
    }
    const ok = await run(() => createEdenBatch(batch), 'Lot placé en macération.')
    if (ok) setBatch(initialBatch)
  }

  const submitMaterial = async (event) => {
    event.preventDefault()
    if (!material.name.trim() || Number(material.purchasePrice) <= 0 || Number(material.purchaseQuantity) <= 0) {
      setError('Renseignez le nom, le prix payé et la quantité achetée.')
      return
    }
    const ok = await run(() => saveEdenMaterial(material), 'Matière enregistrée.')
    if (ok) setMaterial(initialMaterial)
  }

  const submitRecipe = async (event) => {
    event.preventDefault()
    if (!recipe.scentId || !recipe.materialId || Number(recipe.quantity) <= 0) {
      setError('Choisissez une senteur, une matière et une quantité.')
      return
    }
    const ok = await run(() => saveEdenRecipeLine(recipe), 'Recette mise à jour.')
    if (ok) setRecipe(initialRecipe)
  }

  const signOut = async () => {
    await logoutEden()
    window.location.assign('/eden-admin')
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] pb-24 text-[#2E2A26]">
      <header className="border-b border-[#E5DED4] bg-white/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div>
            <p className="text-xl tracking-[0.36em]">EDEN</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-[#A69C91]">Gestion des Odyssées</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => load()}
              disabled={loading || busy}
              aria-label="Actualiser"
              className="rounded-full border border-[#E5DED4] p-2.5 text-[#7A7168] transition hover:border-[#B8863F] hover:text-[#B8863F]"
            >
              <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              type="button"
              onClick={signOut}
              aria-label="Déconnexion"
              className="rounded-full border border-[#E5DED4] p-2.5 text-[#7A7168] transition hover:border-red-300 hover:text-red-600"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-5">
        {notice ? <div className="mb-4 border border-[#B7C8B3] bg-[#F1F4EF] px-4 py-3 text-sm text-[#5E7A5A]">{notice}</div> : null}
        {error ? <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">{error}</div> : null}

        {loading ? (
          <div className="flex min-h-[55vh] items-center justify-center text-sm text-[#7A7168]">Chargement des données EDEN…</div>
        ) : (
          <>
            {tab === 'bord' ? <DashboardTab data={data} stats={stats} /> : null}
            {tab === 'vente' ? (
              <SaleTab
                scents={data.scents}
                odysseys={odysseys}
                sale={sale}
                setSale={setSale}
                selectedScent={selectedSaleScent}
                submit={submitSale}
                busy={busy}
              />
            ) : null}
            {tab === 'stock' ? (
              <StockTab
                scents={data.scents}
                odysseys={odysseys}
                stats={stats}
                changeStock={changeStock}
                updatePrice={async (scentId, salePrice) => {
                  await run(() => updateEdenScent(scentId, { sale_price: Number(salePrice) }), 'Prix de vente mis à jour.')
                }}
                busy={busy}
              />
            ) : null}
            {tab === 'production' ? (
              <ProductionTab
                scents={data.scents}
                batches={data.batches}
                batch={batch}
                setBatch={setBatch}
                submit={submitBatch}
                receive={async (item) => {
                  await run(() => receiveEdenBatch(item.id), `${item.quantity} pots de ${item.scent?.name} entrés en stock.`)
                }}
                busy={busy}
              />
            ) : null}
            {tab === 'couts' ? (
              <CostsTab
                data={data}
                stats={stats}
                material={material}
                setMaterial={setMaterial}
                recipe={recipe}
                setRecipe={setRecipe}
                submitMaterial={submitMaterial}
                submitRecipe={submitRecipe}
                busy={busy}
              />
            ) : null}
            {tab === 'argent' ? (
              <MoneyTab
                data={data}
                stats={stats}
                expense={expense}
                setExpense={setExpense}
                submit={submitExpense}
                busy={busy}
              />
            ) : null}
          </>
        )}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E5DED4] bg-white/95 pb-[max(0.35rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-6">
          {TABS.map((item) => {
            const Icon = item.icon
            const active = tab === item.id
            const alert = item.id === 'stock' && stats.lowStock.length > 0
              ? stats.lowStock.length
              : item.id === 'production' && stats.readyBatches.length > 0
                ? stats.readyBatches.length
                : 0
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTab(item.id)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className={`relative flex min-h-16 flex-col items-center justify-center gap-1 border-t-2 px-1 text-[9px] uppercase tracking-[0.08em] ${
                  active ? 'border-[#B8863F] text-[#2E2A26]' : 'border-transparent text-[#A69C91]'
                }`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
                {alert ? <span className="absolute right-[24%] top-2 min-w-4 rounded-full bg-[#A5523F] px-1 text-[8px] leading-4 text-white">{alert}</span> : null}
              </button>
            )
          })}
        </div>
      </nav>
    </main>
  )
}

function DashboardTab({ data, stats }) {
  const topScents = [...data.scents].sort((a, b) => Number(b.sold) - Number(a.sold)).slice(0, 5)
  return (
    <div className="space-y-4">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Chiffre d’affaires" value={formatMoney(stats.revenue)} note="Ventes enregistrées" />
        <Metric label="Bénéfice estimé" value={formatMoney(stats.net)} note="Après coûts et dépenses" tone={stats.net >= 0 ? 'good' : 'bad'} />
        <Metric label="En stock" value={`${stats.pots} pots`} note={formatMoney(stats.stockValue)} />
        <Metric label="À encaisser" value={formatMoney(stats.due)} note="Paiements en attente" tone={stats.due ? 'bad' : 'good'} />
      </section>

      {stats.lowStock.length ? (
        <Card title="À produire en priorité" accent="#A5523F">
          {stats.lowStock.map((scent) => (
            <Row key={scent.id} title={scent.name} subtitle={scent.odyssey?.name} value={`${scent.stock} pot${Number(scent.stock) > 1 ? 's' : ''}`} danger />
          ))}
        </Card>
      ) : null}

      {stats.readyBatches.length ? (
        <Card title="Lots prêts" accent="#5E7A5A">
          {stats.readyBatches.map((batch) => (
            <Row key={batch.id} title={batch.scent?.name} subtitle={`${batch.batch_code} · ${batch.quantity} pots`} value="Prêt" good />
          ))}
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Dernières ventes">
          {data.sales.length ? data.sales.slice(0, 6).map((sale) => (
            <Row
              key={sale.id}
              title={(sale.items || []).map((item) => `${item.scent?.name} × ${item.quantity}`).join(', ') || 'Vente'}
              subtitle={`${sale.customer_name} · ${sale.payment_method} · ${formatDate(sale.created_at)}`}
              value={formatMoney(sale.total)}
              danger={sale.payment_status === 'due'}
            />
          )) : <Empty text="Aucune vente enregistrée." />}
        </Card>

        <Card title="Senteurs qui partent le mieux">
          {topScents.map((scent, index) => (
            <Row key={scent.id} title={`${index + 1}. ${scent.name}`} subtitle={scent.odyssey?.name} value={`${scent.sold} vendu${Number(scent.sold) > 1 ? 's' : ''}`} />
          ))}
        </Card>
      </div>
    </div>
  )
}

function SaleTab({ scents, odysseys, sale, setSale, selectedScent, submit, busy }) {
  const visibleScents = scents.filter((scent) => scent.odyssey_id === sale.odysseyId)
  return (
    <form onSubmit={submit} className="space-y-4">
      <Card title="1 · Choisir l’Odyssée">
        <div className="flex flex-wrap gap-2">
          {odysseys.map((odyssey) => (
            <button
              key={odyssey.id}
              type="button"
              onClick={() => setSale((current) => ({ ...current, odysseyId: odyssey.id, scentId: '' }))}
              className="border px-3 py-2 text-sm transition"
              style={{
                borderColor: sale.odysseyId === odyssey.id ? odyssey.accent : '#E5DED4',
                background: sale.odysseyId === odyssey.id ? `${odyssey.accent}18` : 'white',
              }}
            >
              {odyssey.name}
            </button>
          ))}
        </div>
      </Card>

      <Card title="2 · Choisir la senteur">
        <div className="grid gap-2 sm:grid-cols-3">
          {visibleScents.map((scent) => (
            <button
              key={scent.id}
              type="button"
              disabled={Number(scent.stock) === 0}
              onClick={() => setSale((current) => ({ ...current, scentId: String(scent.id), quantity: 1 }))}
              className={`border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                String(sale.scentId) === String(scent.id) ? 'border-[#B8863F] bg-[#FBF6EE]' : 'border-[#E5DED4] bg-white'
              }`}
            >
              <span className="block text-base">{scent.name}</span>
              <span className={`mt-1 block text-xs ${Number(scent.stock) <= Number(scent.low_stock_threshold) ? 'text-[#A5523F]' : 'text-[#A69C91]'}`}>
                {scent.stock} en stock · {formatMoney(scent.sale_price)}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {selectedScent ? (
        <>
          <Card title="3 · Quantité">
            <div className="flex items-center gap-4">
              <RoundButton onClick={() => setSale((current) => ({ ...current, quantity: Math.max(1, Number(current.quantity) - 1) }))}><Minus size={18} /></RoundButton>
              <div className="min-w-12 text-center text-3xl">{sale.quantity}</div>
              <RoundButton onClick={() => setSale((current) => ({ ...current, quantity: Math.min(Number(selectedScent.stock), Number(current.quantity) + 1) }))}><Plus size={18} /></RoundButton>
              <div className="ml-auto text-right">
                <p className="text-xl">{formatMoney(Number(selectedScent.sale_price) * Number(sale.quantity))}</p>
                <p className="text-xs text-[#A69C91]">{selectedScent.stock} disponibles</p>
              </div>
            </div>
          </Card>

          <Card title="4 · Cliente et paiement">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nom de la cliente">
                <Input value={sale.customerName} onChange={(event) => setSale((current) => ({ ...current, customerName: event.target.value }))} placeholder="Facultatif" />
              </Field>
              <Field label="Téléphone">
                <Input value={sale.customerPhone} onChange={(event) => setSale((current) => ({ ...current, customerPhone: event.target.value }))} placeholder="Facultatif" inputMode="tel" />
              </Field>
            </div>
            <div className="mt-4">
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#A69C91]">Canal</p>
              <Pills values={CHANNELS} selected={sale.channel} onSelect={(channel) => setSale((current) => ({ ...current, channel }))} />
            </div>
            <div className="mt-4">
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#A69C91]">Paiement</p>
              <Pills values={PAYMENTS} selected={sale.paymentMethod} onSelect={(paymentMethod) => setSale((current) => ({ ...current, paymentMethod }))} />
            </div>
          </Card>

          <PrimaryButton disabled={busy || Number(selectedScent.stock) < Number(sale.quantity)}>
            {busy ? 'Enregistrement…' : `Enregistrer · ${formatMoney(Number(selectedScent.sale_price) * Number(sale.quantity))}`}
          </PrimaryButton>
        </>
      ) : null}
    </form>
  )
}

function StockTab({ scents, odysseys, stats, changeStock, updatePrice, busy }) {
  return (
    <div className="space-y-4">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Metric label="Pots disponibles" value={String(stats.pots)} note="Toutes Odyssées" />
        <Metric label="Stock bas" value={String(stats.lowStock.length)} note="À produire" tone={stats.lowStock.length ? 'bad' : 'good'} />
        <Metric label="Valeur de revient" value={formatMoney(stats.stockValue)} note="Selon les recettes" />
      </section>

      {odysseys.map((odyssey) => (
        <Card key={odyssey.id} title={odyssey.name} accent={odyssey.accent}>
          {scents.filter((scent) => scent.odyssey_id === odyssey.id).map((scent) => (
            <StockRow key={scent.id} scent={scent} onChange={changeStock} onUpdatePrice={updatePrice} busy={busy} />
          ))}
        </Card>
      ))}
    </div>
  )
}

function StockRow({ scent, onChange, onUpdatePrice, busy }) {
  const [price, setPrice] = useState(String(scent.sale_price))
  useEffect(() => setPrice(String(scent.sale_price)), [scent.sale_price])
  return (
    <div className="border-b border-[#E5DED4] py-4 last:border-0">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-base">{scent.name}</p>
          <p className={`mt-1 text-xs ${Number(scent.stock) <= Number(scent.low_stock_threshold) ? 'text-[#A5523F]' : 'text-[#A69C91]'}`}>
            {scent.sold} vendus · seuil {scent.low_stock_threshold}
          </p>
        </div>
        <RoundButton small disabled={busy || Number(scent.stock) <= 0} onClick={() => onChange(scent, -1)}><Minus size={15} /></RoundButton>
        <span className={`min-w-8 text-center text-xl ${Number(scent.stock) <= Number(scent.low_stock_threshold) ? 'text-[#A5523F]' : ''}`}>{scent.stock}</span>
        <RoundButton small disabled={busy} onClick={() => onChange(scent, 1)}><Plus size={15} /></RoundButton>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <Field label="Prix de vente" className="flex-1">
          <Input type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} inputMode="numeric" />
        </Field>
        <button
          type="button"
          disabled={busy || Number(price) < 0 || Number(price) === Number(scent.sale_price)}
          onClick={() => onUpdatePrice(scent.id, price)}
          className="h-[46px] border border-[#E5DED4] bg-white px-4 text-[10px] uppercase tracking-[0.16em] text-[#7A7168] disabled:opacity-40"
        >
          Enregistrer
        </button>
      </div>
    </div>
  )
}

function ProductionTab({ scents, batches, batch, setBatch, submit, receive, busy }) {
  return (
    <div className="space-y-4">
      <form onSubmit={submit}>
        <Card title="Nouveau lot">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Senteur">
              <Select value={batch.scentId} onChange={(event) => setBatch((current) => ({ ...current, scentId: event.target.value }))} required>
                <option value="">Choisir une senteur</option>
                {scents.map((scent) => <option key={scent.id} value={scent.id}>{scent.name}</option>)}
              </Select>
            </Field>
            <Field label="Nombre de pots">
              <Input type="number" min="1" value={batch.quantity} onChange={(event) => setBatch((current) => ({ ...current, quantity: event.target.value }))} required />
            </Field>
            <Field label="Date de fabrication">
              <Input type="date" value={batch.startedOn} onChange={(event) => setBatch((current) => ({ ...current, startedOn: event.target.value }))} required />
            </Field>
            <Field label="Durée de macération">
              <Input type="number" min="1" value={batch.maturationDays} onChange={(event) => setBatch((current) => ({ ...current, maturationDays: event.target.value }))} required />
            </Field>
          </div>
          <Field label="Notes" className="mt-3">
            <textarea value={batch.notes} onChange={(event) => setBatch((current) => ({ ...current, notes: event.target.value }))} className="min-h-24 w-full border border-[#E5DED4] bg-white px-3 py-3 text-sm outline-none focus:border-[#B8863F]" />
          </Field>
          <PrimaryButton disabled={busy} className="mt-4">{busy ? 'Création…' : 'Lancer la macération'}</PrimaryButton>
        </Card>
      </form>

      <Card title="Lots en cours">
        {batches.length ? batches.map((item) => {
          const remaining = daysRemaining(item)
          const received = item.status === 'received'
          const cancelled = item.status === 'cancelled'
          const ready = remaining <= 0 && !received && !cancelled
          const progress = Math.max(0, Math.min(100, ((Number(item.maturation_days) - Math.max(remaining, 0)) / Number(item.maturation_days)) * 100))
          return (
            <div key={item.id} className="border-b border-[#E5DED4] py-4 last:border-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base">{item.scent?.name}</p>
                  <p className="mt-1 text-xs text-[#A69C91]">{item.batch_code} · {item.quantity} pots · démarré le {formatDate(item.started_on)}</p>
                </div>
                <span className={`text-xs ${ready ? 'text-[#5E7A5A]' : received ? 'text-[#7A7168]' : 'text-[#B8863F]'}`}>
                  {received ? 'Entré en stock' : cancelled ? 'Annulé' : ready ? 'Prêt' : `${remaining} j restants`}
                </span>
              </div>
              <div className="mt-3 h-1.5 bg-[#E5DED4]"><div className="h-full bg-[#B8863F]" style={{ width: `${received ? 100 : progress}%` }} /></div>
              {item.notes ? <p className="mt-3 text-sm italic text-[#7A7168]">{item.notes}</p> : null}
              {ready ? (
                <button type="button" disabled={busy} onClick={() => receive(item)} className="mt-3 bg-[#5E7A5A] px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] text-white disabled:opacity-50">
                  Entrer les {item.quantity} pots en stock
                </button>
              ) : null}
            </div>
          )
        }) : <Empty text="Aucun lot enregistré." />}
      </Card>
    </div>
  )
}

function CostsTab({ data, stats, material, setMaterial, recipe, setRecipe, submitMaterial, submitRecipe, busy }) {
  return (
    <div className="space-y-4">
      <Card title="Coût estimé par senteur">
        {data.scents.map((scent) => {
          const cost = stats.recipeCostByScent.get(scent.id) || 0
          const margin = Number(scent.sale_price) > 0 ? ((Number(scent.sale_price) - cost) / Number(scent.sale_price)) * 100 : 0
          return <Row key={scent.id} title={scent.name} subtitle={`Vendu ${formatMoney(scent.sale_price)} · marge ${Math.round(margin)} %`} value={formatMoney(cost)} danger={cost > Number(scent.sale_price) * 0.45} />
        })}
      </Card>

      <form onSubmit={submitMaterial}>
        <Card title="Ajouter une matière">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nom"><Input value={material.name} onChange={(event) => setMaterial((current) => ({ ...current, name: event.target.value }))} required /></Field>
            <Field label="Catégorie"><Select value={material.category} onChange={(event) => setMaterial((current) => ({ ...current, category: event.target.value }))}>{MATERIAL_CATEGORIES.map((value) => <option key={value}>{value}</option>)}</Select></Field>
            <Field label="Prix payé"><Input type="number" min="1" value={material.purchasePrice} onChange={(event) => setMaterial((current) => ({ ...current, purchasePrice: event.target.value }))} required /></Field>
            <Field label="Quantité achetée"><Input type="number" min="0.01" step="0.01" value={material.purchaseQuantity} onChange={(event) => setMaterial((current) => ({ ...current, purchaseQuantity: event.target.value }))} required /></Field>
            <Field label="Unité"><Select value={material.unit} onChange={(event) => setMaterial((current) => ({ ...current, unit: event.target.value }))}>{MATERIAL_UNITS.map((value) => <option key={value}>{value}</option>)}</Select></Field>
          </div>
          <PrimaryButton disabled={busy} className="mt-4">Enregistrer la matière</PrimaryButton>
        </Card>
      </form>

      <form onSubmit={submitRecipe}>
        <Card title="Ajouter à une recette">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Senteur"><Select value={recipe.scentId} onChange={(event) => setRecipe((current) => ({ ...current, scentId: event.target.value }))} required><option value="">Choisir</option>{data.scents.map((scent) => <option key={scent.id} value={scent.id}>{scent.name}</option>)}</Select></Field>
            <Field label="Matière"><Select value={recipe.materialId} onChange={(event) => setRecipe((current) => ({ ...current, materialId: event.target.value }))} required><option value="">Choisir</option>{data.materials.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.unit})</option>)}</Select></Field>
            <Field label="Quantité par pot"><Input type="number" min="0.01" step="0.01" value={recipe.quantity} onChange={(event) => setRecipe((current) => ({ ...current, quantity: event.target.value }))} required /></Field>
          </div>
          <PrimaryButton disabled={busy || !data.materials.length} className="mt-4">Ajouter à la recette</PrimaryButton>
        </Card>
      </form>

      <Card title="Matières enregistrées">
        {data.materials.length ? data.materials.map((item) => (
          <Row key={item.id} title={item.name} subtitle={`${item.category} · ${item.purchase_quantity} ${item.unit}`} value={`${formatMoney(item.purchase_price)} · ${formatMoney(Number(item.purchase_price) / Number(item.purchase_quantity))}/${item.unit}`} />
        )) : <Empty text="Ajoutez d’abord les matières réellement achetées, y compris le pot et l’étiquette." />}
      </Card>
    </div>
  )
}

function MoneyTab({ data, stats, expense, setExpense, submit, busy }) {
  return (
    <div className="space-y-4">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric label="Entrées" value={formatMoney(stats.revenue)} note="Ventes" />
        <Metric label="Encaissé" value={formatMoney(stats.collected)} note="Hors impayés" tone="good" />
        <Metric label="Dépenses" value={formatMoney(stats.expenses)} note="Achats et charges" tone="bad" />
        <Metric label="Net estimé" value={formatMoney(stats.net)} note="Après revient" tone={stats.net >= 0 ? 'good' : 'bad'} />
      </section>

      <form onSubmit={submit}>
        <Card title="Nouvelle dépense">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Libellé"><Input value={expense.label} onChange={(event) => setExpense((current) => ({ ...current, label: event.target.value }))} required /></Field>
            <Field label="Montant"><Input type="number" min="1" value={expense.amount} onChange={(event) => setExpense((current) => ({ ...current, amount: event.target.value }))} required /></Field>
            <Field label="Catégorie"><Select value={expense.category} onChange={(event) => setExpense((current) => ({ ...current, category: event.target.value }))}>{EXPENSE_CATEGORIES.map((value) => <option key={value}>{value}</option>)}</Select></Field>
            <Field label="Date"><Input type="date" value={expense.spentOn} onChange={(event) => setExpense((current) => ({ ...current, spentOn: event.target.value }))} required /></Field>
          </div>
          <Field label="Notes" className="mt-3"><Input value={expense.notes} onChange={(event) => setExpense((current) => ({ ...current, notes: event.target.value }))} /></Field>
          <PrimaryButton disabled={busy} className="mt-4">Enregistrer la dépense</PrimaryButton>
        </Card>
      </form>

      {stats.due > 0 ? (
        <Card title="Paiements à récupérer" accent="#A5523F">
          {data.sales.filter((sale) => sale.payment_status === 'due').map((sale) => (
            <Row key={sale.id} title={sale.customer_name} subtitle={`${sale.customer_phone || 'Téléphone non renseigné'} · ${formatDate(sale.created_at)}`} value={formatMoney(sale.total)} danger />
          ))}
        </Card>
      ) : null}

      <Card title="Dépenses récentes">
        {data.expenses.length ? data.expenses.map((item) => (
          <Row key={item.id} title={item.label} subtitle={`${item.category} · ${formatDate(item.spent_on)}`} value={`− ${formatMoney(item.amount)}`} danger />
        )) : <Empty text="Aucune dépense enregistrée." />}
      </Card>
    </div>
  )
}

function Card({ title, accent, children }) {
  return (
    <section className="border border-[#E5DED4] bg-white p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#A69C91]">
        {accent ? <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} /> : null}
        {title}
      </div>
      {children}
    </section>
  )
}

function Metric({ label, value, note, tone }) {
  const color = tone === 'good' ? '#5E7A5A' : tone === 'bad' ? '#A5523F' : '#2E2A26'
  return (
    <div className="border border-[#E5DED4] bg-white p-4">
      <p className="text-[9px] uppercase tracking-[0.18em] text-[#A69C91]">{label}</p>
      <p className="mt-2 text-xl sm:text-2xl" style={{ color }}>{value}</p>
      <p className="mt-1 text-[11px] text-[#A69C91]">{note}</p>
    </div>
  )
}

function Row({ title, subtitle, value, danger, good }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#E5DED4] py-3 last:border-0">
      <div className="min-w-0">
        <p className="truncate text-sm sm:text-base">{title}</p>
        <p className="mt-1 text-xs text-[#A69C91]">{subtitle}</p>
      </div>
      <p className="shrink-0 text-right text-sm" style={{ color: danger ? '#A5523F' : good ? '#5E7A5A' : '#7A7168' }}>{value}</p>
    </div>
  )
}

function Empty({ text }) {
  return <p className="py-4 text-sm text-[#A69C91]">{text}</p>
}

function Field({ label, children, className = '' }) {
  return <label className={`block ${className}`}><span className="mb-1.5 block text-[10px] uppercase tracking-[0.18em] text-[#A69C91]">{label}</span>{children}</label>
}

function Input(props) {
  return <input {...props} className={`h-[46px] w-full border border-[#E5DED4] bg-white px-3 text-sm outline-none transition focus:border-[#B8863F] ${props.className || ''}`} />
}

function Select({ children, ...props }) {
  return <select {...props} className={`h-[46px] w-full border border-[#E5DED4] bg-white px-3 text-sm outline-none transition focus:border-[#B8863F] ${props.className || ''}`}>{children}</select>
}

function PrimaryButton({ children, className = '', ...props }) {
  return <button type="submit" {...props} className={`w-full bg-[#2E2A26] px-4 py-4 text-xs uppercase tracking-[0.22em] text-[#FAF7F2] transition hover:bg-[#B8863F] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>{children}</button>
}

function RoundButton({ children, small = false, ...props }) {
  return <button type="button" {...props} className={`${small ? 'h-8 w-8' : 'h-11 w-11'} flex shrink-0 items-center justify-center rounded-full border border-[#E5DED4] bg-white text-[#2E2A26] transition hover:border-[#B8863F] disabled:opacity-35`}>{children}</button>
}

function Pills({ values, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <button key={value} type="button" onClick={() => onSelect(value)} className={`border px-3 py-2 text-sm ${selected === value ? 'border-[#B8863F] bg-[#FBF6EE]' : 'border-[#E5DED4] bg-white text-[#7A7168]'}`}>{value}</button>
      ))}
    </div>
  )
}
