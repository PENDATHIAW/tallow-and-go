import { useEffect, useState } from 'react'
import { fetchMediaIndex } from '../../lib/media'

export default function ImagePicker({ value, onChange, label }) {
  const [index, setIndex] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchMediaIndex().then(setIndex)
  }, [])

  const groups = [
    { key: 'published', title: 'Catalogue', items: index?.published ?? [] },
    { key: 'inbox', title: 'Inbox (nouveaux)', items: index?.inbox ?? [] },
  ]

  return (
    <div>
      {label ? <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-earth/60">{label}</p> : null}
      <div className="flex flex-wrap gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/products/....png"
          className="min-w-0 flex-1 rounded-xl border border-cream-dark bg-white px-3 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-950"
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-xl border border-cream-dark px-4 py-2.5 text-sm font-semibold text-tg-green dark:border-neutral-700"
        >
          {open ? 'Fermer' : 'Bibliothèque'}
        </button>
      </div>

      {value ? (
        <div className="mt-3 flex justify-center rounded-xl bg-cream p-3 dark:bg-neutral-950">
          <img src={value} alt="" className="max-h-32 object-contain" />
        </div>
      ) : null}

      {open ? (
        <div className="mt-4 max-h-80 space-y-4 overflow-y-auto rounded-xl border border-cream-dark p-3 dark:border-neutral-800">
          {groups.map((group) =>
            group.items.length ? (
              <div key={group.key}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-earth/50">{group.title}</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {group.items.map((item) => (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => {
                        onChange(item.path)
                        setOpen(false)
                      }}
                      className={`overflow-hidden rounded-lg border p-1 transition hover:border-tg-green ${
                        value === item.path ? 'border-tg-green ring-2 ring-tg-green/30' : 'border-cream-dark dark:border-neutral-700'
                      }`}
                    >
                      <img src={item.path} alt="" className="aspect-square w-full object-contain" />
                      <p className="mt-1 truncate text-[0.6rem] text-earth-soft">{item.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : null,
          )}
        </div>
      ) : null}
    </div>
  )
}
