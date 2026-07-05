import Breadcrumb from '../components/Breadcrumb'
import ContentSection from '../components/ContentSection'
import PageHero from '../components/PageHero'
import PageMeta from '../components/PageMeta'
import { deliveryContent } from '../data/siteContent'
import { getShippingFeeRange } from '../lib/shipping'
import { formatPrice } from '../lib/format'
import { useLocale } from '../context/LocaleContext'

export default function DeliveryPage() {
  const { locale, t } = useLocale()
  const content = deliveryContent[locale] ?? deliveryContent.fr
  const { min, max } = getShippingFeeRange()

  return (
    <>
      <PageMeta title={content.title} description={content.subtitle} path="/livraison" />
      <PageHero title={content.title} subtitle={content.subtitle} />
      <section className="section-padding">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumb items={[{ label: t.pages.home, href: '/' }, { label: content.title }]} />
          <div className="mt-6 rounded-xl bg-tg-green/10 px-4 py-3 text-sm text-tg-green">
            {t.delivery.feeRange} {formatPrice(min)} — {formatPrice(max)}
          </div>
          <div className="mt-8">
            {content.sections.map((section) => (
              <ContentSection key={section.title} title={section.title}>
                <p>{section.body}</p>
              </ContentSection>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
