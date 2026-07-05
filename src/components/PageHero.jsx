export default function PageHero({ kicker, title, subtitle, image, imageAlt = '' }) {
  return (
    <section className="relative overflow-hidden bg-tg-cream dark:bg-neutral-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-16">
        <div>
          {kicker ? (
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-tg-green">{kicker}</p>
          ) : null}
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-earth dark:text-neutral-100 sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 max-w-xl text-base leading-relaxed text-earth-soft dark:text-neutral-400">{subtitle}</p>
          ) : null}
        </div>
        {image ? (
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-[#f5efe6] dark:bg-neutral-800">
            <img
              src={image}
              alt={imageAlt}
              className="max-h-full max-w-full object-contain p-4"
              onError={(e) => {
                e.currentTarget.src = '/brand/logo-full.png'
              }}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
