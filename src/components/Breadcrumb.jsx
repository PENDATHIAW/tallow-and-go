import { Link } from 'react-router-dom'

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-earth-soft dark:text-neutral-400">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden>/</span> : null}
            {item.href ? (
              <Link to={item.href} className="transition hover:text-tg-green">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-earth dark:text-neutral-200">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
