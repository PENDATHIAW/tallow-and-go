import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Hero from '../components/Hero'
import TrustBar from '../components/TrustBar'
import HomeStory from '../components/HomeStory'
import HomeIngredients from '../components/HomeIngredients'
import HomeTallowScience from '../components/HomeTallowScience'
import HomeFounderQuote from '../components/HomeFounderQuote'
import HomeTestimonials from '../components/HomeTestimonials'
import HomeHowItWorks from '../components/HomeHowItWorks'
import NewsletterBand from '../components/NewsletterBand'
import UniverseNavCards from '../components/UniverseNavCards'
import ProductCard from '../components/ProductCard'
import RoutinesSection from '../components/RoutinesSection'
import BundlesSection from '../components/BundlesSection'
import SectionHeader from '../components/SectionHeader'
import { useShopConfig } from '../context/ShopConfigContext'
import { useLocale } from '../context/LocaleContext'
import { getHomePreloadImages, preloadImages } from '../lib/images'

export default function HomePage() {
  const { locale, t } = useLocale()
  const { catalog, homeContent, heroContent } = useShopConfig()
  const featured = catalog.products.filter((p) => p.featured).slice(0, 4)

  useEffect(() => {
    document.title = `Tallow & Go — ${heroContent.title ?? t.hero.title}`
    preloadImages(getHomePreloadImages())
  }, [heroContent.title, t.hero.title])

  return (
    <>
      <Hero />

      <TrustBar />

      {/* 1 — Produits phares : entrée directe dans le parcours d'achat */}
      <section id="produits-phares" className="section-padding-compact scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader
              kicker={t.shop.kicker}
              title={homeContent.featuredTitle}
              lead={homeContent.featuredLead}
            />
            <Link to="/boutique" className="inline-flex items-center gap-2 text-sm font-semibold text-tg-green">
              {t.shop.viewAll} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} linkMode priority={index < 2} />
            ))}
          </div>
        </div>
      </section>

      {/* 2 — Univers : navigation par intention */}
      <section className="section-padding-compact bg-cream dark:bg-neutral-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader
            kicker={t.pages.universesKicker}
            title={t.pages.universesTitle}
            lead={t.pages.universesLead}
          />
        </div>
        <UniverseNavCards compact />
      </section>

      {/* 3 — Comment commander : rassurer tôt */}
      <HomeHowItWorks />

      {/* 4 — Routines & coffrets : panier moyen */}
      <section className="section-padding-compact bg-white-warm dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                kicker={t.routines.kicker}
                title={homeContent.routinesTeaserTitle}
                lead={homeContent.routinesTeaserLead}
              />
              <div className="mt-6">
                <RoutinesSection compact />
              </div>
              <Link to="/routines" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-tg-green">
                {t.pages.seeAllRoutines} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div>
              <SectionHeader
                kicker={t.bundles.kicker}
                title={homeContent.bundlesTeaserTitle}
                lead={homeContent.bundlesTeaserLead}
              />
              <div className="mt-6">
                <BundlesSection compact />
              </div>
              <Link to="/coffrets" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-tg-green">
                {t.pages.seeAllBundles} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5 — Preuve sociale */}
      <HomeTestimonials testimonials={homeContent.testimonials} />

      {/* 6 — Éducation (un seul bloc approfondi) */}
      <HomeTallowScience />

      {/* 7 — Marque */}
      <HomeStory title={homeContent.storyTitle} lead={homeContent.storyLead} points={homeContent.storyPoints} />
      <HomeFounderQuote />

      {/* 8 — Ingrédients (second plan) */}
      <HomeIngredients />

      {/* 9 — Newsletter */}
      <NewsletterBand />

      {/* 10 — CTA final */}
      <section className="bg-tg-green px-4 py-12 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
          <div>
            <h2 className="font-display text-2xl font-semibold text-tg-ivory">{t.home.finalCtaTitle}</h2>
            <p className="mt-2 max-w-xl text-sm text-tg-ivory/80">{t.home.finalCtaLead}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/boutique"
              className="inline-flex items-center gap-2 rounded-full bg-tg-ivory px-6 py-3 text-sm font-semibold text-tg-green"
            >
              {t.shop.viewAll} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 rounded-full border border-tg-ivory/40 px-6 py-3 text-sm font-semibold text-tg-ivory"
            >
              {t.quiz.homeCta}
            </Link>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-2xl border-t border-tg-ivory/20 pt-6 text-center text-sm text-tg-ivory/90">
          {homeContent.deliveryBanner}
        </p>
      </section>
    </>
  )
}
