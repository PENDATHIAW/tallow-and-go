import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'
import PageHero from '../components/PageHero'
import PageMeta from '../components/PageMeta'
import ProductCard from '../components/ProductCard'
import { getQuizRecommendation, quizContent } from '../data/siteContent'
import { formatPrice } from '../lib/format'
import { useCart } from '../context/CartContext'
import { useLocale } from '../context/LocaleContext'
import { useShopConfig } from '../context/ShopConfigContext'

export default function QuizPage() {
  const { locale, t } = useLocale()
  const { catalog } = useShopConfig()
  const { bundles, getProduct } = catalog
  const { addRoutine, addBundle } = useCart()
  const content = quizContent[locale] ?? quizContent.fr
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)

  const current = content.questions[step]
  const result = done ? getQuizRecommendation(answers, locale) : null
  const products = result?.productIds?.map((id) => getProduct(id)).filter(Boolean) ?? []
  const bundle = result?.bundleId ? bundles.find((b) => b.id === result.bundleId) : null

  const pick = (questionId, optionId) => {
    const next = { ...answers, [questionId]: optionId }
    setAnswers(next)
    if (step + 1 >= content.questions.length) {
      setDone(true)
    } else {
      setStep(step + 1)
    }
  }

  const restart = () => {
    setStep(0)
    setAnswers({})
    setDone(false)
  }

  const handleAdd = () => {
    if (result?.bundleId) {
      addBundle(result.bundleId)
    } else if (result?.productIds?.length) {
      addRoutine(result.productIds)
    }
  }

  return (
    <>
      <PageMeta title={content.title} description={content.subtitle} path="/quiz" />
      <PageHero kicker={t.quiz.kicker} title={content.title} subtitle={content.subtitle} />

      <section className="section-padding">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumb items={[{ label: t.pages.home, href: '/' }, { label: content.title }]} />

          {!done ? (
            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-wider text-tg-green">
                {step + 1} / {content.questions.length}
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-earth dark:text-neutral-100">
                {current.label}
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {current.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => pick(current.id, opt.id)}
                    className="rounded-2xl border border-cream-dark bg-white-warm px-5 py-4 text-left text-sm font-medium text-earth transition hover:border-tg-green hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-earth dark:text-neutral-100">{content.resultTitle}</h2>
              <p className="mt-2 text-lg font-medium text-tg-green">{result.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-earth-soft">{result.description}</p>

              {bundle ? (
                <div className="mt-8 rounded-2xl border border-cream-dark bg-cream/40 p-6 dark:border-neutral-800">
                  <p className="font-display text-xl font-semibold">{bundle.name}</p>
                  <p className="mt-1 text-sm text-earth-soft">{bundle.description[locale]}</p>
                  <p className="mt-3 font-semibold">{formatPrice(bundle.price)}</p>
                </div>
              ) : null}

              {products.length > 0 ? (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} linkMode />
                  ))}
                </div>
              ) : null}

              <div className="mt-10 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="inline-flex items-center gap-2 rounded-full bg-tg-green px-6 py-3 text-sm font-semibold text-tg-ivory"
                >
                  {content.addRoutine}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link to="/routines" className="rounded-full border border-cream-dark px-6 py-3 text-sm font-semibold text-earth-soft dark:border-neutral-700">
                  {content.viewProducts}
                </Link>
                <button type="button" onClick={restart} className="text-sm underline text-earth-soft">
                  {content.restart}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
