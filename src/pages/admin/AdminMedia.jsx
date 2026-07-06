import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { fetchMediaIndex, clearMediaIndexCache } from '../../lib/media'
import { useLocale } from '../../context/LocaleContext'

export default function AdminMedia() {
  const { t } = useLocale()
  const [index, setIndex] = useState(null)

  const load = () => {
    clearMediaIndexCache()
    fetchMediaIndex().then(setIndex)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <AdminLayout title={t.admin.navMedia}>
      <p className="mb-6 max-w-2xl text-sm text-earth-soft">{t.admin.mediaLead}</p>

      <div className="mb-8 rounded-2xl border border-cream-dark bg-tg-green/5 p-5 dark:border-neutral-800">
        <p className="text-sm font-semibold text-earth dark:text-neutral-100">{t.admin.mediaHowTitle}</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-earth-soft">
          <li>{t.admin.mediaStep1}</li>
          <li>{t.admin.mediaStep2}</li>
          <li>{t.admin.mediaStep3}</li>
        </ol>
      </div>

      <section className="mb-10">
        <h2 className="font-display text-xl font-semibold text-earth dark:text-neutral-100">
          {t.admin.mediaInbox} ({index?.inbox?.length ?? 0})
        </h2>
        <p className="mt-1 text-sm text-earth-soft">{t.admin.mediaInboxLead}</p>
        <MediaGrid items={index?.inbox ?? []} assignLabel={t.admin.mediaAssign} />
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-earth dark:text-neutral-100">
          {t.admin.mediaPublished} ({index?.published?.length ?? 0})
        </h2>
        <MediaGrid items={index?.published ?? []} assignLabel={t.admin.mediaAssign} />
      </section>

      <button
        type="button"
        onClick={load}
        className="mt-8 rounded-full border border-cream-dark px-5 py-2.5 text-sm font-semibold text-earth-soft dark:border-neutral-700"
      >
        {t.admin.mediaRefresh}
      </button>
    </AdminLayout>
  )
}

function MediaGrid({ items, assignLabel }) {
  if (!items.length) {
    return <p className="mt-4 text-sm text-earth-soft">—</p>
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <article key={item.path} className="overflow-hidden rounded-xl border border-cream-dark bg-white-warm dark:border-neutral-800 dark:bg-neutral-900">
          <img src={item.path} alt="" className="aspect-square w-full object-contain bg-cream p-2 dark:bg-neutral-950" />
          <div className="border-t border-cream-dark p-3 dark:border-neutral-800">
            <p className="truncate text-[0.65rem] text-earth-soft">{item.name}</p>
            <Link
              to={`/admin/products?image=${encodeURIComponent(item.path)}`}
              className="mt-2 inline-block text-xs font-semibold text-tg-green hover:underline"
            >
              {assignLabel}
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}
