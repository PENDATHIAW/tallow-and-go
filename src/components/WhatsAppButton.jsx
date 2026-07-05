import { MessageCircle } from 'lucide-react'
import { openSupportWhatsApp } from '../lib/whatsapp'
import { useLocale } from '../context/LocaleContext'

export default function WhatsAppButton() {
  const { locale, t } = useLocale()

  return (
    <button
      type="button"
      onClick={() => openSupportWhatsApp(locale)}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-xl sm:bottom-6 sm:right-6"
      aria-label={t.whatsapp.contact}
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">{t.whatsapp.label}</span>
    </button>
  )
}
