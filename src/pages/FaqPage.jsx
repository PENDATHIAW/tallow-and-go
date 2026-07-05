import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import ContentSection, { FaqItem } from '../components/ContentSection'
import PageHero from '../components/PageHero'
import PageMeta from '../components/PageMeta'
import { faqContent } from '../data/siteContent'
import { openSupportWhatsApp } from '../lib/whatsapp'
import { useLocale } from '../context/LocaleContext'

export default function FaqPage() {
  const { locale, t } = useLocale()
  const content = faqContent[locale] ?? faqContent.fr

  return (
    <>
      <PageMeta title={content.title} description={content.subtitle} path="/faq" />
      <PageHero title={content.title} subtitle={content.subtitle} />
      <section className="section-padding">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumb items={[{ label: t.pages.home, href: '/' }, { label: content.title }]} />
          <div className="mt-8 space-y-3">
            {content.items.map((item) => (
              <FaqItem key={item.q} question={item.q} answer={item.a} />
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-earth-soft">
            {t.faq.stillQuestion}{' '}
            <button
              type="button"
              onClick={() => openSupportWhatsApp(locale)}
              className="font-semibold text-tg-green underline-offset-2 hover:underline"
            >
              {t.whatsapp.label}
            </button>
          </p>
        </div>
      </section>
    </>
  )
}
