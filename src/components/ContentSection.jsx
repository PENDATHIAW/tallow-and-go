export default function ContentSection({ title, children }) {
  return (
    <section className="border-b border-cream-dark py-8 last:border-0 dark:border-neutral-800">
      {title ? (
        <h2 className="font-display text-xl font-semibold text-earth dark:text-neutral-100">{title}</h2>
      ) : null}
      <div className={`space-y-3 text-sm leading-relaxed text-earth-soft dark:text-neutral-400 ${title ? 'mt-4' : ''}`}>
        {children}
      </div>
    </section>
  )
}

export function FaqItem({ question, answer }) {
  return (
    <details className="group rounded-xl border border-cream-dark bg-white-warm p-4 dark:border-neutral-800 dark:bg-neutral-950">
      <summary className="cursor-pointer list-none font-medium text-earth dark:text-neutral-200 [&::-webkit-details-marker]:hidden">
        <span className="flex items-start justify-between gap-3">
          {question}
          <span className="text-tg-green transition group-open:rotate-45">+</span>
        </span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-earth-soft dark:text-neutral-400">{answer}</p>
    </details>
  )
}
