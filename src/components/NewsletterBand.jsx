import { useState } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import { subscribeNewsletter, isSupabaseConfigured } from '../lib/supabase'
import { useLocale } from '../context/LocaleContext'

export default function NewsletterBand() {
  const { locale, t } = useLocale()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isSupabaseConfigured) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setStatus('')
    const res = await subscribeNewsletter(email.trim(), locale)
    setLoading(false)
    setStatus(res.message)
    if (res.ok) setEmail('')
  }

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-earth via-[#4a3520] to-tg-green px-6 py-10 text-tg-ivory sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-tg-gold">
              <Mail className="h-4 w-4" />
              {t.newsletter.kicker}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold">{t.newsletter.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-tg-ivory/80">{t.newsletter.lead}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 w-full max-w-md lg:mt-0">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.newsletter.placeholder}
                className="flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white outline-none placeholder:text-tg-ivory/50 focus:border-tg-gold"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-tg-gold px-6 py-3 text-sm font-semibold text-earth transition hover:bg-white disabled:opacity-60"
              >
                {loading ? t.newsletter.sending : t.newsletter.cta}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {status ? <p className="mt-3 text-sm text-tg-gold">{status}</p> : null}
          </form>
        </div>
      </div>
    </section>
  )
}
