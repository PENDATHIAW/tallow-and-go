/** Localités et frais de livraison (FCFA) — Dakar/Rufisque basés sur tarifs marché local */
export const localityGroups = [
  {
    id: 'dakar-1500',
    shippingFee: 1500,
    label: { fr: 'Dakar — Proche (1 500 F)', en: 'Dakar — Near (1,500 F)' },
    localities: [
      { id: 'yoff', name: { fr: 'Yoff', en: 'Yoff' } },
      { id: 'mermoz', name: { fr: 'Mermoz / Sacré-Cœur', en: 'Mermoz / Sacré-Cœur' } },
    ],
  },
  {
    id: 'dakar-2000',
    shippingFee: 2000,
    label: { fr: 'Dakar — Centre (2 000 F)', en: 'Dakar — Center (2,000 F)' },
    localities: [
      { id: 'plateau', name: { fr: 'Plateau', en: 'Plateau' } },
      { id: 'medina', name: { fr: 'Médina', en: 'Médina' } },
      { id: 'fann', name: { fr: 'Fann / Point E / Amitié', en: 'Fann / Point E / Amitié' } },
      { id: 'hlm', name: { fr: 'HLM / Grand Dakar', en: 'HLM / Grand Dakar' } },
      { id: 'liberte', name: { fr: 'Liberté / Sicap', en: 'Liberté / Sicap' } },
      { id: 'dieuppeul', name: { fr: 'Dieuppeul / Derklé', en: 'Dieuppeul / Derklé' } },
      { id: 'colobane', name: { fr: 'Colobane / Fass', en: 'Colobane / Fass' } },
      { id: 'camberene', name: { fr: 'Cambérène', en: 'Cambérène' } },
    ],
  },
  {
    id: 'dakar-2500',
    shippingFee: 2500,
    label: { fr: 'Dakar — Ouest (2 500 F)', en: 'Dakar — West (2,500 F)' },
    localities: [
      { id: 'ouakam', name: { fr: 'Ouakam / Mamelles', en: 'Ouakam / Mamelles' } },
      { id: 'almadies', name: { fr: 'Almadies / Ngor', en: 'Almadies / Ngor' } },
      { id: 'mariste', name: { fr: 'Mariste / Hann', en: 'Mariste / Hann' } },
      { id: 'patte-oie', name: { fr: 'Patte d\'Oie / Foire', en: 'Patte d\'Oie / Foire' } },
    ],
  },
  {
    id: 'dakar-3500',
    shippingFee: 3500,
    label: { fr: 'Dakar — Banlieue (3 500 F)', en: 'Dakar — Suburbs (3,500 F)' },
    localities: [
      { id: 'pikine', name: { fr: 'Pikine', en: 'Pikine' } },
      { id: 'guediawaye', name: { fr: 'Guédiawaye', en: 'Guédiawaye' } },
      { id: 'parcelles', name: { fr: 'Parcelles Assainies', en: 'Parcelles Assainies' } },
      { id: 'thiaroye-gare', name: { fr: 'Thiaroye Gare', en: 'Thiaroye Gare' } },
    ],
  },
  {
    id: 'rufisque-4000',
    shippingFee: 4000,
    label: { fr: 'Rufisque & environs (4 000 F)', en: 'Rufisque area (4,000 F)' },
    localities: [
      { id: 'rufisque', name: { fr: 'Rufisque', en: 'Rufisque' } },
      { id: 'keur-massar', name: { fr: 'Keur Massar', en: 'Keur Massar' } },
      { id: 'mbao', name: { fr: 'Mbao', en: 'Mbao' } },
      { id: 'yeumbeul', name: { fr: 'Yeumbeul / Malika', en: 'Yeumbeul / Malika' } },
      { id: 'bargny', name: { fr: 'Bargny / Diamniadio', en: 'Bargny / Diamniadio' } },
    ],
  },
  {
    id: 'thies-mbour',
    shippingFee: 3000,
    label: { fr: 'Thiès & Mbour (3 000 F)', en: 'Thiès & Mbour (3,000 F)' },
    localities: [
      { id: 'thies', name: { fr: 'Thiès', en: 'Thiès' } },
      { id: 'mbour', name: { fr: 'Mbour / Saly', en: 'Mbour / Saly' } },
    ],
  },
  {
    id: 'regions',
    shippingFee: 5000,
    label: { fr: 'Autres régions (5 000 F)', en: 'Other regions (5,000 F)' },
    localities: [
      { id: 'saint-louis', name: { fr: 'Saint-Louis', en: 'Saint-Louis' } },
      { id: 'touba', name: { fr: 'Touba / Diourbel', en: 'Touba / Diourbel' } },
      { id: 'kaolack', name: { fr: 'Kaolack / Fatick', en: 'Kaolack / Fatick' } },
      { id: 'ziguinchor', name: { fr: 'Ziguinchor / Casamance', en: 'Ziguinchor / Casamance' } },
      { id: 'tambacounda', name: { fr: 'Tambacounda / Kédougou', en: 'Tambacounda / Kédougou' } },
      { id: 'kolda', name: { fr: 'Kolda / Sédhiou', en: 'Kolda / Sédhiou' } },
      { id: 'matam', name: { fr: 'Matam / Podor', en: 'Matam / Podor' } },
      { id: 'louga', name: { fr: 'Louga / Linguère', en: 'Louga / Linguère' } },
      { id: 'autre-region', name: { fr: 'Autre localité régionale', en: 'Other regional location' } },
    ],
  },
]

export function getAllLocalities() {
  return localityGroups.flatMap((group) =>
    group.localities.map((loc) => ({
      ...loc,
      groupId: group.id,
      shippingFee: group.shippingFee,
      groupLabel: group.label,
    })),
  )
}

export function getLocalityById(id) {
  return getAllLocalities().find((l) => l.id === id) ?? null
}

export function getShippingFee(localityId) {
  return getLocalityById(localityId)?.shippingFee ?? 5000
}
