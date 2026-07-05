import { enrichProduct } from './productExtras'
import { getBundleImage } from './illustrationManifest'

export const universes = [
  {
    id: 'skin',
    image: '/products/shiny.png',
  },
  {
    id: 'body',
    image: '/products/cocoony.png',
  },
  {
    id: 'essentials',
    image: '/products/soft-kiss.png',
  },
  {
    id: 'nomades',
    image: '/products/glow-and-go.png',
  },
]

export const products = [
  {
    id: 'safaa',
    name: 'SAFAA',
    tagline: { fr: 'Savon purifiant', en: 'Purifying soap' },
    size: '200 g',
    price: 5000,
    image: '/products/safaa.png',
    universe: 'skin',
    zones: ['face', 'body'],
    nomade: true,
    routine: { id: 'matin-eclat', step: 1 },
    featured: true,
    description: {
      fr: 'Nettoyage quotidien visage & corps au suif purifié.',
      en: 'Daily face & body cleanse with purified tallow.',
    },
    benefits: {
      fr: ['Nettoie en profondeur', 'Purifie sans dessécher', 'Visage & corps'],
      en: ['Deep cleanse', 'Purifies without drying', 'Face & body'],
    },
  },
  {
    id: 'aura',
    name: 'AURA',
    tagline: { fr: 'Gommage fouetté clarifiant', en: 'Clarifying whipped polish' },
    size: '500 g',
    price: 8000,
    image: '/products/aura.png',
    universe: 'skin',
    zones: ['face', 'body'],
    nomade: false,
    routine: { id: 'hebdo', step: 1 },
    featured: false,
    description: {
      fr: 'Exfoliation douce 1 à 2 fois par semaine.',
      en: 'Gentle exfoliation once or twice a week.',
    },
    benefits: {
      fr: ['Exfolie en douceur', 'Purifie les pores', 'Révèle l\'éclat'],
      en: ['Gentle exfoliation', 'Purifies pores', 'Reveals radiance'],
    },
  },
  {
    id: 'fix-it',
    name: 'FIX IT',
    tagline: { fr: 'Crème corrective visage', en: 'Corrective face cream' },
    size: '50 ml',
    price: 7000,
    image: '/products/fix-it.png',
    universe: 'skin',
    zones: ['face'],
    nomade: false,
    routine: null,
    featured: false,
    description: {
      fr: 'Soin ciblé imperfections et marques.',
      en: 'Targeted care for blemishes and marks.',
    },
    benefits: {
      fr: ['Atténue les imperfections', 'Unifie le teint', 'Texture légère'],
      en: ['Reduces blemishes', 'Evens tone', 'Light texture'],
    },
  },
  {
    id: 'noor',
    name: 'NOOR',
    tagline: { fr: 'Crème de nuit réparatrice', en: 'Overnight recovery cream' },
    size: '200 g',
    price: 15000,
    image: '/products/noor.png',
    universe: 'skin',
    zones: ['face'],
    nomade: false,
    routine: { id: 'nuit', step: 1 },
    featured: true,
    description: {
      fr: 'Soin nuit — répare, apaise, régénère.',
      en: 'Night care — repairs, soothes, regenerates.',
    },
    benefits: {
      fr: ['Répare la nuit', 'Nourrit intensément', 'Révèle l\'éclat au réveil'],
      en: ['Overnight repair', 'Deep nourishment', 'Morning radiance'],
    },
  },
  {
    id: 'sunsafe',
    name: 'SUNSAFE',
    tagline: { fr: 'Crème solaire minérale SPF50+', en: 'Mineral sunscreen SPF50+' },
    size: '100 ml',
    price: 6000,
    image: '/products/sunsafe.png',
    universe: 'skin',
    zones: ['face'],
    nomade: true,
    routine: { id: 'matin-eclat', step: 3 },
    featured: false,
    description: {
      fr: 'Protection minérale, sans traces sur peaux foncées.',
      en: 'Mineral protection, no white cast on dark skin.',
    },
    benefits: {
      fr: ['SPF50+ minéral', 'Sans traces blanches', 'Nourrit & apaise'],
      en: ['SPF50+ mineral', 'No white cast', 'Nourishes & soothes'],
    },
  },
  {
    id: 'nurture',
    name: 'NURTURE',
    tagline: { fr: 'Huile lavante nourrissante', en: 'Nourishing cleansing oil' },
    size: '500 ml',
    price: 15000,
    image: '/products/nurture.png',
    universe: 'skin',
    zones: ['face'],
    nomade: false,
    routine: { id: 'double-nettoyage', step: 1 },
    featured: false,
    description: {
      fr: 'Démaquillage et double nettoyage en douceur.',
      en: 'Gentle makeup removal and double cleanse.',
    },
    benefits: {
      fr: ['Nettoie en douceur', 'Nourrit intensément', 'Respecte la barrière'],
      en: ['Gentle cleanse', 'Deep nourishment', 'Barrier-friendly'],
    },
  },
  {
    id: 'shiny',
    name: 'SHINY',
    tagline: { fr: 'Lait visage & corps éclat', en: 'Radiance face & body milk' },
    size: '500 ml',
    price: 15000,
    image: '/products/shiny.png',
    universe: 'body',
    zones: ['face', 'body'],
    nomade: false,
    routine: { id: 'matin-eclat', step: 2 },
    featured: true,
    description: {
      fr: 'Soin de jour — hydrate, nourrit, révèle l\'éclat.',
      en: 'Day care — hydrates, nourishes, reveals glow.',
    },
    benefits: {
      fr: ['Nourrit intensément', 'Hydrate durablement', 'Révèle l\'éclat'],
      en: ['Deep nourishment', 'Lasting hydration', 'Natural glow'],
    },
  },
  {
    id: 'cocoony',
    name: 'COCOONY',
    tagline: { fr: 'Crème fouettée corps', en: 'Whipped body cream' },
    size: '200 ml',
    price: 12000,
    image: '/products/cocoony.png',
    universe: 'body',
    zones: ['body'],
    nomade: false,
    routine: { id: 'corps', step: 1 },
    featured: false,
    description: {
      fr: 'Nutrition cocooning pour une peau veloutée.',
      en: 'Cocooning nourishment for velvety skin.',
    },
    benefits: {
      fr: ['Nourrit', 'Apaise', 'Peau lisse et veloutée'],
      en: ['Nourishes', 'Soothes', 'Smooth, velvety skin'],
    },
  },
  {
    id: 'relief-balm',
    name: 'RELIEF',
    tagline: { fr: 'Baume réparateur', en: 'Skin recovery balm' },
    size: '100 g',
    price: 10000,
    image: '/products/relief-balm.png',
    universe: 'body',
    zones: ['face', 'body', 'hands'],
    nomade: false,
    routine: { id: 'relief', step: 2 },
    featured: true,
    description: {
      fr: 'Apaise, répare, protège — peaux sensibles, toute la famille.',
      en: 'Soothes, repairs, protects — sensitive skin, all ages.',
    },
    benefits: {
      fr: ['Apaise & répare', '4 ingrédients naturels', 'Dès la naissance'],
      en: ['Soothes & repairs', '4 natural ingredients', 'From birth'],
    },
  },
  {
    id: 'relief-dry-oil',
    name: 'RELIEF',
    tagline: { fr: 'Huile sèche corps', en: 'Dry body oil' },
    size: '100 ml',
    price: 10000,
    image: '/products/relief-dry-oil.png',
    universe: 'body',
    zones: ['body'],
    nomade: false,
    routine: { id: 'relief', step: 1 },
    featured: false,
    description: {
      fr: 'Soutient l\'élasticité, confort peaux sèches et grossesse.',
      en: 'Supports elasticity, comfort for dry skin and pregnancy.',
    },
    benefits: {
      fr: ['Nourrit en profondeur', 'Soutient l\'élasticité', '100 % origine naturelle'],
      en: ['Deep nourishment', 'Supports elasticity', '100% natural origin'],
    },
  },
  {
    id: 'clean',
    name: 'CLEAN',
    tagline: { fr: 'Déodorant naturel', en: 'Natural deodorant' },
    size: '75 g',
    price: 4000,
    image: '/products/clean.png',
    universe: 'essentials',
    zones: ['body'],
    nomade: true,
    routine: null,
    featured: false,
    description: {
      fr: 'Déodorant au suif, sans aluminium.',
      en: 'Tallow-based deodorant, aluminum-free.',
    },
    benefits: {
      fr: ['Sans aluminium', 'Ingrédients naturels', 'Fraîcheur durable'],
      en: ['Aluminum-free', 'Natural ingredients', 'Lasting freshness'],
    },
  },
  {
    id: 'soft-kiss',
    name: 'SOFT KISS',
    tagline: { fr: 'Baume lèvres nourrissant', en: 'Nourishing lip balm' },
    size: '15 ml',
    price: 4500,
    image: '/products/soft-kiss.png',
    universe: 'essentials',
    zones: ['lips'],
    nomade: true,
    routine: null,
    featured: true,
    description: {
      fr: 'Nourrit, répare, apaise les lèvres sèches.',
      en: 'Nourishes, repairs, soothes dry lips.',
    },
    benefits: {
      fr: ['Nourrit intensément', 'Répare & apaise', 'Format nomade'],
      en: ['Deep nourishment', 'Repairs & soothes', 'Travel-friendly'],
    },
  },
  {
    id: 'comfy',
    name: 'COMFY',
    tagline: { fr: 'Galettes fondantes pieds', en: 'Foot comfort melts' },
    size: '7 galettes',
    price: 6000,
    image: '/products/comfy.png',
    universe: 'essentials',
    zones: ['feet'],
    nomade: false,
    routine: { id: 'pieds', step: 1 },
    featured: false,
    description: {
      fr: '7 galettes ultra-nourrissantes pour pieds doux.',
      en: '7 ultra-nourishing melts for soft feet.',
    },
    benefits: {
      fr: ['Nourrit & adoucit', 'Format pratique', '100 % naturel'],
      en: ['Nourishes & softens', 'Easy format', '100% natural'],
    },
  },
  {
    id: 'glow-and-go',
    name: 'GLOW & GO',
    tagline: { fr: 'Perles beauté multi-usages', en: 'Multi-use beauty pearls' },
    size: '90 perles',
    price: 8000,
    image: '/products/glow-and-go.png',
    universe: 'nomades',
    zones: ['face', 'body', 'hands'],
    nomade: true,
    routine: null,
    featured: true,
    description: {
      fr: 'Perles fondantes — partout, à tout moment.',
      en: 'Melting pearls — anywhere, anytime.',
    },
    benefits: {
      fr: ['Nomade', 'Nourrit intensément', 'Illumine naturellement'],
      en: ['On-the-go', 'Deep nourishment', 'Natural glow'],
    },
  },
]

