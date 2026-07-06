import { universes } from './catalog'
import { getPageImage } from './illustrationManifest'
import { getUniversePath } from './routes'

const universePageKeys = {
  skin: 'universe-visage',
  body: 'universe-corps',
  essentials: 'universe-essentiels',
  nomades: 'universe-nomades',
}

/** Contenu éditorial riche — remplace les images par /public/illustrations/ quand disponibles */
export const trustPillars = {
  fr: [
    { title: 'Suif 100 % sénégalais', desc: 'Suif purifié issu de bœufs élevés au Sénégal, nourris 100 % à l\'herbe — filière locale et impact territorial.' },
    { title: 'Tous types de peau', desc: 'Formules inclusives : sèche, mixte, sensible, mature — du visage au corps, pour toute la famille.' },
    { title: 'Ingrédients nobles', desc: 'Beurre de karité, huiles végétales et actifs choisis avec des professionnels de la cosmétique.' },
    { title: 'Livraison Sénégal', desc: 'Expédition soignée partout au pays — tarifs selon votre localité dès 1 500 F.' },
  ],
  en: [
    { title: '100% Senegalese tallow', desc: 'Purified tallow from cattle raised in Senegal, 100% grass-fed — local supply chain and territorial impact.' },
    { title: 'All skin types', desc: 'Inclusive formulas: dry, combination, sensitive, mature — face to body, for the whole family.' },
    { title: 'Noble ingredients', desc: 'Shea butter, botanical oils and actives selected with cosmetic professionals.' },
    { title: 'Senegal delivery', desc: 'Careful shipping nationwide — rates from 1,500 F depending on your area.' },
  ],
}

export const homeHowItWorks = {
  fr: {
    kicker: 'Simple & humain',
    title: 'Commander en 3 gestes',
    lead: 'Pas de compte obligatoire — vous choisissez, vous payez comme vous voulez, on vous livre avec le sourire.',
    steps: [
      { title: 'Choisissez vos soins', desc: 'Parcourez les univers, le quiz ou les coffrets. Ajoutez au panier en un clic.' },
      { title: 'Validez votre commande', desc: 'Indiquez votre localité, téléphone et mode de paiement (Wave, OM ou espèces).' },
      { title: 'Suivi WhatsApp', desc: 'Notre équipe confirme, prépare et livre — vous pouvez nous écrire à tout moment.' },
    ],
    cta: 'Voir livraison & paiement',
  },
  en: {
    kicker: 'Simple & human',
    title: 'Order in 3 steps',
    lead: 'No account required — pick your products, pay your way, we deliver with care.',
    steps: [
      { title: 'Choose your care', desc: 'Browse categories, take the quiz or explore gift sets. Add to cart in one click.' },
      { title: 'Confirm your order', desc: 'Enter your area, phone and payment method (Wave, Orange Money or cash).' },
      { title: 'WhatsApp follow-up', desc: 'Our team confirms, prepares and delivers — message us anytime.' },
    ],
    cta: 'See delivery & payment',
  },
}

export const homeIngredients = {
  fr: {
    kicker: 'Ingrédients nobles',
    title: 'Ce que vous mettez sur votre peau',
    lead: 'Des actifs choisis pour nourrir, apaiser et protéger — sans liste interminable ni compromis sur la qualité.',
    items: [
      { name: 'Suif purifié', desc: 'De bœufs élevés au Sénégal, nourris 100 % à l\'herbe — lipides proches de votre peau, barrière renforcée.' },
      { name: 'Beurre de karité', desc: 'Apaise les peaux sèches et sensibles, texture fondante sous le climat tropical.' },
      { name: 'Huiles végétales', desc: 'Jojoba, moringa, rose musquée, nigelle — sélectionnées pour leurs bienfaits ciblés.' },
      { name: 'Actifs doux', desc: 'Niacinamide, panthénol, vitamine E — efficaces et respectueux de tous les types de peau.' },
      { name: 'SPF minéral', desc: 'Protection solaire sans traces blanches — convient à toutes les carnations.' },
      { name: 'Zéro superflu', desc: 'Pas de parfum agressif, pas de colorant inutile — l\'essentiel, rien de plus.' },
    ],
  },
  en: {
    kicker: 'Noble ingredients',
    title: 'What you put on your skin',
    lead: 'Actives chosen to nourish, soothe and protect — no endless list, no compromise on quality.',
    items: [
      { name: 'Purified tallow', desc: 'From cattle raised in Senegal, 100% grass-fed — lipids close to your skin, stronger barrier.' },
      { name: 'Shea butter', desc: 'Soothes dry sensitive skin, melting texture in tropical climates.' },
      { name: 'Botanical oils', desc: 'Jojoba, moringa, rosehip, black seed — selected for targeted benefits.' },
      { name: 'Gentle actives', desc: 'Niacinamide, panthenol, vitamin E — effective and respectful of all skin types.' },
      { name: 'Mineral SPF', desc: 'Sun protection without white cast — suits every skin tone.' },
      { name: 'Nothing extra', desc: 'No harsh fragrance, no useless colorants — essentials only.' },
    ],
  },
}

