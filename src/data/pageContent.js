import { universes } from './catalog'
import { getUniversePath } from './routes'

/** Contenu éditorial riche — remplace les images par /public/illustrations/ quand disponibles */
export const trustPillars = {
  fr: [
    { title: 'Suif purifié', desc: 'Base lipidique proche de la peau, formulée et fabriquée au Sénégal.' },
    { title: 'Ingrédients nobles', desc: 'Beurre de karité, huiles végétales, actifs choisis avec exigence.' },
    { title: 'Sans compromis', desc: 'Formules pensées pour peaux métissées, sensibles et climat tropical.' },
    { title: 'Livraison Dakar', desc: 'Expédition soignée — tarifs selon votre localité dès 1 500 F.' },
  ],
  en: [
    { title: 'Purified tallow', desc: 'Skin-compatible lipid base, formulated and made in Senegal.' },
    { title: 'Noble ingredients', desc: 'Shea butter, botanical oils, carefully selected actives.' },
    { title: 'No compromise', desc: 'Formulas designed for melanin-rich, sensitive skin in tropical climates.' },
    { title: 'Dakar delivery', desc: 'Careful shipping — rates from 1,500 F depending on your area.' },
  ],
}

export const homeContent = {
  fr: {
    whyTitle: 'Pourquoi Tallow & Go ?',
    whyLead:
      'Le suif purifié nourrit la peau en profondeur sans film gras. Nos formules associent savoir-faire local, textures sensorielles et routines simples — du visage au corps, pour toute la famille.',
    whyPoints: [
      'Textures fondantes adaptées aux peaux foncées et mixtes',
      'Routines courtes : matin, nuit, hebdo — sans surcharger votre salle de bain',
      'Formats nomades pour le sac, le bureau et les voyages',
      'Commande en ligne, livraison au Sénégal et suivi par notre équipe',
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
      'Purified tallow nourishes deeply without a greasy film. Our formulas blend local know-how, sensorial textures and simple routines — face to body, for the whole family.',
    whyPoints: [
      'Melting textures suited to deep and combination skin tones',
      'Short routines: morning, night, weekly — without cluttering your bathroom',
      'Travel formats for bag, office and trips',
      'Order online, delivery in Senegal with support from our team',
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
  return universePageContent[universeId]?.fr?.heroImage ?? u?.image ?? '/brand/logo-full.png'
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
  image: u.image,
  path: getUniversePath(u.id),
}))
