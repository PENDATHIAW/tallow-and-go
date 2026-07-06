import { bundles, products, routines } from '../data/catalog'
import { enrichProduct } from '../data/productExtras'
import { getBundleImage } from '../data/illustrationManifest'
import { homeContent } from '../data/pageContent'
import { supabase, isSupabaseConfigured } from './supabase'

const EMPTY_CONFIG = { products: {}, bundles: {}, content: {} }

export const defaultHomeExtras = {
  fr: {
    stats: [
      { value: '14+', label: 'soins au suif purifié' },
      { value: '100%', label: 'tous types de peau' },
      { value: 'Dakar', label: 'fabriqué & livré au Sénégal' },
      { value: '24 h', label: 'réponse WhatsApp & suivi commande' },
    ],
    storyTitle: 'Née à Dakar, pensée pour votre peau',
    storyLead:
      'Tallow & Go est une marque sénégalaise. Nos soins sont formulés avec des professionnels de la cosmétique, à partir d\'un suif de bœufs élevés au Sénégal et nourris 100 % à l\'herbe — pour tous les types de peau, du visage au corps.',
    storyPoints: [
      'Suif 100 % sénégalais · bœufs nourris à l\'herbe',
      'Formules pour tous les types de peau',
      'Développées avec des professionnels de la cosmétique',
    ],
    testimonials: [
      {
        name: 'Aïssatou',
        city: 'Dakar',
        quote: 'Ma peau mixte enfin apaisée — SHINY le matin, NOOR le soir, et je ne reviens plus aux crèmes qui piquent.',
      },
      {
        name: 'Mame Diarra',
        city: 'Almadies',
        quote: 'Le coffret Mama Bear m\'a accompagnée toute ma grossesse. RELIEF Balm est devenu indispensable pour toute la famille.',
      },
      {
        name: 'Khady',
        city: 'Thiès',
        quote: 'Livraison rapide, équipe réactive sur WhatsApp. SUNSAFE sans traces blanches — enfin une protection solaire qui me convient.',
      },
    ],
  },
  en: {
    stats: [
      { value: '14+', label: 'tallow-based treatments' },
      { value: '100%', label: 'all skin types' },
      { value: 'Dakar', label: 'made & delivered in Senegal' },
      { value: '24 h', label: 'WhatsApp reply & order follow-up' },
    ],
    storyTitle: 'Born in Dakar, made for your skin',
    storyLead:
      'Tallow & Go is a Senegalese brand. Our treatments are formulated with cosmetic professionals, from tallow of cattle raised in Senegal and fed 100% grass — for all skin types, face to body.',
    storyPoints: [
      '100% Senegalese tallow · grass-fed cattle',
      'Formulas for all skin types',
      'Developed with cosmetic professionals',
    ],
    testimonials: [
      {
        name: 'Aïssatou',
        city: 'Dakar',
        quote: 'My combination skin finally soothed — SHINY in the morning, NOOR at night. I won\'t go back to stinging creams.',
      },
      {
        name: 'Mame Diarra',
        city: 'Almadies',
        quote: 'The Mama Bear set carried me through pregnancy. RELIEF Balm is now essential for the whole family.',
      },
      {
        name: 'Khady',
        city: 'Thiès',
        quote: 'Fast delivery, responsive team on WhatsApp. SUNSAFE with no white cast — finally sun care that works for me.',
      },
    ],
  },
}

function parseContentBlock(raw, locale, blockKey) {
  const key = `${blockKey}:${locale}`
  const data = raw?.content?.[key]
  return data && typeof data === 'object' ? data : null
}

export function mergeProduct(base, override) {
  if (!override) return base
  const merged = { ...base }
  if (override.price != null) merged.price = override.price
  if (override.image_url) merged.image = override.image_url
  if (override.name) merged.name = override.name
  if (override.tagline_fr || override.tagline_en) {
    merged.tagline = {
      fr: override.tagline_fr ?? base.tagline?.fr,
      en: override.tagline_en ?? base.tagline?.en,
    }
  }
  if (override.description_fr || override.description_en) {
    merged.description = {
      fr: override.description_fr ?? base.description?.fr,
      en: override.description_en ?? base.description?.en,
    }
  }
  if (override.featured != null) merged.featured = override.featured
  if (override.active === false) merged.hidden = true
  return merged
}

export function mergeBundle(base, override) {
  if (!override) return base
  const merged = { ...base }
  if (override.price != null) merged.price = override.price
  if (override.image_url) merged.image = override.image_url
  if (override.name) merged.name = override.name
  if (override.tagline_fr || override.tagline_en) {
    merged.tagline = {
      fr: override.tagline_fr ?? base.tagline?.fr,
      en: override.tagline_en ?? base.tagline?.en,
    }
  }
  if (override.description_fr || override.description_en) {
    merged.description = {
      fr: override.description_fr ?? base.description?.fr,
      en: override.description_en ?? base.description?.en,
    }
  }
  if (override.active === false) merged.hidden = true
  return merged
}