export const homeTallowScience = {
  fr: {
    kicker: 'La science du suif',
    title: 'Pourquoi le suif de bœuf change la donne',
    lead:
      'Le suif purifié (beef tallow) provient de bœufs élevés au Sénégal, nourris 100 % à l\'herbe. Riche en acides gras proches de ceux de notre peau, il nourrit en profondeur, répare la barrière cutanée et apaise — sans film gras.',
    points: [
      {
        title: 'Ancrage territorial',
        desc: 'Notre suif est obtenu auprès d\'éleveurs sénégalais, dans une filière locale transparente. Nourrir votre peau, c\'est aussi soutenir une agriculture d\'élevage responsable au Sénégal.',
      },
      {
        title: 'Compatible avec votre peau',
        desc: 'Sa composition lipidique ressemble au sébum naturel : la peau reconnaît le suif et l\'absorbe mieux qu\'une crème synthétique.',
      },
      {
        title: 'Barrière cutanée renforcée',
        desc: 'Il limite la perte en eau, protège contre le dessèchement et aide la peau à se défendre — idéal sous le soleil et la climatisation.',
      },
      {
        title: 'Pour tous les types de peau',
        desc: 'Texture fondante, fini confortable. Sèche, mixte, sensible ou mature — nos formules s\'adaptent à chaque peau, même par forte chaleur.',
      },
    ],
    trustLine: 'Des soins sérieux, transparents et pensés pour vous faire confiance — pas des promesses vides.',
  },
  en: {
    kicker: 'Tallow science',
    title: 'Why beef tallow makes a difference',
    lead:
      'Purified beef tallow comes from cattle raised in Senegal, 100% grass-fed. Rich in fatty acids close to your skin\'s own, it nourishes deeply, repairs the barrier and soothes — without a greasy film.',
    points: [
      {
        title: 'Rooted in Senegal',
        desc: 'Our tallow is sourced from Senegalese herders through a transparent local supply chain. Caring for your skin also supports responsible livestock farming in Senegal.',
      },
      {
        title: 'Skin-compatible',
        desc: 'Its lipid profile resembles natural sebum: your skin recognizes tallow and absorbs it better than many synthetic creams.',
      },
      {
        title: 'Stronger skin barrier',
        desc: 'It reduces water loss, protects against dryness and helps skin defend itself — ideal under sun and air conditioning.',
      },
      {
        title: 'For all skin types',
        desc: 'Melting texture, comfortable finish. Dry, combination, sensitive or mature — our formulas adapt to every skin, even in hot weather.',
      },
    ],
    trustLine: 'Serious, transparent care you can trust — not empty promises.',
  },
}

export const homeFounderQuote = {
  fr: {
    quote:
      'J\'ai lancé Tallow & Go, marque sénégalaise, pour offrir des soins qui nourrissent vraiment — sans brûler, sans masquer. Nos formules sont développées avec des professionnels, à partir d\'un suif de bœufs élevés ici, nourris 100 % à l\'herbe.',
    name: 'Penda Thiaw',
    role: 'Fondatrice · Tallow & Go',
  },
  en: {
    quote:
      'I started Tallow & Go, a Senegalese brand, to offer care that truly nourishes — without stinging or masking. Our formulas are developed with professionals, from tallow of cattle raised here, 100% grass-fed.',
    name: 'Penda Thiaw',
    role: 'Founder · Tallow & Go',
  },
}

