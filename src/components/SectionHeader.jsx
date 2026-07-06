export default function SectionHeader({ kicker, title, lead, align = 'left', id }) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'max-w-2xl'

  return (
    <header id={id} className={align === 'center' ? 'text-center' : ''}>
      {kicker ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-tg-green">{kicker}</p>
      ) : null}
      <h2 className={`mt-3 font-display text-3xl font-semibold text-earth dark:text-neutral-100 ${alignClass}`}>
        {title}
      </h2>
      {lead ? (
        <p className={`mt-2 text-sm leading-relaxed text-earth-soft dark:text-neutral-400 ${alignClass}`}>{lead}</p>
      ) : null}
    </header>
  )
}
