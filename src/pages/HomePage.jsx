import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Hero from '../components/Hero'
import TrustBar from '../components/TrustBar'
import HomeStats from '../components/HomeStats'
import HomeStory from '../components/HomeStory'
import HomeTestimonials from '../components/HomeTestimonials'
import UniverseNavCards from '../components/UniverseNavCards'
import ProductCard from '../components/ProductCard'
import RoutinesSection from '../components/RoutinesSection'
import BundlesSection from '../components/BundlesSection'
import IllustrationImage from '../components/IllustrationImage'
import { illustrations } from '../data/illustrations'
import { useShopConfig } from '../context/ShopConfigContext'
import { useLocale } from '../context/LocaleContext'

export default function HomePage() {
  const { locale, t } = useLocale()
  const { catalog, homeContent, heroContent } = useShopConfig()
  const featured = catalog.products.filter((p) => p.featured).slice(0, 4)

  useEffect(() => {
    document.title = `Tallow & Go — ${heroContent.title ?? t.hero.title}`
  }, [heroContent.title, t.hero.title])

  return (
    <>
      <Hero />
      <HomeStats stats={homeContent.stats} />
      <TrustBar />

      <section className="section-padding">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-tg-green">{t.pages.universesKicker}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-earth dark:text-neutral-100">{t.pages.universesTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm text-earth-soft dark:text-neutral-400">{t.pages.universesLead}</p>
        </div>
        <UniverseNavCards compact />
      </section>

      <section className="section-padding bg-cream dark:bg-neutral-900">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold text-earth dark:text-neutral-100">{homeContent.whyTitle}</h2>
            <p className="mt-4 text-base leading-relaxed text-earth-soft dark:text-neutral-400">{homeContent.whyLead}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-1">
              {homeContent.whyPoints.map((point) => (
                <li key={point} className="flex gap-3 rounded-xl border border-cream-dark bg-white-warm p-4 text-sm text-earth-soft dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                  <span className="text-tg-green">✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl border border-cream-dark bg-white-warm dark:border-neutral-800 dark:bg-neutral-950">
            <IllustrationImage
              name={illustrations.pages.homeWhy}
              alt={homeContent.whyTitle}
              fit="contain"
              className="aspect-[4/3] w-full p-2"
              fallback={null}
            />
          </div>
        </div>
      </section>

      <HomeStory title={homeContent.storyTitle} lead={homeContent.storyLead} points={homeContent.storyPoints} />

      <section className="section-padding">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-earth dark:text-neutral-100">{homeContent.featuredTitle}</h2>
          <p className="mt-2 max-w-xl text-sm text-earth-soft">{homeContent.featuredLead}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} linkMode />
            ))}
          </div>
        </div>
      </section>

      <HomeTestimonials testimonials={homeContent.testimonials} />

      <section className="section-padding bg-cream dark:bg-neutral-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold text-earth dark:text-neutral-100">{homeContent.routinesTeaserTitle}</h2>
              <p className="mt-2 max-w-xl text-sm text-earth-soft">{homeContent.routinesTeaserLead}</p>
            </div>
            <Link to="/routines" className="inline-flex items-center gap-2 text-sm font-semibold text-tg-green">
              {t.pages.seeAllRoutines} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <RoutinesSection compact />
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold text-earth dark:text-neutral-100">{homeContent.bundlesTeaserTitle}</h2>
              <p className="mt-2 max-w-xl text-sm text-earth-soft">{homeContent.bundlesTeaserLead}</p>
            </div>
            <Link to="/coffrets" className="inline-flex items-center gap-2 text-sm font-semibold text-tg-green">
              {t.pages.seeAllBundles} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <BundlesSection compact />
        </div>
      </section>

      <section className="bg-tg-green px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-2xl font-semibold text-tg-ivory">{t.quiz.homeTitle}</h2>
            <p className="mt-1 text-sm text-tg-ivory/80">{t.quiz.homeLead}</p>
          </div>
          <Link
            to="/quiz"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-tg-ivory px-6 py-3 text-sm font-semibold text-tg-green"
          >
            {t.quiz.homeCta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mx-auto mt-8 max-w-2xl border-t border-tg-ivory/20 pt-6 text-center text-sm font-medium text-tg-ivory/90">
          {homeContent.deliveryBanner}
        </p>
      </section>
    </>
  )
}
