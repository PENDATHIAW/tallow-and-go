export default function HomeStats({ stats }) {
  if (!stats?.length) return null

  return (
    <section className="border-y border-cream-dark bg-white-warm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-display text-3xl font-semibold text-tg-green sm:text-4xl">{stat.value}</p>
            <p className="mt-2 text-xs font-medium uppercase tracking-wider text-earth-soft dark:text-neutral-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
