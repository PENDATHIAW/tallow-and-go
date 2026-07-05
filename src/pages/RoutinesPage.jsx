import { useEffect } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import PageHero from '../components/PageHero'
import RoutinesSection from '../components/RoutinesSection'
import ShopCtaBand from '../components/ShopCtaBand'
import { routinesPageContent } from '../data/pageContent'
import { illustrations } from '../data/illustrations'
import { useLocale } from '../context/LocaleContext'

export default function RoutinesPage() {
  const { locale, t } = useLocale()
  const content = routinesPageContent[locale] ?? routinesPageContent.fr

  useEffect(() => {
    document.title = `${t.routines.title} — Tallow & Go`
  }, [t.routines.title])

  return (
    <>
      <PageHero
        kicker={t.routines.kicker}
        title={t.routines.title}
        subtitle={content.intro}
        image={illustrations.pages.routines}
        imageAlt={t.routines.title}
      />
      <section className="section-padding pt-0">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Breadcrumb items={[{ label: t.pages.home, href: '/' }, { label: t.routines.title }]} />
          <p className="mb-8 rounded-xl bg-tg-green/10 px-4 py-3 text-sm text-tg-green">{content.tip}</p>
        </div>
        <RoutinesSection />
      </section>

      <ShopCtaBand
        title={t.nav.bundles}
        lead={content.tip}
        primaryTo="/coffrets"
        primaryLabel={t.pages.seeAllBundles}
        secondaryTo="/"
        secondaryLabel={t.pages.backHome}
      />
    </>
  )
}
