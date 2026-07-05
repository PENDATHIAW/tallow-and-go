/** Bienfaits détaillés, composition et mode d'emploi — source PDF + visuels officiels */
import { getProductImage } from './illustrationManifest'
export const productExtras = {
  safaa: {
    composition: {
      fr: ['Suif de bœuf purifié', 'Lait de vache', 'Huile de neem', 'Charbon actif'],
      en: ['Purified beef tallow', 'Cow milk', 'Neem oil', 'Activated charcoal'],
    },
    usage: {
      fr: 'Mouillez la peau, faites mousser, appliquez sur le visage et le corps, puis rincez. Usage quotidien.',
      en: 'Wet skin, lather, apply to face and body, then rinse. Daily use.',
    },
    benefits: {
      fr: ['Nettoie en profondeur sans dessécher', 'Purifie et clarifie le teint', 'Respecte la barrière cutanée', 'Convient visage & corps'],
      en: ['Deep cleanse without drying', 'Purifies and clarifies', 'Respects skin barrier', 'Face & body suitable'],
    },
  },
  aura: {
    composition: {
      fr: ['Suif fouetté purifié', 'Charbon actif', 'Sucre fin', 'Huile de nigelle', 'Vitamine E'],
      en: ['Whipped purified tallow', 'Activated charcoal', 'Fine sugar', 'Black seed oil', 'Vitamin E'],
    },
    usage: {
      fr: '1 à 2 fois par semaine sur peau humide. Masser en douceur puis rincer.',
      en: 'Once or twice weekly on damp skin. Massage gently and rinse.',
    },
    benefits: {
      fr: ['Exfolie en douceur', 'Purifie les pores', 'Lisse le grain de peau', 'Révèle l\'éclat'],
      en: ['Gentle exfoliation', 'Purifies pores', 'Smooths texture', 'Reveals radiance'],
    },
  },
  'fix-it': {
    composition: {
      fr: ['Suif purifié', 'Niacinamide', 'Acide azélaïque', 'Panthénol', 'Vitamine E'],
      en: ['Purified tallow', 'Niacinamide', 'Azelaic acid', 'Panthenol', 'Vitamin E'],
    },
    usage: {
      fr: 'Appliquer localement sur les zones à imperfections, matin et/ou soir.',
      en: 'Apply locally on blemish areas, morning and/or evening.',
    },
    benefits: {
      fr: ['Atténue les imperfections', 'Unifie le teint', 'Texture légère non grasse'],
      en: ['Reduces blemishes', 'Evens complexion', 'Light non-greasy texture'],
    },
  },
  noor: {
    composition: {
      fr: ['Suif purifié', 'Moringa', 'Rose musquée', 'Calendula', 'Eau de rose', 'Aloe vera', 'Réglisse', 'Panthénol', 'Vitamine E'],
      en: ['Purified tallow', 'Moringa', 'Rosehip', 'Calendula', 'Rose water', 'Aloe vera', 'Licorice', 'Panthenol', 'Vitamin E'],
    },
    usage: {
      fr: 'Le soir, sur peau propre. Appliquer en couche fine sur visage et cou.',
      en: 'Evening on clean skin. Apply a thin layer to face and neck.',
    },
    benefits: {
      fr: ['Répare pendant la nuit', 'Nourrit intensément', 'Unifie et révèle l\'éclat', 'Renforce la barrière cutanée'],
      en: ['Repairs overnight', 'Deep nourishment', 'Evens and brightens', 'Strengthens skin barrier'],
    },
  },
  sunsafe: {
    composition: {
      fr: ['Suif de bœuf', 'Filtres minéraux SPF50+', 'Vitamine E', 'Huiles végétales'],
      en: ['Beef tallow', 'SPF50+ mineral filters', 'Vitamin E', 'Plant oils'],
    },
    usage: {
      fr: 'Appliquer généreusement avant l\'exposition. Renouveler toutes les 2 h.',
      en: 'Apply generously before sun exposure. Reapply every 2 hours.',
    },
    benefits: {
      fr: ['SPF50+ minéral', 'Sans traces sur peaux foncées', 'Nourrit & apaise', 'Protection UVA/UVB'],
      en: ['SPF50+ mineral', 'No white cast on dark skin', 'Nourishes & soothes', 'UVA/UVB protection'],
    },
  },
  nurture: {
    composition: {
      fr: ['Triglycérides', 'Huile de tournesol', 'Huile de jojoba', 'Huile d\'avoine', 'Calendula', 'Vitamine E'],
      en: ['Triglycerides', 'Sunflower oil', 'Jojoba oil', 'Oat oil', 'Calendula', 'Vitamin E'],
    },
    usage: {
      fr: 'Masser sur peau sèche pour démaquiller, puis émulsionner à l\'eau et rincer.',
      en: 'Massage on dry skin to remove makeup, emulsify with water and rinse.',
    },
    benefits: {
      fr: ['Nettoie en douceur', 'Nourrit intensément', 'Respecte la barrière cutanée'],
      en: ['Gentle cleanse', 'Deep nourishment', 'Barrier-friendly'],
    },
  },
  shiny: {
    composition: {
      fr: ['Suif purifié', 'Huile de carotte', 'Huile d\'hibiscus', 'Niacinamide', 'Vitamine E'],
      en: ['Purified tallow', 'Carrot oil', 'Hibiscus seed oil', 'Niacinamide', 'Vitamin E'],
    },
    usage: {
      fr: 'Matin sur peau propre. Appliquer sur visage et corps par massages.',
      en: 'Morning on clean skin. Massage onto face and body.',
    },
    benefits: {
      fr: ['Nourrit intensément', 'Hydrate durablement', 'Révèle l\'éclat naturel', 'Protège la peau'],
      en: ['Deep nourishment', 'Lasting hydration', 'Natural glow', 'Protects skin'],
    },
  },
  cocoony: {
    composition: {
      fr: ['Suif purifié', 'Beurre de mangue', 'Huile de jojoba', 'Squalane', 'Avoine colloïdale', 'Panthénol', 'Bisabolol', 'Vitamine E'],
      en: ['Purified tallow', 'Mango butter', 'Jojoba oil', 'Squalane', 'Colloidal oatmeal', 'Panthenol', 'Bisabolol', 'Vitamin E'],
    },
    usage: {
      fr: 'Appliquer sur peau propre, masser jusqu\'à pénétration. Idéal après la douche.',
      en: 'Apply on clean skin, massage until absorbed. Ideal after shower.',
    },
    benefits: {
      fr: ['Nourrit', 'Apaise', 'Peau lisse et veloutée', 'Tous types de peau'],
      en: ['Nourishes', 'Soothes', 'Smooth velvety skin', 'All skin types'],
    },
  },
  'relief-balm': {
    composition: {
      fr: ['Suif de bœuf purifié', 'Calendula', 'Huile de jojoba', 'Vitamine E'],
      en: ['Purified beef tallow', 'Calendula', 'Jojoba oil', 'Vitamin E'],
    },
    usage: {
      fr: 'Appliquer sur zones sèches, visage, corps ou mains. Usage dès la naissance.',
      en: 'Apply on dry areas, face, body or hands. Safe from birth.',
    },
    benefits: {
      fr: ['Apaise & répare', '4 ingrédients naturels', 'Sans parfum ni colorant', 'Toute la famille'],
      en: ['Soothes & repairs', '4 natural ingredients', 'Fragrance & colorant free', 'Whole family'],
    },
  },
  'relief-dry-oil': {
    composition: {
      fr: ['Suif de bœuf', 'Huile de rose musquée', 'Huile de jojoba', 'Calendula', 'Aloe vera', 'Vitamine E'],
      en: ['Beef tallow', 'Rosehip oil', 'Jojoba oil', 'Calendula', 'Aloe vera', 'Vitamin E'],
    },
    usage: {
      fr: 'Vaporiser et masser sur peau propre, matin ou soir. Convient aux femmes enceintes.',
      en: 'Spray and massage on clean skin, morning or evening. Suitable during pregnancy.',
    },
    benefits: {
      fr: ['Nourrit en profondeur', 'Soutient l\'élasticité', 'Confort peaux sèches', '100 % origine naturelle'],
      en: ['Deep nourishment', 'Supports elasticity', 'Dry skin comfort', '100% natural origin'],
    },
  },
  clean: {
    composition: {
      fr: ['Suif purifié', 'Arrow root', 'Zinc', 'Magnésium', 'Beurre de karité'],
      en: ['Purified tallow', 'Arrow root', 'Zinc', 'Magnesium', 'Shea butter'],
    },
    usage: {
      fr: 'Appliquer une fine couche sur aisselles propres et sèches. Renouveler si besoin.',
      en: 'Apply a thin layer on clean dry underarms. Reapply if needed.',
    },
    benefits: {
      fr: ['Protection 24 h', 'Sans aluminium', 'Sans bicarbonate', 'Apaisé après rasage', 'Peaux sensibles'],
      en: ['24 h protection', 'Aluminum-free', 'Bicarbonate-free', 'Soothes after shaving', 'Sensitive skin'],
    },
  },
  'soft-kiss': {
    composition: {
      fr: ['Suif purifié', 'Huile de ricin', 'Cire d\'abeille', 'Bisabolol', 'Vitamine E'],
      en: ['Purified tallow', 'Castor oil', 'Beeswax', 'Bisabolol', 'Vitamin E'],
    },
    usage: {
      fr: 'Appliquer sur les lèvres à tout moment. Réappliquer selon le besoin.',
      en: 'Apply on lips anytime. Reapply as needed.',
    },
    benefits: {
      fr: ['Nourrit intensément', 'Répare & apaise', 'Protège la barrière des lèvres', 'Format nomade'],
      en: ['Deep nourishment', 'Repairs & soothes', 'Protects lip barrier', 'Travel-friendly'],
    },
  },
  comfy: {
    composition: {
      fr: ['Suif purifié', 'Huile de moringa', 'Huile de calendula', 'Cire d\'abeille', 'Panthénol', 'Urée 5 %', 'Vitamine E'],
      en: ['Purified tallow', 'Moringa oil', 'Calendula oil', 'Beeswax', 'Panthenol', 'Urea 5%', 'Vitamin E'],
    },
    usage: {
      fr: 'Prenez une galette, frottez entre vos mains jusqu\'à fonte, appliquez sur les pieds.',
      en: 'Take one melt, rub between hands until melted, apply on feet.',
    },
    benefits: {
      fr: ['Nourrit & adoucit', '7 galettes pratiques', '100 % naturel', 'Pieds doux et reposés'],
      en: ['Nourishes & softens', '7 practical melts', '100% natural', 'Soft rested feet'],
    },
  },
  'glow-and-go': {
    composition: {
      fr: ['Suif purifié', 'Noix de coco', 'Vanille', 'Musc blanc'],
      en: ['Purified tallow', 'Coconut', 'Vanilla', 'White musk'],
    },
    usage: {
      fr: 'Faites fondre une perle entre les doigts, appliquez sur zones sèches (mains, cuticules, visage).',
      en: 'Melt one pearl between fingers, apply on dry areas (hands, cuticles, face).',
    },
    benefits: {
      fr: ['Nomade & multi-usages', 'Nourrit intensément', 'Illumine naturellement', '90 perles'],
      en: ['On-the-go multi-use', 'Deep nourishment', 'Natural glow', '90 pearls'],
    },
  },
  eden: {
    composition: {
      fr: ['Parfum signature Tallow & Go', 'Diffusion ambiance non cutanée'],
      en: ['Tallow & Go signature scent', 'Non-skin ambient diffusion'],
    },
    usage: {
      fr: 'Accrochez le tag dans votre dressing, valise ou intérieur. Ne pas appliquer sur la peau.',
      en: 'Hang the tag in closet, luggage or home. Do not apply to skin.',
    },
    benefits: {
      fr: ['Ambiance raffinée', 'Format nomade', 'Signature maison', 'Lifestyle & cadeau'],
      en: ['Refined ambiance', 'Travel format', 'House signature', 'Lifestyle & gift'],
    },
  },
}

export function enrichProduct(product) {
  const extra = productExtras[product.id]
  const lifestyle = getProductImage(product.id)
  return {
    ...product,
    ...(lifestyle ? { image: lifestyle } : {}),
    ...(extra
      ? {
          benefits: extra.benefits,
          composition: extra.composition,
          usage: extra.usage,
        }
      : {}),
  }
}