export const homeContent = {
  fr: {
    whyTitle: 'Pourquoi Tallow & Go ?',
    whyLead:
      'Tallow & Go est une marque sénégalaise. Notre suif de bœuf purifié provient de bœufs élevés au Sénégal, nourris 100 % à l\'herbe. Des formules développées avec des professionnels, pour tous les types de peau — du visage au corps.',
    whyPoints: [
      'Suif 100 % sénégalais · bœufs nourris à l\'herbe',
      'Formules pour tous les types de peau, toute la famille',
      'Développées avec des professionnels de la cosmétique',
      'Fabriquées au Sénégal · livraison nationale & suivi WhatsApp',
    ],
    featuredTitle: 'Les favoris de la maison',
    featuredLead: 'Les produits les plus demandés pour débuter ou compléter votre rituel.',
    routinesTeaserTitle: 'Des routines qui tiennent dans la vraie vie',
    routinesTeaserLead: 'Composez un rituel en 2 ou 3 gestes — nous avons déjà sélectionné les associations qui fonctionnent.',
    bundlesTeaserTitle: 'Coffrets à offrir',
    bundlesTeaserLead: 'Mama Bear pour la maternité, EDEN pour l\'ambiance — pensés pour faire plaisir.',
    deliveryBanner: 'Livraison partout au Sénégal · Paiement Wave, Orange Money ou espèces à la livraison',
  },
  en: {
    whyTitle: 'Why Tallow & Go?',
    whyLead:
      'Tallow & Go is a Senegalese brand. Our purified beef tallow comes from cattle raised in Senegal, 100% grass-fed. Formulas developed with professionals, for all skin types — face to body.',
    whyPoints: [
      '100% Senegalese tallow · grass-fed cattle',
      'Formulas for all skin types, whole family',
      'Developed with cosmetic professionals',
      'Made in Senegal · nationwide delivery & WhatsApp support',
    ],
    featuredTitle: 'House favorites',
    featuredLead: 'Our most-loved products to start or complete your ritual.',
    routinesTeaserTitle: 'Routines that fit real life',
    routinesTeaserLead: 'Build a 2- or 3-step ritual — we have already paired what works together.',
    bundlesTeaserTitle: 'Gift sets',
    bundlesTeaserLead: 'Mama Bear for maternity, EDEN for ambiance — made to delight.',
    deliveryBanner: 'Delivery across Senegal · Pay with Wave, Orange Money or cash on delivery',
  },
}

