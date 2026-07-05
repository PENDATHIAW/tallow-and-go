import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'

export default function NotFoundPage() {
  const { t } = useLocale()

  return (
    <section className="section-padding text-center">
      <div className="mx-auto max-w-md px-4">
        <h1 className="font-display text-4xl font-semibold text-earth dark:text-neutral-100">404</h1>
        <p className="mt-4 text-earth-soft">{t.pages.notFound}</p>
        <Link to="/" className="mt-8 inline-block rounded-full bg-tg-green px-6 py-3 text-sm font-semibold text-tg-ivory">
          {t.pages.backHome}
        </Link>
      </div>
    </section>
  )
}
