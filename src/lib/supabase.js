import { createClient } from '@supabase/supabase-js'
import { translations } from '../i18n/translations'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

function getMessages(locale = 'fr') {
  return translations[locale]?.newsletter ?? translations.fr.newsletter
}

export async function subscribeNewsletter(email, locale = 'fr') {
  const messages = getMessages(locale)

  if (!supabase) {
    return { ok: false, message: messages.notConfigured }
  }

  const { error } = await supabase.from('newsletter_subscribers').insert({ email })

  if (error) {
    if (error.code === '23505') {
      return { ok: true, message: messages.duplicate }
    }
    return { ok: false, message: messages.error }
  }

  return { ok: true, message: messages.success }
}