export const universePageContent = {
  skin: {
    fr: {
      heroImage: '/illustrations/universe-visage.jpg',
      intro:
        'Le visage mérite une attention quotidienne sans surcharge. Nettoyage doux, hydratation intelligente, protection solaire et soins de nuit : chaque produit Visage Tallow & Go est pensé pour clarifier, nourrir et préserver l\'éclat naturel — même sous le soleil dakarois.',
      highlights: [
        'Double nettoyage avec NURTURE + SAFAA pour peaux maquillées',
        'Protection SPF50+ minérale sans traces blanches (SUNSAFE)',
        'Soins nuit réparateurs (NOOR) pour peaux fatiguées ou stressées',
        'Textures légères ou fouettées selon votre préférence',
      ],
      ritualTitle: 'Rituel conseillé',
      ritual:
        'Matin : SAFAA → SHINY → SUNSAFE. Soir : NURTURE → NOOR. Une fois par semaine : AURA pour exfolier en douceur.',
      tip: 'Astuce : appliquez SUNSAFE en dernière étape du matin, 15 min avant de sortir.',
    },
    en: {
      heroImage: '/illustrations/universe-visage.jpg',
      intro:
        'Your face deserves daily care without overload. Gentle cleansing, smart hydration, sun protection and night repair: each Tallow & Go Face product is designed to clarify, nourish and preserve natural glow — even under the Dakar sun.',
      highlights: [
        'Double cleanse with NURTURE + SAFAA for makeup wearers',
        'SPF50+ mineral protection with no white cast (SUNSAFE)',
        'Overnight repair (NOOR) for tired or stressed skin',
        'Light or whipped textures to match your preference',
      ],
      ritualTitle: 'Suggested ritual',
      ritual:
        'Morning: SAFAA → SHINY → SUNSAFE. Evening: NURTURE → NOOR. Once a week: AURA for gentle exfoliation.',
      tip: 'Tip: apply SUNSAFE as your last morning step, 15 minutes before going out.',
    },
  },
  body: {
    fr: {
      heroImage: '/illustrations/universe-corps.jpg',
      intro:
        'Corps sec, peau qui tiraille après la douche, marques de grossesse ou simplement besoin de cocooning : la gamme Corps combine laits généreux, crèmes fouettées et soins Relief pour retrouver souplesse, confort et éclat.',
      highlights: [
        'SHINY : lait visage & corps pour l\'hydratation quotidienne',
        'COCOONY : crème fouettée pour un finish velouté',
        'Relief Dry Oil & Balm : grossesse, peaux sensibles, toute la famille',
        'Textures qui pénètrent sans laisser de film collant',
      ],
      ritualTitle: 'Rituel conseillé',
      ritual: 'Après la douche : SHINY ou Relief Dry Oil. Le soir : COCOONY ou Relief Balm sur zones sèches.',
      tip: 'Astuce : sur peau encore humide, une noisette de lait ou d\'huile sèche suffit.',
    },
    en: {
      heroImage: '/illustrations/universe-corps.jpg',
      intro:
        'Dry body, tight skin after shower, stretch marks or simply a need to cocoon: the Body range combines generous milks, whipped creams and Relief care for suppleness, comfort and glow.',
      highlights: [
        'SHINY: face & body milk for daily hydration',
        'COCOONY: whipped cream for a velvety finish',
        'Relief Dry Oil & Balm: pregnancy, sensitive skin, all ages',
        'Textures that absorb without a sticky film',
      ],
      ritualTitle: 'Suggested ritual',
      ritual: 'After shower: SHINY or Relief Dry Oil. Evening: COCOONY or Relief Balm on dry areas.',
      tip: 'Tip: on damp skin, a dab of milk or dry oil is enough.',
    },
  },
  essentials: {
    fr: {
      heroImage: '/illustrations/universe-essentiels.jpg',
      intro:
        'Les détails comptent : lèvres gercées, pieds fatigués, fraîcheur au quotidien. Les Essentiels regroupent nos soins ciblés — compacts, efficaces, à glisser partout.',
      highlights: [
        'SOFT KISS : baume lèvres nourrissant, format nomade',
        'CLEAN : déodorant naturel sans aluminium',
        'COMFY : galettes fondantes pieds — rituel spa à la maison',
        'Prix accessibles pour compléter votre panier',
      ],
      ritualTitle: 'Rituel conseillé',
      ritual: 'Matin & soir : CLEAN + SOFT KISS. Une à deux fois par semaine : COMFY en massage pieds.',
      tip: 'Astuce : gardez SOFT KISS dans votre sac — une application suffit toute la journée.',
    },
    en: {
      heroImage: '/illustrations/universe-essentiels.jpg',
      intro:
        'Details matter: chapped lips, tired feet, everyday freshness. Essentials gather our targeted cares — compact, effective, easy to carry.',
      highlights: [
        'SOFT KISS: nourishing lip balm, travel-friendly',
        'CLEAN: natural aluminum-free deodorant',
        'COMFY: melting foot melts — spa ritual at home',
        'Accessible prices to complete your cart',
      ],
      ritualTitle: 'Suggested ritual',
      ritual: 'Morning & evening: CLEAN + SOFT KISS. Once or twice a week: COMFY foot massage.',
      tip: 'Tip: keep SOFT KISS in your bag — one application lasts all day.',
    },
  },
  nomades: {
    fr: {
      heroImage: '/illustrations/universe-nomades.jpg',
      intro:
        'Bureau, gym bag, voyage, retouches dans la journée : les Nomades sont nos formats compacts et multi-usages pour ne jamais sacrifier votre peau quand vous êtes en mouvement.',
      highlights: [
        'GLOW & GO : perles fondantes visage, corps, mains',
        'SAFAA, SUNSAFE, CLEAN, SOFT KISS en formats pratiques',
        'Idéal en complément d\'une routine à la maison',
        'Parfait en cadeau ou découverte de la marque',
      ],
      ritualTitle: 'Rituel nomade',
      ritual: 'Dans le sac : SOFT KISS + GLOW & GO. Journée en extérieur : ajoutez SUNSAFE.',
      tip: 'Astuce : 1 à 2 perles GLOW & GO sur cuticules, lèvres ou pommettes — effet glow immédiat.',
    },
    en: {
      heroImage: '/illustrations/universe-nomades.jpg',
      intro:
        'Office, gym bag, travel, touch-ups during the day: Nomades are our compact, multi-use formats so you never compromise your skin on the move.',
      highlights: [
        'GLOW & GO: melting pearls for face, body, hands',
        'SAFAA, SUNSAFE, CLEAN, SOFT KISS in practical sizes',
        'Ideal complement to your home routine',
        'Perfect as a gift or brand discovery',
      ],
      ritualTitle: 'On-the-go ritual',
      ritual: 'In your bag: SOFT KISS + GLOW & GO. Outdoor day: add SUNSAFE.',
      tip: 'Tip: 1–2 GLOW & GO pearls on cuticles, lips or cheekbones — instant glow.',
    },
  },
}

