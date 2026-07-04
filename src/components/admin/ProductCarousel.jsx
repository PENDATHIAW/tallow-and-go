import { products } from '../../data/catalog'

const slides = products.map((p) => ({ id: p.id, name: p.name, image: p.image }))

export default function ProductCarousel() {
  const track = [...slides, ...slides]

  return (
    <div className="relative mt-10 overflow-hidden">
      <div className="carousel-track flex gap-4">
        {track.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="flex h-36 w-28 shrink-0 flex-col items-center justify-center rounded-xl border border-white/20 bg-white/10 p-2"
          >
            <img src={item.image} alt="" className="h-24 w-full object-contain" />
            <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-wider text-tg-ivory/80">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
