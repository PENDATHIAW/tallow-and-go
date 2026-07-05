import { Leaf, ShieldCheck, Truck } from 'lucide-react'
import { useLocale } from '../context/LocaleContext'

export default function ProductTrustStrip() {
  const { t } = useLocale()
  const items = [
    { icon: Leaf, label: t.product.trustNatural },
    { icon: Truck, label: t.product.trustDelivery },
    { icon: ShieldCheck, label: t.product.trustPayment },
  ]

  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-3">
      {items.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="flex items-center gap-3 rounded-xl border border-cream-dark bg-cream/40 px-4 py-3 text-sm text-earth-soft dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-300"
        >
          <Icon className="h-4 w-4 shrink-0 text-tg-green" />
          {label}
        </li>
      ))}
    </ul>
  )
}
