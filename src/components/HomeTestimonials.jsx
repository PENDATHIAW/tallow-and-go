import { Quote } from 'lucide-react'

export default function HomeTestimonials({ testimonials }) {
  if (!testimonials?.length) return null

  return (
    <section className="section-padding-compact bg-earth text-tg-ivory">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-tg-gold">Témoignages</p>
        <h2 className="mt-3 font-display text-3xl font-semibold">Elles nous font confiance</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={`${item.name}-${item.city}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <Quote className="h-8 w-8 text-tg-gold/80" />
              <p className="mt-4 text-sm leading-relaxed text-tg-ivory/90">&ldquo;{item.quote}&rdquo;</p>
              <p className="mt-5 text-sm font-semibold">{item.name}</p>
              <p className="text-xs text-tg-ivory/60">{item.city}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