export const bundles = [
  {
    id: 'mama-bear',
    name: 'Mama Bear',
    tagline: { fr: 'Mommy & Baby', en: 'Mommy & Baby' },
    price: 30000,
    image: '/bundles/mama-bear.png',
    productIds: ['relief-dry-oil', 'relief-balm', 'comfy'],
    description: {
      fr: 'Dry Oil matin · COMFY & RELIEF Balm soir — rituel maternité.',
      en: 'Dry Oil morning · COMFY & RELIEF Balm evening — maternity ritual.',
    },
  },
  {
    id: 'eden-kit',
    name: 'EDEN',
    tagline: { fr: 'Kit ambiance parfumée', en: 'Scented ambiance kit' },
    price: 20000,
    image: '/bundles/eden.png',
    productIds: [],
    description: {
      fr: 'Collection parfumée — coquillages, pot-pourri, objets nomades et Eden Drops.',
      en: 'Scented collection — shells, potpourri, travel objects and Eden Drops.',
    },
  },
]

export const routines = [
  {
    id: 'matin-eclat',
    productIds: ['safaa', 'shiny', 'sunsafe'],
  },
  {
    id: 'nuit',
    productIds: ['nurture', 'noor'],
  },
  {
    id: 'hebdo',
    productIds: ['aura'],
  },
  {
    id: 'double-nettoyage',
    productIds: ['nurture', 'safaa'],
  },
  {
    id: 'corps',
    productIds: ['shiny', 'cocoony'],
  },
  {
    id: 'relief',
    productIds: ['relief-dry-oil', 'relief-balm'],
  },
  {
    id: 'pieds',
    productIds: ['comfy'],
  },
]

export function getProduct(id) {
  const product = products.find((p) => p.id === id)
  return product ? enrichProduct(product) : undefined
}

export function getBundle(id) {
  const bundle = bundles.find((b) => b.id === id)
  if (!bundle) return undefined
  const image = getBundleImage(id)
  return image ? { ...bundle, image } : bundle
}

export function getProductsByUniverse(universeId) {
  let list
  if (universeId === 'nomades') {
    list = products.filter((p) => p.nomade)
  } else {
    list = products.filter((p) => p.universe === universeId)
  }
  return list.map(enrichProduct)
}

export function getRoutineProducts(routineId) {
  const routine = routines.find((r) => r.id === routineId)
  if (!routine) return []
  return routine.productIds.map((id) => getProduct(id)).filter(Boolean)
}
