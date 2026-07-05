import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { homeContent } from '../../data/pageContent'
import { translations } from '../../i18n/translations'
import { defaultHomeExtras } from '../../lib/cms'
import { getAdminCredentials } from '../../lib/admin'
import { fetchAdminShopConfig, saveContentBlock } from '../../lib/cms'
import { useShopConfig } from '../../context/ShopConfigContext'
import { useLocale } from '../../context/LocaleContext'

export default function AdminContent() {
  const { t } = useLocale()
  const { refresh } = useShopConfig()
  const credentials = getAdminCredentials()
  const [editLocale, setEditLocale] = useState('fr')
  const [homeForm, setHomeForm] = useState(null)
  const [heroForm, setHeroForm] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const baseHome = homeContent[editLocale] ?? homeContent.fr
    const extras = defaultHomeExtras[editLocale] ?? defaultHomeExtras.fr

    fetchAdminShopConfig(credentials).then((res) => {
      const homeBlock = res.config?.content?.[`home:${editLocale}`] ?? {}
      const extrasBlock = res.config?.content?.[`home_extras:${editLocale}`] ?? {}
      const heroBlock = res.config?.content?.[`hero:${editLocale}`] ?? {}

      const baseHero = translations[editLocale]?.hero ?? translations.fr.hero

      setHomeForm({
        whyTitle: homeBlock.whyTitle ?? baseHome.whyTitle,
        whyLead: homeBlock.whyLead ?? baseHome.whyLead,
        featuredTitle: homeBlock.featuredTitle ?? baseHome.featuredTitle,
        featuredLead: homeBlock.featuredLead ?? baseHome.featuredLead,
        deliveryBanner: homeBlock.deliveryBanner ?? baseHome.deliveryBanner,
        storyTitle: extrasBlock.storyTitle ?? extras.storyTitle,
        storyLead: extrasBlock.storyLead ?? extras.storyLead,
        testimonials: JSON.stringify(extrasBlock.testimonials ?? extras.testimonials, null, 2),
      })

      setHeroForm({
        kicker: heroBlock.kicker ?? baseHero.kicker,
        title: heroBlock.title ?? baseHero.title,
        subtitle: heroBlock.subtitle ?? baseHero.subtitle,
        cta: heroBlock.cta ?? baseHero.cta,
      })
    })
  }, [editLocale, credentials])

  const handleSave = async (e) => {
    e.preventDefault()
    if (!credentials || !homeForm || !heroForm) return
    setSaving(true)
    setMessage('')
    setError('')

    let testimonials
    try {
      testimonials = JSON.parse(homeForm.testimonials)
    } catch {
      setSaving(false)
      setError(t.admin.jsonError)
      return
    }

    const homeRes = await saveContentBlock(credentials, 'home', editLocale, {
      whyTitle: homeForm.whyTitle,
      whyLead: homeForm.whyLead,
      featuredTitle: homeForm.featuredTitle,
      featuredLead: homeForm.featuredLead,
      deliveryBanner: homeForm.deliveryBanner,
    })

    if (!homeRes.ok) {
      setSaving(false)
      setError(homeRes.message ?? t.admin.saveError)
      return
    }

    const extrasRes = await saveContentBlock(credentials, 'home_extras', editLocale, {
      storyTitle: homeForm.storyTitle,
      storyLead: homeForm.storyLead,
      testimonials,
    })

    if (!extrasRes.ok) {
      setSaving(false)
      setError(extrasRes.message ?? t.admin.saveError)
      return
    }

    const heroRes = await saveContentBlock(credentials, 'hero', editLocale, heroForm)
    setSaving(false)

    if (heroRes.ok) {
      setMessage(t.admin.saveSuccess)
      await refresh()
    } else {
      setError(heroRes.message ?? t.admin.saveError)
    }
  }

  if (!homeForm || !heroForm) return null

  return (
    <AdminLayout title={t.admin.navContent}>
      <div className="mb-6 flex gap-2">
        {['fr', 'en'].map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setEditLocale(loc)}
            className={`rounded-full px-4 py-2 text-sm font-semibold uppercase ${
              editLocale === loc ? 'bg-tg-green text-tg-ivory' : 'border border-cream-dark dark:border-neutral-700'
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="mx-auto max-w-3xl space-y-8">
        <section className="rounded-2xl border border-cream-dark bg-white-warm p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-display text-lg font-semibold text-earth dark:text-neutral-100">{t.admin.heroSection}</h2>
          <div className="mt-4 grid gap-4">
            <TextField label={t.admin.fieldKicker} value={heroForm.kicker} onChange={(v) => setHeroForm({ ...heroForm, kicker: v })} />
            <TextField label={t.admin.fieldTitle} value={heroForm.title} onChange={(v) => setHeroForm({ ...heroForm, title: v })} />
            <TextArea label={t.admin.fieldSubtitle} value={heroForm.subtitle} onChange={(v) => setHeroForm({ ...heroForm, subtitle: v })} />
            <TextField label={t.admin.fieldCta} value={heroForm.cta} onChange={(v) => setHeroForm({ ...heroForm, cta: v })} />
          </div>
        </section>

        <section className="rounded-2xl border border-cream-dark bg-white-warm p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-display text-lg font-semibold text-earth dark:text-neutral-100">{t.admin.homeSection}</h2>
          <div className="mt-4 grid gap-4">
            <TextField label={t.admin.fieldWhyTitle} value={homeForm.whyTitle} onChange={(v) => setHomeForm({ ...homeForm, whyTitle: v })} />
            <TextArea label={t.admin.fieldWhyLead} value={homeForm.whyLead} onChange={(v) => setHomeForm({ ...homeForm, whyLead: v })} />
            <TextField label={t.admin.fieldFeaturedTitle} value={homeForm.featuredTitle} onChange={(v) => setHomeForm({ ...homeForm, featuredTitle: v })} />
            <TextArea label={t.admin.fieldFeaturedLead} value={homeForm.featuredLead} onChange={(v) => setHomeForm({ ...homeForm, featuredLead: v })} />
            <TextField label={t.admin.fieldBanner} value={homeForm.deliveryBanner} onChange={(v) => setHomeForm({ ...homeForm, deliveryBanner: v })} />
            <TextField label={t.admin.fieldStoryTitle} value={homeForm.storyTitle} onChange={(v) => setHomeForm({ ...homeForm, storyTitle: v })} />
            <TextArea label={t.admin.fieldStoryLead} value={homeForm.storyLead} onChange={(v) => setHomeForm({ ...homeForm, storyLead: v })} />
            <label>
              <span className="text-xs font-semibold uppercase tracking-wider text-earth-soft">{t.admin.fieldTestimonials}</span>
              <textarea
                value={homeForm.testimonials}
                onChange={(e) => setHomeForm({ ...homeForm, testimonials: e.target.value })}
                rows={10}
                className="mt-1 w-full rounded-xl border border-cream-dark bg-white px-4 py-2.5 font-mono text-xs outline-none focus:border-tg-green dark:border-neutral-700 dark:bg-neutral-950"
              />
            </label>
          </div>
        </section>

        {message ? <p className="text-sm text-tg-green">{message}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-tg-green px-6 py-3 text-sm font-semibold text-tg-ivory disabled:opacity-60"
        >
          {saving ? t.admin.saving : t.admin.saveChanges}
        </button>
      </form>
    </AdminLayout>
  )
}

function TextField({ label, value, onChange }) {
  return (
    <label>
      <span className="text-xs font-semibold uppercase tracking-wider text-earth-soft">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-cream-dark bg-white px-4 py-2.5 text-sm outline-none focus:border-tg-green dark:border-neutral-700 dark:bg-neutral-950" />
    </label>
  )
}

function TextArea({ label, value, onChange }) {
  return (
    <label>
      <span className="text-xs font-semibold uppercase tracking-wider text-earth-soft">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-cream-dark bg-white px-4 py-2.5 text-sm outline-none focus:border-tg-green dark:border-neutral-700 dark:bg-neutral-950" />
    </label>
  )
}
