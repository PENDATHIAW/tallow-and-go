import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import ImagePicker from '../../components/admin/ImagePicker'
import { products, bundles } from '../../data/catalog'
import { enrichProduct } from '../../data/productExtras'
import { getBundleImage } from '../../data/illustrationManifest'
import { getAdminCredentials } from '../../lib/admin'
import {
  fetchAdminShopConfig,
  saveBundleOverride,
  saveProductOverride,
} from '../../lib/cms'
import { useShopConfig } from '../../context/ShopConfigContext'
import { useLocale } from '../../context/LocaleContext'

function baseProduct(id) {
  const p = products.find((x) => x.id === id)
  return p ? enrichProduct(p) : null
}

function baseBundle(id) {
  const b = bundles.find((x) => x.id === id)
  if (!b) return null
  const image = getBundleImage(id)
  return image ? { ...b, image } : b
}

export default function AdminProducts() {
  const { t } = useLocale()
  const [searchParams] = useSearchParams()
  const prefillImage = searchParams.get('image')
  const { refresh } = useShopConfig()
  const credentials = getAdminCredentials()
  const [overrides, setOverrides] = useState({ products: {}, bundles: {} })
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? '')
  const [tab, setTab] = useState('product')
  const [form, setForm] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!credentials) return
    fetchAdminShopConfig(credentials).then((res) => {
      if (res.ok) setOverrides({ products: res.config.products, bundles: res.config.bundles })
    })
  }, [credentials])

  const catalogList = useMemo(() => {
    if (tab === 'product') {
      return products.map((p) => ({ id: p.id, label: p.name, base: baseProduct(p.id) }))
    }
    return bundles.map((b) => ({ id: b.id, label: b.name, base: baseBundle(b.id) }))
  }, [tab])

  useEffect(() => {
    const item = catalogList.find((x) => x.id === selectedId) ?? catalogList[0]
    if (!item) return
    setSelectedId(item.id)
    const ov = tab === 'product' ? overrides.products[item.id] : overrides.bundles[item.id]
    const base = item.base
    setForm({
      price: ov?.price ?? base?.price ?? '',
      image_url: prefillImage ?? ov?.image_url ?? base?.image ?? '',
      name: ov?.name ?? base?.name ?? '',
      tagline_fr: ov?.tagline_fr ?? base?.tagline?.fr ?? '',
      tagline_en: ov?.tagline_en ?? base?.tagline?.en ?? '',
      description_fr: ov?.description_fr ?? base?.description?.fr ?? '',
      description_en: ov?.description_en ?? base?.description?.en ?? '',
      featured: ov?.featured ?? base?.featured ?? false,
      active: ov?.active ?? true,
    })
  }, [selectedId, tab, overrides, catalogList, prefillImage])

  const handleSave = async (e) => {
    e.preventDefault()
    if (!credentials || !form) return
    setSaving(true)
    setMessage('')
    setError('')

    const payload = {
      price: form.price === '' ? null : Number(form.price),
      image_url: form.image_url,
      name: form.name,
      tagline_fr: form.tagline_fr,
      tagline_en: form.tagline_en,
      description_fr: form.description_fr,
      description_en: form.description_en,
      featured: tab === 'product' ? form.featured : null,
      active: form.active,
    }

    const res =
      tab === 'product'
        ? await saveProductOverride(credentials, selectedId, payload)
        : await saveBundleOverride(credentials, selectedId, payload)

    setSaving(false)
    if (res.ok) {
      setMessage(t.admin.saveSuccess)
      const cfg = await fetchAdminShopConfig(credentials)
      if (cfg.ok) setOverrides({ products: cfg.config.products, bundles: cfg.config.bundles })
      await refresh()
    } else {
      setError(res.message ?? t.admin.saveError)
    }
  }

  if (!form) return null

  return (
    <AdminLayout title={t.admin.navProducts}>
      <div className="mb-6 flex flex-wrap gap-2">
        <TabButton active={tab === 'product'} onClick={() => setTab('product')} label={t.admin.productsTab} />
        <TabButton active={tab === 'bundle'} onClick={() => setTab('bundle')} label={t.admin.bundlesTab} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <ul className="space-y-1">
          {catalogList.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm transition ${
                  selectedId === item.id
                    ? 'bg-tg-green text-tg-ivory'
                    : 'bg-white-warm text-earth-soft hover:bg-cream dark:bg-neutral-900 dark:hover:bg-neutral-800'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSave} className="rounded-2xl border border-cream-dark bg-white-warm p-6 dark:border-neutral-800 dark:bg-neutral-900">
          {form.image_url ? (
            <div className="mb-6 flex justify-center rounded-xl bg-cream p-4 dark:bg-neutral-950">
              <img src={form.image_url} alt="" className="max-h-48 object-contain" />
            </div>
          ) : null}

          <div className="mb-6">
            <ImagePicker
              label={t.admin.fieldImage}
              value={form.image_url}
              onChange={(image_url) => setForm({ ...form, image_url })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.admin.fieldPrice}>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label={t.admin.fieldName} className="sm:col-span-2">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            </Field>
            <Field label={`${t.admin.fieldTagline} (FR)`}>
              <input value={form.tagline_fr} onChange={(e) => setForm({ ...form, tagline_fr: e.target.value })} className={inputClass} />
            </Field>
            <Field label={`${t.admin.fieldTagline} (EN)`}>
              <input value={form.tagline_en} onChange={(e) => setForm({ ...form, tagline_en: e.target.value })} className={inputClass} />
            </Field>
            <Field label={`${t.admin.fieldDescription} (FR)`} className="sm:col-span-2">
              <textarea value={form.description_fr} onChange={(e) => setForm({ ...form, description_fr: e.target.value })} rows={3} className={inputClass} />
            </Field>
            <Field label={`${t.admin.fieldDescription} (EN)`} className="sm:col-span-2">
              <textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} rows={3} className={inputClass} />
            </Field>
          </div>

          <div className="mt-4 flex flex-wrap gap-6">
            {tab === 'product' ? (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                {t.admin.fieldFeatured}
              </label>
            ) : null}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              {t.admin.fieldActive}
            </label>
          </div>

          <p className="mt-4 text-xs text-earth-soft">{t.admin.imageHint}</p>

          {message ? <p className="mt-4 text-sm text-tg-green">{message}</p> : null}
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-full bg-tg-green px-6 py-3 text-sm font-semibold text-tg-ivory disabled:opacity-60"
          >
            {saving ? t.admin.saving : t.admin.saveChanges}
          </button>
        </form>
      </div>
    </AdminLayout>
  )
}

const inputClass =
  'mt-1 w-full rounded-xl border border-cream-dark bg-white px-4 py-2.5 text-sm outline-none focus:border-tg-green dark:border-neutral-700 dark:bg-neutral-950'

function Field({ label, children, className = '' }) {
  return (
    <label className={className}>
      <span className="text-xs font-semibold uppercase tracking-wider text-earth-soft">{label}</span>
      {children}
    </label>
  )
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold ${
        active ? 'bg-tg-green text-tg-ivory' : 'border border-cream-dark text-earth-soft dark:border-neutral-700'
      }`}
    >
      {label}
    </button>
  )
}
