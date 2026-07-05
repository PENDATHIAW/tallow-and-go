import { Navigate, useLocation } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import ContentSection from '../components/ContentSection'
import PageHero from '../components/PageHero'
import PageMeta from '../components/PageMeta'
import { legalContent } from '../data/siteContent'
import { useLocale } from '../context/LocaleContext'

const PATH_TO_KEY = {
  cgv: 'cgv',
  retours: 'retours',
  confidentialite: 'confidentialite',
}

export default function LegalPage() {
  const { pathname } = useLocation()
  const { locale, t } = useLocale()
  const slug = pathname.replace(/^\//, '').split('/').pop()
  const key = PATH_TO_KEY[slug]

  if (!key || !legalContent[key]) {
    return <Navigate to="/" replace />
  }

  const content = legalContent[key][locale] ?? legalContent[key].fr

  return (
    <>
      <PageMeta title={content.title} path={pathname} />
      <PageHero title={content.title} />
      <section className="section-padding">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumb items={[{ label: t.pages.home, href: '/' }, { label: content.title }]} />
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