export function getUniverseHeroImage(universeId) {
  const u = universes.find((x) => x.id === universeId)
  const pageKey = universePageKeys[universeId]
  return getPageImage(pageKey) ?? u?.image ?? '/brand/logo-full.png'
}

export const routinesPageContent = {
  fr: {
    intro:
      'Pas besoin de dix produits. Choisissez une routine selon votre moment : matin éclat, nuit réparatrice, soin corps ou pieds. Chaque carte ajoute tous les produits au panier en un clic.',
    tip: 'Commencez par une routine — vous pourrez toujours ajouter un produit ciblé ensuite (FIX IT, COMFY…).',
  },
  en: {
    intro:
      'You do not need ten products. Pick a routine for your moment: morning glow, repair night, body or feet. Each card adds all products to cart in one click.',
    tip: 'Start with one routine — you can always add a targeted product later (FIX IT, COMFY…).',
  },
}

export const bundlesPageContent = {
  fr: {
    intro:
      'Nos coffrets regroupent des produits complémentaires à prix avantageux. Mama Bear accompagne grossesse et post-partum ; EDEN invite la maison dans l\'univers parfumé Tallow & Go.',
    mamaBearDetail:
      'Relief Dry Oil le matin pour l\'élasticité, COMFY et Relief Balm le soir pour apaiser — un rituel maternité complet.',
    edenDetail:
      'Coquillages, pot-pourri, objets nomades et Eden Drops : une expérience sensorielle à offrir ou à s\'offrir.',
  },
  en: {
    intro:
      'Our sets bundle complementary products at a better value. Mama Bear supports pregnancy and postpartum; EDEN brings the scented Tallow & Go world into your home.',
    mamaBearDetail:
      'Relief Dry Oil in the morning for elasticity, COMFY and Relief Balm in the evening to soothe — a complete maternity ritual.',
    edenDetail:
      'Shells, potpourri, travel objects and Eden Drops: a sensorial experience to give or keep.',
  },
}

export const productPageExtras = {
  fr: {
    relatedTitle: 'Vous aimerez aussi',
    backToUniverse: 'Retour à l\'univers',
    addToCart: 'Ajouter au panier',
    priceNote: 'Prix TTC · Livraison calculée au checkout',
  },
  en: {
    relatedTitle: 'You may also like',
    backToUniverse: 'Back to category',
    addToCart: 'Add to cart',
    priceNote: 'Price incl. tax · Shipping calculated at checkout',
  },
}

export const universeCards = universes.map((u) => ({
  id: u.id,
  image: getUniverseHeroImage(u.id),
  path: getUniversePath(u.id),
}))