export function buildCatalog(config = EMPTY_CONFIG) {
  const productOverrides = config.products ?? {}
  const bundleOverrides = config.bundles ?? {}

  const mergedProducts = products
    .map((p) => enrichProduct(p))
    .map((p) => mergeProduct(p, productOverrides[p.id]))
    .filter((p) => !p.hidden)

  const mergedBundles = bundles
    .map((b) => {
      const image = getBundleImage(b.id)
      return image ? { ...b, image } : b
    })
    .map((b) => mergeBundle(b, bundleOverrides[b.id]))
    .filter((b) => !b.hidden)

  return {
    products: mergedProducts,
    bundles: mergedBundles,
    routines,
    getProduct(id) {
      return mergedProducts.find((p) => p.id === id)
    },
    getBundle(id) {
      return mergedBundles.find((b) => b.id === id)
    },
    getProductsByUniverse(universeId) {
      if (universeId === 'nomades') return mergedProducts.filter((p) => p.nomade)
      return mergedProducts.filter((p) => p.universe === universeId)
    },
    getRoutineProducts(routineId) {
      const routine = routines.find((r) => r.id === routineId)
      if (!routine) return []
      return routine.productIds.map((id) => mergedProducts.find((p) => p.id === id)).filter(Boolean)
    },
  }
}

export function buildHomeContent(config = EMPTY_CONFIG, locale = 'fr') {
  const base = homeContent[locale] ?? homeContent.fr
  const homeBlock = parseContentBlock(config, locale, 'home') ?? {}
  const extras = defaultHomeExtras[locale] ?? defaultHomeExtras.fr
  const extrasBlock = parseContentBlock(config, locale, 'home_extras') ?? {}

  return {
    ...base,
    ...homeBlock,
    stats: extrasBlock.stats ?? extras.stats,
    storyTitle: extrasBlock.storyTitle ?? extras.storyTitle,
    storyLead: extrasBlock.storyLead ?? extras.storyLead,
    storyPoints: extrasBlock.storyPoints ?? extras.storyPoints,
    testimonials: extrasBlock.testimonials ?? extras.testimonials,
  }
}

export function buildHeroContent(config = EMPTY_CONFIG, locale = 'fr', baseHero = {}) {
  const heroBlock = parseContentBlock(config, locale, 'hero') ?? {}
  return { ...baseHero, ...heroBlock }
}

export async function fetchShopConfig() {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: true, config: EMPTY_CONFIG }
  }

  const { data, error } = await supabase.rpc('get_shop_config')
  if (error) {
    return { ok: false, message: error.message, config: EMPTY_CONFIG }
  }

  return {
    ok: true,
    config: {
      products: data?.products ?? {},
      bundles: data?.bundles ?? {},
      content: data?.content ?? {},
    },
  }
}

export async function fetchAdminShopConfig(credentials) {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, message: 'Supabase non configuré', config: EMPTY_CONFIG }
  }

  const { data, error } = await supabase.rpc('admin_get_shop_config', {
    p_user: credentials.user,
    p_password: credentials.password,
  })

  if (error) {
    return { ok: false, message: error.message, config: EMPTY_CONFIG }
  }

  return {
    ok: true,
    config: {
      products: data?.products ?? {},
      bundles: data?.bundles ?? {},
      content: data?.content ?? {},
    },
  }
}

export async function saveProductOverride(credentials, productId, payload) {
  if (!supabase) return { ok: false, message: 'Supabase non configuré' }

  const { error } = await supabase.rpc('admin_upsert_product_override', {
    p_user: credentials.user,
    p_password: credentials.password,
    p_product_id: productId,
    p_price: payload.price ?? null,
    p_image_url: payload.image_url ?? '',
    p_name: payload.name ?? '',
    p_tagline_fr: payload.tagline_fr ?? '',
    p_tagline_en: payload.tagline_en ?? '',
    p_description_fr: payload.description_fr ?? '',
    p_description_en: payload.description_en ?? '',
    p_featured: payload.featured ?? null,
    p_active: payload.active ?? true,
  })

  return error ? { ok: false, message: error.message } : { ok: true }
}

export async function saveBundleOverride(credentials, bundleId, payload) {
  if (!supabase) return { ok: false, message: 'Supabase non configuré' }

  const { error } = await supabase.rpc('admin_upsert_bundle_override', {
    p_user: credentials.user,
    p_password: credentials.password,
    p_bundle_id: bundleId,
    p_price: payload.price ?? null,
    p_image_url: payload.image_url ?? '',
    p_name: payload.name ?? '',
    p_tagline_fr: payload.tagline_fr ?? '',
    p_tagline_en: payload.tagline_en ?? '',
    p_description_fr: payload.description_fr ?? '',
    p_description_en: payload.description_en ?? '',
    p_active: payload.active ?? true,
  })

  return error ? { ok: false, message: error.message } : { ok: true }
}

export async function saveContentBlock(credentials, blockKey, locale, content) {
  if (!supabase) return { ok: false, message: 'Supabase non configuré' }

  const { error } = await supabase.rpc('admin_upsert_content_block', {
    p_user: credentials.user,
    p_password: credentials.password,
    p_block_key: blockKey,
    p_locale: locale,
    p_content: content,
  })

  return error ? { ok: false, message: error.message } : { ok: true }
}
